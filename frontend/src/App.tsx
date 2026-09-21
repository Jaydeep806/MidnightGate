import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TierSelector } from './components/TierSelector';
import { ProofGenerator } from './components/ProofGenerator';
import { PrivacyInspector } from './components/PrivacyInspector';
import { VerifiableCredentialCard } from './components/VerifiableCredentialCard';
import { ContractStats } from './components/ContractStats';
import { VerifierPortal } from './components/VerifierPortal';
import { ContractExplorer } from './components/ContractExplorer';
import { WalletModal } from './components/WalletModal';
import { FaucetModal } from './components/FaucetModal';
import { ToastContainer } from './components/Toast';
import { TIERS, midnightClient } from './midnight/midnightClient';
import { walletService } from './midnight/laceConnector';
import { IssuedCredential, NavigationPage, ProverStep, ToastNotification, VerificationTier, WalletState, WalletType } from './types';
import { Github, Moon, Lock, Search, FileCode } from 'lucide-react';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<NavigationPage>('PROVER_GATEWAY');
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    walletName: '',
    network: 'Midnight Preprod',
    balance: '0.00 tDUST',
    connectorType: 'DEMO_WALLET'
  });
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isFaucetModalOpen, setIsFaucetModalOpen] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<VerificationTier>(TIERS[0]);
  const [proverStep, setProverStep] = useState<ProverStep>('IDLE');
  const [proverLog, setProverLog] = useState<string>('');
  const [issuedCredential, setIssuedCredential] = useState<IssuedCredential | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

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
      addToast('Wallet Connected', `Connected to ${state.walletName} on ${state.network}`, 'success');
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      addToast('Connection Failed', err.message || 'Could not connect wallet', 'error');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    const state = await walletService.disconnect();
    setWallet(state);
    setIssuedCredential(null);
    setProverStep('IDLE');
    addToast('Wallet Disconnected', 'Session cleared', 'info');
  };

  const handleGenerateProof = async (privateAssetAmountUSD: number) => {
    try {
      setIssuedCredential(null);
      const credential = await midnightClient.executeVerificationFlow(
        privateAssetAmountUSD,
        selectedTier,
        wallet.address || 'midnight1addr_user',
        'aave_midnight_vault',
        (step, log) => {
          setProverStep(step);
          setProverLog(log);
        }
      );
      setIssuedCredential(credential);
      addToast('Proof Confirmed!', `Credential registered on-chain in Block #${credential.blockHeight}`, 'success');
    } catch (error: any) {
      console.error('Verification flow error:', error);
      addToast('Proof Failed', error.message || 'Circuit constraint error', 'error');
    }
  };

  const handleFaucetSuccess = (amount: string) => {
    addToast('Airdrop Claimed', `Received ${amount} testnet tokens on Preprod`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-midnight-950 text-slate-100">
      <Navbar
        activePage={activePage}
        onSelectPage={setActivePage}
        wallet={wallet}
        onOpenConnectModal={handleOpenWalletModal}
        onOpenFaucetModal={() => setIsFaucetModalOpen(true)}
        onDisconnect={handleDisconnectWallet}
        isConnecting={isConnecting}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* PAGE 1: ZK PROVER GATEWAY (User / Investor View) */}
        {activePage === 'PROVER_GATEWAY' && (
          <div className="space-y-12 animate-fadeIn">
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
          </div>
        )}

        {/* PAGE 2: PROTOCOL VERIFIER & NULLIFIER REGISTRY (DeFi Protocol View) */}
        {activePage === 'PROTOCOL_VERIFIER' && (
          <VerifierPortal />
        )}

        {/* PAGE 3: SMART CONTRACT & MATRIX (Developer / Judge View) */}
        {activePage === 'CONTRACT_SPECS' && (
          <ContractExplorer />
        )}
      </main>

      {/* Wallet Selection Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={handleSelectWallet}
        isConnecting={isConnecting}
      />

      {/* Preprod Testnet Faucet Modal */}
      <FaucetModal
        isOpen={isFaucetModalOpen}
        onClose={() => setIsFaucetModalOpen(false)}
        userAddress={wallet.address}
        onSuccess={handleFaucetSuccess}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-midnight-950/90 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <Moon className="w-4 h-4 text-purple-400" />
            <span>Built for Rise In Moonshots on Midnight • Levels 1, 2, 3</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActivePage('PROVER_GATEWAY')}
              className={`hover:text-white transition-colors flex items-center space-x-1 ${
                activePage === 'PROVER_GATEWAY' ? 'text-purple-300 font-bold' : ''
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>ZK Gateway</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage('PROTOCOL_VERIFIER')}
              className={`hover:text-white transition-colors flex items-center space-x-1 ${
                activePage === 'PROTOCOL_VERIFIER' ? 'text-purple-300 font-bold' : ''
              }`}
            >
              <Search className="w-3 h-3" />
              <span>Verifier &amp; Feed</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage('CONTRACT_SPECS')}
              className={`hover:text-white transition-colors flex items-center space-x-1 ${
                activePage === 'CONTRACT_SPECS' ? 'text-purple-300 font-bold' : ''
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>Smart Contract</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 font-mono">
            <a 
              href="https://github.com/Jaydeep806/MidnightGate" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Jaydeep806/MidnightGate</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
