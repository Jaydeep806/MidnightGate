import React from 'react';
import { WalletState } from '../types';
import { Shield, Wallet, CheckCircle2, ExternalLink, Rocket, Sparkles } from 'lucide-react';

interface NavbarProps {
  wallet: WalletState;
  onOpenConnectModal: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onOpenConnectModal,
  onDisconnect,
  isConnecting
}) => {
  const getWalletIcon = () => {
    switch (wallet.connectorType) {
      case 'STELLAR_FREIGHTER':
        return <Rocket className="w-3.5 h-3.5 text-sky-400" />;
      case 'DEMO_WALLET':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getWalletBadgeClass = () => {
    switch (wallet.connectorType) {
      case 'STELLAR_FREIGHTER':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'DEMO_WALLET':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-purple-300 bg-purple-500/10 border-purple-500/20';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-indigo-950/60 bg-midnight-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-midnight-accent via-midnight-glow to-amber-400 p-0.5 shadow-lg shadow-purple-900/40">
              <div className="w-full h-full bg-midnight-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-midnight-accent" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                Midnight<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-300">Gate</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Preprod
              </span>
            </div>
            <p className="text-xs text-slate-400">Zero-Knowledge Net Worth & Eligibility Protocol</p>
          </div>
        </div>

        {/* Navigation & Wallet Button */}
        <div className="flex items-center space-x-4">
          <a 
            href="https://midnight.network" 
            target="_blank" 
            rel="noreferrer"
            className="hidden sm:flex items-center space-x-1 text-xs text-slate-400 hover:text-purple-300 transition-colors font-mono"
          >
            <span>Midnight Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          {wallet.isConnected ? (
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center space-x-1.5">
                  <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full border flex items-center space-x-1 ${getWalletBadgeClass()}`}>
                    {getWalletIcon()}
                    <span>{wallet.walletName || 'Connected'}</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 truncate max-w-[150px] mt-0.5">
                  {wallet.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}` : ''}
                </span>
              </div>
              <button
                onClick={onDisconnect}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all shadow-sm cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenConnectModal}
              disabled={isConnecting}
              className="relative group px-5 py-2.5 rounded-xl font-medium text-sm text-white overflow-hidden transition-all shadow-lg shadow-purple-950/50 hover:shadow-purple-700/30 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
