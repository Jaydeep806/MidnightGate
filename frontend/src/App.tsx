import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TierSelector } from './components/TierSelector';
import { ProofGenerator } from './components/ProofGenerator';
import { PrivacyInspector } from './components/PrivacyInspector';
import { VerifiableCredentialCard } from './components/VerifiableCredentialCard';
import { ContractStats } from './components/ContractStats';
import { WalletModal } from './components/WalletModal';
import { TIERS, midnightClient } from './midnight/midnightClient';
import { walletService } from './midnight/laceConnector';
import { IssuedCredential, ProverStep, VerificationTier, WalletState, WalletType } from './types';
import { Github, Moon } from 'lucide-react';

export const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    walletName: '',
    network: 'Midnight Preprod',
    balance: '0.00 tDUST',
    connectorType: 'DEMO_WALLET'
  });
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<VerificationTier>(TIERS[0]);
  const [proverStep, setProverStep] = useState<ProverStep>('IDLE');
  const [proverLog, setProverLog] = useState<string>('');
  const [issuedCredential, setIssuedCredential] = useState<IssuedCredential | null>(null);

  const handleOpenWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const handleSelectWallet = async (type: WalletType) => {
    try {
      setIsConnecting(true);
      let state: WalletState;
      if (type === 'LACE_DAPP_CONNECTOR') {
        state = await walletService.connectLace();
      } else if (type === 'STELLAR_FREIGHTER') {
        state = await walletService.connectFreighter();
      } else {
        state = await walletService.connectDemo();
      }
      setWallet(state);
      setIsWalletModalOpen(false);
    } catch (err) {
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    const state = await walletService.disconnect();
    setWallet(state);
    setIssuedCredential(null);
    setProverStep('IDLE');
  };

  const handleGenerateProof = async (privateAssetAmountUSD: number) => {
    try {
      setIssuedCredential(null);
      const credential = await midnightClient.executeVerificationFlow(
        privateAssetAmountUSD,
        selectedTier,
        wallet.address || 'midnight1addr_user',
        (step, log) => {
          setProverStep(step);
          setProverLog(log);
        }
      );
      setIssuedCredential(credential);
    } catch (error: any) {
      console.error('Verification flow error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-midnight-950 text-slate-100">
      <Navbar
        wallet={wallet}
        onOpenConnectModal={handleOpenWalletModal}
        onDisconnect={handleDisconnectWallet}
        isConnecting={isConnecting}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <Hero />
        
        <ContractStats />

        <div className="max-w-4xl mx-auto space-y-8">
          <TierSelector
            tiers={TIERS}
            selectedTier={selectedTier}
            onSelectTier={(tier) => {
              setSelectedTier(tier);
              setIssuedCredential(null);
              setProverStep('IDLE');
            }}
            disabled={['FETCHING_WITNESS', 'INITIALIZING_CIRCUIT', 'GENERATING_ZK_PROOF', 'SUBMITTING_TO_MIDNIGHT'].includes(proverStep)}
          />

          {issuedCredential ? (
            <VerifiableCredentialCard
              credential={issuedCredential}
              onReset={() => {
                setIssuedCredential(null);
                setProverStep('IDLE');
              }}
            />
          ) : (
            <ProofGenerator
              wallet={wallet}
              selectedTier={selectedTier}
              proverStep={proverStep}
              proverLog={proverLog}
              onGenerateProof={handleGenerateProof}
              onConnectWallet={handleOpenWalletModal}
            />
          )}

          <PrivacyInspector selectedTier={selectedTier} />
        </div>
      </main>

      {/* Wallet Selection Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={handleSelectWallet}
        isConnecting={isConnecting}
      />

      <footer className="border-t border-slate-900 bg-midnight-950/90 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Moon className="w-4 h-4 text-purple-400" />
            <span>Built for Rise In Moonshots on Midnight • Levels 1, 2, 3</span>
          </div>
          <div className="flex items-center space-x-4 font-mono">
            <a 
              href="https://github.com/Jaydeep806/MidnightGate" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Jaydeep806/MidnightGate</span>
            </a>
            <span>•</span>
            <span className="text-purple-400 font-semibold">Midnight Preprod</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
