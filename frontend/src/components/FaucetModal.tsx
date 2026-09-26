import React, { useState } from 'react';
import { X, Droplets, Sparkles, CheckCircle2, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { MIDNIGHT_FAUCET_URL } from '../midnight/midnightClient';

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string | null;
  onSuccess: (amount: string) => void;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({
  isOpen,
  onClose,
  userAddress,
  onSuccess
}) => {
  const [addressInput, setAddressInput] = useState<string>(userAddress || 'mn_preprod1q9x7y9k4w2d8j3v6f7h8s0a1b2c3d4e5f6g7h8');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [claimResult, setClaimResult] = useState<{ amount: string } | null>(null);

  if (!isOpen) return null;

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 600));
      const result = { amount: '500.00 tDUST' };
      setClaimResult(result);
      onSuccess(result.amount);
    } catch (err) {
      console.error('Faucet request error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl bg-midnight-900/95 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-sans">Midnight Preprod Faucet</h2>
              <p className="text-xs text-slate-400">Request testnet tDUST tokens</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {claimResult ? (
          <div className="mt-6 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">Testnet Balance Loaded!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Allocated <strong className="text-emerald-400 font-mono">{claimResult.amount}</strong> to session.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-midnight-950/80 border border-slate-800 text-xs text-slate-300 space-y-2 text-left">
              <p className="text-[11px] text-slate-400">
                For Lace Wallet on live Preprod, claim directly from the official faucet:
              </p>
              <a
                href={MIDNIGHT_FAUCET_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-purple-300 hover:text-purple-200 font-semibold"
              >
                <span>Official Midnight Preprod Faucet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold text-xs bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleClaim} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Recipient Preprod Address
              </label>
              <input
                type="text"
                required
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="mn_preprod1..."
                className="w-full p-3.5 rounded-xl bg-midnight-950/90 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/40 text-xs text-slate-300 flex items-center justify-between">
              <span>Sandbox Testnet Amount:</span>
              <strong className="text-purple-300 font-mono">500.00 tDUST</strong>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/60 hover:shadow-purple-700/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Allocating Sandbox Tokens...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Allocate 500 tDUST Testnet</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <a
                href={MIDNIGHT_FAUCET_URL}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-purple-300 inline-flex items-center space-x-1 transition-colors"
              >
                <span>Or claim via Official Midnight Preprod Faucet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
