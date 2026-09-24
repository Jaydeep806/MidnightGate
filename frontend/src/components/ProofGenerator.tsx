import React, { useState } from 'react';
import { VerificationTier, ProverStep, WalletState } from '../types';
import { Lock, Cpu, Sparkles, Terminal, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface ProofGeneratorProps {
  wallet: WalletState;
  selectedTier: VerificationTier;
  proverStep: ProverStep;
  proverLog: string;
  onGenerateProof: (privateAmountUSD: number) => void;
  onConnectWallet: () => void;
}

export const ProofGenerator: React.FC<ProofGeneratorProps> = ({
  wallet,
  selectedTier,
  proverStep,
  proverLog,
  onGenerateProof,
  onConnectWallet
}) => {
  const [assetInput, setAssetInput] = useState<number>(150000);
  const isRunning = ['FETCHING_WITNESS', 'INITIALIZING_CIRCUIT', 'GENERATING_ZK_PROOF', 'SUBMITTING_TO_MIDNIGHT'].includes(proverStep);

  const handlePreset = (amount: number) => {
    setAssetInput(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      onConnectWallet();
      return;
    }
    onGenerateProof(assetInput);
  };

  const getStepProgress = () => {
    switch (proverStep) {
      case 'FETCHING_WITNESS': return 25;
      case 'INITIALIZING_CIRCUIT': return 50;
      case 'GENERATING_ZK_PROOF': return 75;
      case 'SUBMITTING_TO_MIDNIGHT': return 90;
      case 'CONFIRMED': return 100;
      default: return 0;
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 2: Private Asset Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>2. Private Asset Witness (Local Device Only)</span>
            </label>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Zero-Knowledge: Never Uploaded
            </span>
          </div>

          <div className="relative rounded-2xl bg-midnight-950/80 border border-slate-700/60 focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-xl font-bold font-mono text-slate-400">$</span>
            </div>
            <input
              type="number"
              min="1"
              step="1000"
              disabled={isRunning}
              value={assetInput}
              onChange={(e) => setAssetInput(Number(e.target.value))}
              placeholder="150000"
              className="block w-full pl-9 pr-32 py-4 bg-transparent text-white font-mono text-xl sm:text-2xl font-bold rounded-2xl focus:outline-none placeholder-slate-600"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-xs font-mono text-slate-400">USD (Min: ${selectedTier.thresholdUSD.toLocaleString()})</span>
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[11px] font-mono text-slate-400">Quick Test Presets:</span>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => handlePreset(150000)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg bg-midnight-900 border border-slate-700 hover:border-purple-400 text-slate-300 hover:text-white transition-all"
            >
              $150,000 (Passes $100k)
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => handlePreset(65000)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg bg-midnight-900 border border-slate-700 hover:border-rose-400 text-slate-300 hover:text-rose-300 transition-all"
            >
              $65,000 (Tests Failure)
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => handlePreset(2500000)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg bg-midnight-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition-all"
            >
              $2,500,000 (Whale Tier)
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {!wallet.isConnected ? (
            <button
              type="button"
              onClick={onConnectWallet}
              className="w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white shadow-xl shadow-purple-950/60 hover:shadow-purple-700/40 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Cpu className="w-5 h-5" />
              <span>Connect Wallet (Lace or Quick Demo)</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isRunning}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all shadow-xl flex items-center justify-center space-x-2 ${
                isRunning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white shadow-purple-950/60 hover:shadow-purple-700/40 hover:scale-[1.01]'
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-purple-300" />
                  <span>Synthesizing Zero-Knowledge Proof...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Generate ZK Proof &amp; Verify on Midnight Preprod</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Live Prover Status & Terminal Output */}
        {proverStep !== 'IDLE' && (
          <div className="rounded-2xl bg-midnight-950/90 border border-purple-950 p-4 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold text-slate-300">Midnight Proof Server Output</span>
              </div>
              <span className="text-[10px] text-indigo-400">compactc v0.20-zk</span>
            </div>

            {/* Progress bar */}
            {isRunning && (
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 h-1.5 transition-all duration-300 rounded-full"
                  style={{ width: `${getStepProgress()}%` }}
                ></div>
              </div>
            )}

            <div className="flex items-start space-x-2">
              {isRunning && <Loader2 className="w-4 h-4 animate-spin text-purple-400 flex-shrink-0 mt-0.5" />}
              {proverStep === 'CONFIRMED' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
              {proverStep === 'FAILED' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />}
              <span className={`leading-relaxed ${
                proverStep === 'CONFIRMED' ? 'text-emerald-300' : 
                proverStep === 'FAILED' ? 'text-rose-300' : 'text-slate-300'
              }`}>
                {proverLog}
              </span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
