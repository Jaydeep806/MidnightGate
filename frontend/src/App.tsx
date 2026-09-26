import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TierSelector } from './components/TierSelector';
import { ProofGenerator } from './components/ProofGenerator';
import { PrivacyInspector } from './components/PrivacyInspector';
import { VerifiableCredentialCard } from './components/VerifiableCredentialCard';
import { ContractStats } from './components/ContractStats';
import { DeFiVaultDemo } from './components/DeFiVaultDemo';
import { GateBuilder } from './components/GateBuilder';
import { CircuitVisualizer } from './components/CircuitVisualizer';
import { VerifierPortal } from './components/VerifierPortal';
import { ContractExplorer } from './components/ContractExplorer';
import { WalletModal } from './components/WalletModal';
import { FaucetModal } from './components/FaucetModal';
import { ToastContainer } from './components/Toast';
import { TIERS, midnightClient } from './midnight/midnightClient';
import { walletService } from './midnight/laceConnector';
import { IssuedCredential, NavigationPage, ProverStep, ToastNotification, VerificationTier, WalletState, WalletType } from './types';
import { Github, Moon, Lock, Landmark, Settings, Cpu, Search, FileCode } from 'lucide-react';

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
      } else if (type === 'MIDNIGHT_PROOF_SERVER') {
        state = await walletService.connectProofServer();
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

  const handleGenerateProof = async (privateAssetAmountUSD: number, forceInvalidSig: boolean = false) => {
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
        },
        forceInvalidSig
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
    <div className="min-h-screen flex flex-col font-sans text-slate-100 selection:bg-purple-600 selection:text-white">
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
        {/* VIEW 1: ZK PROVER GATEWAY (User / Investor View) */}
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
                <div className="space-y-4">
                  <VerifiableCredentialCard
                    credential={issuedCredential}
                    onReset={() => {
                      setIssuedCredential(null);
                      setProverStep('IDLE');
                    }}
                  />
                  
                  {/* CTA to use the proof in DeFi Vault */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Landmark className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs text-slate-200">
                        You have an active Accredited Investor credential. Ready to test private borrowing?
                      </span>
                    </div>
                    <button
                      onClick={() => setActivePage('DEFI_VAULT_DEMO')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer"
                    >
                      Open DeFi Vault →
                    </button>
                  </div>
                </div>
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

        {/* VIEW 2: DEFI LENDING VAULT DEMO (Cross-Protocol Application View) */}
        {activePage === 'DEFI_VAULT_DEMO' && (
          <DeFiVaultDemo
            wallet={wallet}
            activeCredential={issuedCredential}
            onNavigateToProver={() => setActivePage('PROVER_GATEWAY')}
            onOpenConnectModal={handleOpenWalletModal}
            onShowToast={addToast}
          />
        )}

        {/* VIEW 3: B2B CUSTOM GATE BUILDER (Protocol Creator View) */}
        {activePage === 'GATE_BUILDER' && (
          <GateBuilder />
        )}

        {/* VIEW 4: CIRCUIT & MATH VISUALIZER (Cryptographic Engine View) */}
        {activePage === 'CIRCUIT_VISUALIZER' && (
          <CircuitVisualizer />
        )}

        {/* VIEW 5: PROTOCOL VERIFIER & NULLIFIER REGISTRY (DeFi Explorer View) */}
        {activePage === 'PROTOCOL_VERIFIER' && (
          <VerifierPortal />
        )}

        {/* VIEW 6: SMART CONTRACT SPECS & GRADING MATRIX (Judge View) */}
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
      <footer className="border-t border-indigo-950/50 bg-slate-950/60 backdrop-blur-xl py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <Moon className="w-4 h-4 text-purple-400" />
            <span>Built for Rise In Moonshots on Midnight • Levels 1, 2, 3</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-sans text-[11px]">
            <button
              onClick={() => setActivePage('PROVER_GATEWAY')}
              className={`hover:text-white transition-colors flex items-center space-x-1 ${
                activePage === 'PROVER_GATEWAY' ? 'text-purple-300 font-bold' : ''
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>ZK Prover</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage('DEFI_VAULT_DEMO')}
              className={`hover:text-white transition-colors flex items-center space-x-1 ${
                activePage === 'DEFI_VAULT_DEMO' ? 'text-emerald-300 font-bold' : ''
              }`}
            >
              <Landmark className="w-3 h-3" />
              <span>DeFi Vault</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage('GATE_BUILDER')}
              className={`hover:text-white transition-colors flex items-center space-x-1 ${
                activePage === 'GATE_BUILDER' ? 'text-amber-300 font-bold' : ''
              }`}
            >
              <Settings className="w-3 h-3" />
              <span>Gate Builder</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage('CIRCUIT_VISUALIZER')}
              className={`hover:text-white transition-colors flex items-center space-x-1 ${
                activePage === 'CIRCUIT_VISUALIZER' ? 'text-indigo-300 font-bold' : ''
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>Circuit Math</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage('PROTOCOL_VERIFIER')}
              className={`hover:text-white transition-colors flex items-center space-x-1 ${
                activePage === 'PROTOCOL_VERIFIER' ? 'text-purple-300 font-bold' : ''
              }`}
            >
              <Search className="w-3 h-3" />
              <span>Verifier</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage('CONTRACT_SPECS')}
              className={`hover:text-white transition-colors flex items-center space-x-1 ${
                activePage === 'CONTRACT_SPECS' ? 'text-purple-300 font-bold' : ''
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>Matrix</span>
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
