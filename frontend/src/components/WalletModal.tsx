import React, { useEffect, useState } from 'react';
import { X, Sparkles, Shield, ArrowRight, Loader2, AlertTriangle, ExternalLink, CheckCircle2, Cpu } from 'lucide-react';
import { WalletType } from '../types';
import { walletService } from '../midnight/laceConnector';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (type: WalletType) => Promise<void>;
  isConnecting: boolean;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onSelectWallet,
  isConnecting
}) => {
  const [hasLace, setHasLace] = useState<boolean>(false);
  const [hasProofServer, setHasProofServer] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activePendingWallet, setActivePendingWallet] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setActivePendingWallet(null);
      walletService.hasLaceExtension().then(setHasLace);
      walletService.hasProofServer().then(setHasProofServer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = async (type: WalletType) => {
    try {
      setErrorMessage(null);
      if (type === 'LACE_DAPP_CONNECTOR') {
        setActivePendingWallet('Lace Wallet');
      } else if (type === 'MIDNIGHT_PROOF_SERVER') {
        setActivePendingWallet('Local Proof Server');
      } else {
        setActivePendingWallet('Quick Demo');
      }

      await onSelectWallet(type);
    } catch (err: any) {
      console.error('Wallet modal connection error:', err);
      setErrorMessage(err.message || 'Failed to connect wallet.');
    } finally {
      setActivePendingWallet(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl bg-midnight-900/95 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white font-sans">Connect Midnight Wallet</h2>
            <p className="text-xs text-slate-400">Select an official Midnight connector or sandbox account</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 space-y-2.5">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-100">{errorMessage}</p>
              </div>
            </div>

            {errorMessage.includes('LACE') && (
              <div className="flex items-center space-x-2 pt-1">
                <a
                  href="https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs inline-flex items-center space-x-1 hover:bg-purple-500 transition-all shadow"
                >
                  <span>Install Lace Extension</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleConnect('DEMO_WALLET')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:text-white transition-all"
                >
                  Use Demo Wallet
                </button>
              </div>
            )}
          </div>
        )}

        {/* Wallet Choices List */}
        <div className="mt-5 space-y-3">
          {/* Option 1: Lace Wallet (Midnight Preprod) */}
          <button
            onClick={() => handleConnect('LACE_DAPP_CONNECTOR')}
            disabled={isConnecting}
            className="w-full text-left p-4 rounded-2xl glass-card hover:border-purple-500/60 hover:bg-midnight-850/80 transition-all flex items-center justify-between group cursor-pointer border border-purple-500/20 relative"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-md shadow-purple-900/40 flex-shrink-0">
                <div className="w-full h-full bg-midnight-950 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    Lace Wallet
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Midnight Preprod
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  {hasLace ? (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Lace Extension Ready (mnLace)</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">
                      Midnight DApp Connector (Popup Prompt)
                    </span>
                  )}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Option 2: Local Midnight Proof Server */}
          <button
            onClick={() => handleConnect('MIDNIGHT_PROOF_SERVER')}
            disabled={isConnecting}
            className="w-full text-left p-4 rounded-2xl glass-card hover:border-sky-500/60 hover:bg-midnight-850/80 transition-all flex items-center justify-between group cursor-pointer border border-sky-500/20"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-md shadow-sky-900/40 flex-shrink-0">
                <div className="w-full h-full bg-midnight-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    Local Proof Server
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    localhost:6300
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  {hasProofServer ? (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Proof Server Online</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">
                      Standard Midnight Proof Synthesizer
                    </span>
                  )}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-300 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Option 3: Quick Demo Testnet Sandbox Wallet */}
          <button
            onClick={() => handleConnect('DEMO_WALLET')}
            disabled={isConnecting}
            className="w-full text-left p-4 rounded-2xl glass-card hover:border-emerald-500/60 hover:bg-midnight-850/80 transition-all flex items-center justify-between group cursor-pointer border border-emerald-500/20"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-0.5 shadow-md shadow-emerald-900/40 flex-shrink-0">
                <div className="w-full h-full bg-midnight-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Quick Demo Sandbox
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Instant 1-Click
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pre-funded 5,000 tDUST • Ready for instant evaluator &amp; judge verification
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Live Loading Prompt */}
        {isConnecting && (
          <div className="mt-4 p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center space-x-2.5 text-xs font-mono text-purple-200">
            <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
            <span>
              {activePendingWallet
                ? `Prompting ${activePendingWallet}... Please check your browser popup.`
                : 'Connecting to wallet...'}
            </span>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Midnight Preprod Testnet</span>
          <span className="text-purple-300">Zero-Knowledge Secured</span>
        </div>
      </div>
    </div>
  );
};

