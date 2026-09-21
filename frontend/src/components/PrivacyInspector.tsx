import React from 'react';
import { EyeOff, Shield, Lock, Globe, Check } from 'lucide-react';
import { VerificationTier } from '../types';

interface PrivacyInspectorProps {
  selectedTier: VerificationTier;
}

export const PrivacyInspector: React.FC<PrivacyInspectorProps> = ({ selectedTier }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-xl">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Midnight Dual-State Privacy Model ({selectedTier.name})</h2>
          <p className="text-xs text-slate-400">Comparing Local Private Witnesses vs On-Chain Public Ledger State (≥ ${selectedTier.thresholdUSD.toLocaleString()})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Private Witness (Client Device) */}
        <div className="rounded-2xl bg-midnight-950/70 border border-purple-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center space-x-2">
              <EyeOff className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-purple-300">Private Witness (Client Only)</h3>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Never Disclosed
            </span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <Lock className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
              <span><strong>User Actual Asset Amount:</strong> Ex: $150,000 liquid net worth.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Lock className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
              <span><strong>Private Secret Salt:</strong> Random cryptographic entropy stored in local wallet.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Lock className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
              <span><strong>Identity &amp; Bank Source:</strong> No linked financial institution data.</span>
            </li>
          </ul>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/50 text-[11px] font-mono text-purple-200/90">
            <strong>Observer Guarantee:</strong> An observer looking at the Midnight ledger CANNOT deduce whether your asset is $100,001 or $10,000,000.
          </div>
        </div>

        {/* Right Column: Public Ledger State (Midnight Network) */}
        <div className="rounded-2xl bg-midnight-950/70 border border-indigo-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-indigo-300">Public Ledger State (Preprod)</h3>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              On-Chain Verified
            </span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Nullifier Hash:</strong> <code className="text-indigo-300 font-mono text-[10px]">0x7c2b...9a41</code> (prevents replay).</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Gate Threshold Invariant:</strong> Valid zk-SNARK proof that criteria was satisfied.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Total Verified Counter:</strong> Incremented atomically on ledger.</span>
            </li>
          </ul>

          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-[11px] font-mono text-indigo-200/90">
            <strong>DeFi Smart Contract Access:</strong> Any dApp on Midnight or Cardano can query this gate contract to grant access.
          </div>
        </div>
      </div>
    </div>
  );
};
