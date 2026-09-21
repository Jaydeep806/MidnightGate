import React from 'react';
import { Lock, CheckCircle, Cpu, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative py-14 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
      {/* Dynamic Ambient Background Auras — multiple layered glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none -z-10 opacity-80">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-indigo-600/25 to-blue-600/20 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute inset-4 bg-gradient-to-tr from-purple-500/10 via-transparent to-amber-500/10 rounded-full blur-[60px]" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute top-10 left-[15%] w-2 h-2 rounded-full bg-purple-400/30 animate-float"></div>
      <div className="absolute top-20 right-[20%] w-1.5 h-1.5 rounded-full bg-blue-400/25 animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-10 left-[25%] w-1 h-1 rounded-full bg-amber-400/30 animate-float" style={{ animationDelay: '2.5s' }}></div>

      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-500/15 via-indigo-500/15 to-blue-500/15 border border-violet-500/30 text-xs font-mono font-medium mb-8 shadow-lg shadow-violet-950/40 backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-blue-300 to-amber-300 font-semibold">
          Midnight Request for Startups — Finance &amp; Compliance Track
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
        Prove Your Net Worth. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-amber-300 drop-shadow-[0_0_40px_rgba(139,92,246,0.35)]">
          Never Reveal Your Balance.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-300/90 max-w-3xl mx-auto mb-12 leading-relaxed font-sans">
        The zero-knowledge compliance gateway on <strong className="text-white font-semibold">Midnight Network</strong>. 
        Cryptographically prove <span className="text-violet-300 font-semibold">Accredited Investor ($100k+)</span> or institutional status without exposing bank balances or uploading personal financial documents.
      </p>

      {/* Key Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto text-left">
        <div className="glass-card rounded-2xl p-5 flex items-start space-x-4 hover:scale-[1.03] transition-all duration-300 group">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 border border-blue-500/25 mt-0.5 shadow-sm group-hover:shadow-blue-500/20 group-hover:shadow-lg transition-shadow">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              Private Witness
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Asset balances remain 100% on your local machine. Zero data exposure.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-start space-x-4 hover:scale-[1.03] transition-all duration-300 group">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 text-purple-400 border border-purple-500/25 mt-0.5 shadow-sm group-hover:shadow-purple-500/20 group-hover:shadow-lg transition-shadow">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              zk-SNARK Circuits
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Compact engine proves <code className="text-purple-300 font-mono bg-purple-500/10 px-1 rounded">balance ≥ threshold</code>.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-start space-x-4 hover:scale-[1.03] transition-all duration-300 group">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/25 mt-0.5 shadow-sm group-hover:shadow-amber-500/20 group-hover:shadow-lg transition-shadow">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-sans">Public Preprod Ledger</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Atomic on-chain verification with anti-replay nullifiers.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
