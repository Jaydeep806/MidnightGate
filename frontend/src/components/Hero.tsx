import React from 'react';
import { Lock, CheckCircle, Cpu, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative py-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
      {/* Dynamic Ambient Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-gradient-to-r from-cyan-500/15 via-purple-600/20 to-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-6 shadow-lg shadow-cyan-950/40">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-300 font-semibold">
          Midnight Request for Startups — Finance &amp; Compliance Track
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
        Prove Your Net Worth. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300 drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
          Never Reveal Your Balance.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-sans">
        The zero-knowledge compliance gateway on <strong className="text-white font-semibold">Midnight Network</strong>. 
        Cryptographically prove <span className="text-cyan-300 font-semibold">Accredited Investor ($100k+)</span> or institutional status without exposing bank balances or uploading personal financial documents.
      </p>

      {/* Key Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
        <div className="glass-card rounded-2xl p-4.5 flex items-start space-x-3.5 hover:scale-[1.02] transition-transform">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 mt-0.5 shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-sans">Private Witness</h4>
            <p className="text-xs text-slate-400 mt-0.5">Asset balances remain 100% on your local machine.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4.5 flex items-start space-x-3.5 hover:scale-[1.02] transition-transform">
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 mt-0.5 shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-sans">zk-SNARK Circuits</h4>
            <p className="text-xs text-slate-400 mt-0.5">Compact engine proves <code className="text-purple-300 font-mono">balance &gt;= threshold</code>.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4.5 flex items-start space-x-3.5 hover:scale-[1.02] transition-transform">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 mt-0.5 shadow-sm">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-sans">Public Preprod Ledger</h4>
            <p className="text-xs text-slate-400 mt-0.5">Atomic on-chain verification with anti-replay nullifiers.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
