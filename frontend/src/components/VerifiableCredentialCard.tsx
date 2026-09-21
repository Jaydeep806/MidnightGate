import React, { useState } from 'react';
import { IssuedCredential } from '../types';
import { ShieldCheck, Copy, Check, Download, Sparkles, Hash, Calendar, Layers } from 'lucide-react';

interface VerifiableCredentialCardProps {
  credential: IssuedCredential;
  onReset: () => void;
}

export const VerifiableCredentialCard: React.FC<VerifiableCredentialCardProps> = ({
  credential,
  onReset
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(credential, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(credential, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `midnight_credential_${credential.tierId}_${credential.blockHeight}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white font-sans">Zero-Knowledge Credential Issued</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active on Midnight
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Tier: <strong className="text-purple-300 font-semibold">{credential.tierName}</strong> (Threshold ≥ ${credential.thresholdUSD.toLocaleString()})</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handleCopyJson}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-midnight-900 border border-slate-700 hover:border-purple-400 text-slate-300 hover:text-white transition-all flex items-center justify-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied JSON' : 'Copy Proof'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-midnight-900 border border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-white transition-all flex items-center justify-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Certificate</span>
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs mb-6">
        <div className="p-3.5 rounded-xl bg-midnight-950/70 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Hash className="w-3 h-3 text-purple-400" />
            <span>Cryptographic Nullifier (On-Chain)</span>
          </span>
          <p className="text-purple-300 font-semibold break-all">{credential.nullifier}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-midnight-950/70 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Layers className="w-3 h-3 text-indigo-400" />
            <span>Midnight Preprod Contract Address</span>
          </span>
          <p className="text-indigo-300 font-semibold break-all">{credential.contractAddress}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-midnight-950/70 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Transaction Hash (Preprod)</span>
          </span>
          <p className="text-slate-300 font-semibold break-all">{credential.txHash}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-midnight-950/70 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-emerald-400" />
            <span>Block Height &amp; Timestamp</span>
          </span>
          <p className="text-slate-300 font-semibold">Block #{credential.blockHeight} • {new Date(credential.issuedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* CTA to verify another */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        <span className="text-xs text-slate-400">
          This credential can now be consumed by any compliant Midnight/Cardano smart contract.
        </span>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 transition-all"
        >
          Verify Another Gate
        </button>
      </div>
    </div>
  );
};
