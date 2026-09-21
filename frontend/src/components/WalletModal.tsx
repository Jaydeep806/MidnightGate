import React from 'react';
import { X, Sparkles, Rocket, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { WalletType } from '../types';
import { walletService } from '../midnight/laceConnector';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (type: WalletType) => void;
  isConnecting: boolean;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onSelectWallet,
  isConnecting
}) => {
  if (!isOpen) return null;

  const hasLace = walletService.hasLaceExtension();
  const hasFreighter = walletService.hasFreighterExtension();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl bg-midnight-900/95 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white font-sans">Connect Your Wallet</h2>
            <p className="text-xs text-slate-400">Select a wallet to interact with MidnightGate ZK circuits</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallet Choices List */}
        <div className="mt-6 space-y-3">
          {/* Option 1: Lace Wallet (Midnight Preprod) */}
          <button
            onClick={() => onSelectWallet('LACE_DAPP_CONNECTOR')}
            disabled={isConnecting}
            className="w-full text-left p-4 rounded-2xl glass-card hover:border-purple-500/60 hover:bg-midnight-850/80 transition-all flex items-center justify-between group cursor-pointer border border-purple-500/20"
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
                <p className="text-xs text-slate-400 mt-0.5">
                  {hasLace ? 'Extension Detected (Ready)' : 'Native Midnight DApp Connector'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Option 2: Stellar Freighter Wallet */}
          <button
            onClick={() => onSelectWallet('STELLAR_FREIGHTER')}
            disabled={isConnecting}
            className="w-full text-left p-4 rounded-2xl glass-card hover:border-sky-500/60 hover:bg-midnight-850/80 transition-all flex items-center justify-between group cursor-pointer border border-sky-500/20"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-md shadow-blue-900/40 flex-shrink-0">
                <div className="w-full h-full bg-midnight-950 rounded-[10px] flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    Stellar Freighter
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    Cross-Chain
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {hasFreighter ? 'Freighter Detected (Ready)' : 'Stellar / Soroban Cross-Chain ZK Gate'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-300 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Option 3: Quick Demo Testnet Wallet */}
          <button
            onClick={() => onSelectWallet('DEMO_WALLET')}
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
                    Quick Demo Wallet
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Instant 1-Click
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Preloaded with 5,000 tDUST for instant testing
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Loading Indicator */}
        {isConnecting && (
          <div className="mt-4 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center space-x-2 text-xs font-mono text-purple-300">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Establishing Secure Zero-Knowledge Session...</span>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Supported: Midnight Preprod &amp; Stellar Testnet</span>
          <span className="text-emerald-400">● Live Sandbox</span>
        </div>
      </div>
    </div>
  );
};
