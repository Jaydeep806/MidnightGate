import React from 'react';
import { Layers, CheckCircle2, Shield, Activity } from 'lucide-react';
import { midnightClient } from '../midnight/midnightClient';

export const ContractStats: React.FC = () => {
  const stats = midnightClient.getStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto my-8">
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Network</span>
          <p className="text-xs sm:text-sm font-bold text-white font-mono">Midnight Preprod</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Verified</span>
          <p className="text-sm font-bold text-emerald-300 font-mono">{stats.totalVerified} Credentials</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Nullifier Set</span>
          <p className="text-sm font-bold text-indigo-300 font-mono">{stats.activeNullifiersCount} Registered</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Proof Engine</span>
          <p className="text-xs sm:text-sm font-bold text-amber-300 font-mono">zk-SNARK Local</p>
        </div>
      </div>
    </div>
  );
};
