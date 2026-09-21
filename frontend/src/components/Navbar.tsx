import React from 'react';
import { NavigationPage, WalletState } from '../types';
import { Shield, Wallet, CheckCircle2, Rocket, Sparkles, Droplets, Lock, Search, FileCode, Landmark, Settings, Cpu } from 'lucide-react';

interface NavbarProps {
  activePage: NavigationPage;
  onSelectPage: (page: NavigationPage) => void;
  wallet: WalletState;
  onOpenConnectModal: () => void;
  onOpenFaucetModal: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onSelectPage,
  wallet,
  onOpenConnectModal,
  onOpenFaucetModal,
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
    <header className="sticky top-0 z-40 border-b border-indigo-950/40 bg-slate-950/70 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Brand */}
        <div 
          onClick={() => onSelectPage('PROVER_GATEWAY')}
          className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-midnight-accent via-midnight-glow to-amber-400 p-0.5 shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform">
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
            <p className="text-[11px] text-slate-400">ZK Institutional Compliance Protocol</p>
          </div>
        </div>

        {/* Navigation Page Tabs (Desktop Full Multi-page switcher) */}
        <nav className="hidden xl:flex items-center space-x-1 p-1 rounded-2xl bg-midnight-900/90 border border-slate-800">
          <button
            onClick={() => onSelectPage('PROVER_GATEWAY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans flex items-center space-x-1.5 transition-all cursor-pointer ${
              activePage === 'PROVER_GATEWAY'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>ZK Prover</span>
          </button>

          <button
            onClick={() => onSelectPage('DEFI_VAULT_DEMO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans flex items-center space-x-1.5 transition-all cursor-pointer ${
              activePage === 'DEFI_VAULT_DEMO'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-300" />
            <span>DeFi Vault</span>
          </button>

          <button
            onClick={() => onSelectPage('GATE_BUILDER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans flex items-center space-x-1.5 transition-all cursor-pointer ${
              activePage === 'GATE_BUILDER'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-amber-300" />
            <span>Gate Builder</span>
          </button>

          <button
            onClick={() => onSelectPage('CIRCUIT_VISUALIZER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans flex items-center space-x-1.5 transition-all cursor-pointer ${
              activePage === 'CIRCUIT_VISUALIZER'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-300" />
            <span>Circuit Math</span>
          </button>

          <button
            onClick={() => onSelectPage('PROTOCOL_VERIFIER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans flex items-center space-x-1.5 transition-all cursor-pointer ${
              activePage === 'PROTOCOL_VERIFIER'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Verifier</span>
          </button>

          <button
            onClick={() => onSelectPage('CONTRACT_SPECS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-sans flex items-center space-x-1.5 transition-all cursor-pointer ${
              activePage === 'CONTRACT_SPECS'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Matrix</span>
          </button>
        </nav>

        {/* Actions (Faucet & Wallet) */}
        <div className="flex items-center space-x-3">
          {/* Faucet Button */}
          <button
            onClick={onOpenFaucetModal}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-900/50 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <Droplets className="w-3.5 h-3.5 text-amber-400" />
            <span>Preprod Faucet</span>
          </button>

          {wallet.isConnected ? (
            <div className="flex items-center space-x-3">
              <div className="hidden lg:flex flex-col items-end">
                <div className="flex items-center space-x-1.5">
                  <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full border flex items-center space-x-1 ${getWalletBadgeClass()}`}>
                    {getWalletIcon()}
                    <span>{wallet.walletName || 'Connected'}</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 truncate max-w-[140px] mt-0.5">
                  {wallet.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}` : ''}
                </span>
              </div>
              <button
                onClick={onDisconnect}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all shadow-sm cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenConnectModal}
              disabled={isConnecting}
              className="relative group px-4 sm:px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white overflow-hidden transition-all shadow-lg shadow-purple-950/50 hover:shadow-purple-700/30 cursor-pointer"
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

      {/* Sub-header Navigation Bar for tablet/mobile */}
      <div className="flex xl:hidden items-center justify-around border-t border-slate-800/80 px-2 py-2 bg-slate-950/80 backdrop-blur-xl overflow-x-auto text-[11px] font-mono">
        <button
          onClick={() => onSelectPage('PROVER_GATEWAY')}
          className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 flex-shrink-0 ${
            activePage === 'PROVER_GATEWAY' ? 'bg-purple-600 text-white' : 'text-slate-400'
          }`}
        >
          <Lock className="w-3 h-3" />
          <span>ZK Prover</span>
        </button>

        <button
          onClick={() => onSelectPage('DEFI_VAULT_DEMO')}
          className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 flex-shrink-0 ${
            activePage === 'DEFI_VAULT_DEMO' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          <Landmark className="w-3 h-3 text-emerald-300" />
          <span>DeFi Vault</span>
        </button>

        <button
          onClick={() => onSelectPage('GATE_BUILDER')}
          className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 flex-shrink-0 ${
            activePage === 'GATE_BUILDER' ? 'bg-amber-600 text-white' : 'text-slate-400'
          }`}
        >
          <Settings className="w-3 h-3 text-amber-300" />
          <span>Gate Builder</span>
        </button>

        <button
          onClick={() => onSelectPage('CIRCUIT_VISUALIZER')}
          className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 flex-shrink-0 ${
            activePage === 'CIRCUIT_VISUALIZER' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Cpu className="w-3 h-3 text-indigo-300" />
          <span>Circuit Math</span>
        </button>

        <button
          onClick={() => onSelectPage('PROTOCOL_VERIFIER')}
          className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 flex-shrink-0 ${
            activePage === 'PROTOCOL_VERIFIER' ? 'bg-purple-600 text-white' : 'text-slate-400'
          }`}
        >
          <Search className="w-3 h-3" />
          <span>Verifier</span>
        </button>

        <button
          onClick={() => onSelectPage('CONTRACT_SPECS')}
          className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 flex-shrink-0 ${
            activePage === 'CONTRACT_SPECS' ? 'bg-purple-600 text-white' : 'text-slate-400'
          }`}
        >
          <FileCode className="w-3 h-3" />
          <span>Matrix</span>
        </button>
      </div>
    </header>
  );
};
