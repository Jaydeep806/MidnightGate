import React from 'react';
import { Lock, CheckCircle, Cpu, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium mb-6 shadow-inner">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>Midnight Request for Startups — Finance & Compliance Track</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none mb-6">
        Prove Your Net Worth. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-300">
          Never Reveal Your Balance.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
        The decentralized zero-knowledge compliance gateway built on <strong className="text-white font-semibold">Midnight Network</strong>. 
        Cryptographically prove you meet <span className="text-purple-300 font-medium">Accredited Investor ($100k+)</span> or high-net-worth thresholds without uploading bank statements or exposing private assets.
      </p>

      {/* Key Feature Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
        <div className="glass-panel rounded-2xl p-4 flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Private Witness</h4>
            <p className="text-xs text-slate-400">Assets stay 100% on your device. Never transmitted over the wire.</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">zk-SNARK Circuits</h4>
            <p className="text-xs text-slate-400">Local Proof Server proves <code className="text-purple-300 font-mono">balance &gt;= threshold</code>.</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Public Verification</h4>
            <p className="text-xs text-slate-400">Midnight Preprod records verifiable proof &amp; prevents replay attacks.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
