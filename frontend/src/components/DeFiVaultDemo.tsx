import React, { useState } from 'react';
import { Landmark, ShieldCheck, Lock, Unlock, ArrowRight, CheckCircle2, Sparkles, DollarSign, RefreshCw, Cpu } from 'lucide-react';
import { IssuedCredential, WalletState } from '../types';

interface DeFiVaultDemoProps {
  wallet: WalletState;
  activeCredential: IssuedCredential | null;
  onNavigateToProver: () => void;
  onOpenConnectModal: () => void;
  onShowToast: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

export const DeFiVaultDemo: React.FC<DeFiVaultDemoProps> = ({
  wallet,
  activeCredential,
  onNavigateToProver,
  onOpenConnectModal,
  onShowToast
}) => {
  const [borrowAmount, setBorrowAmount] = useState<number>(25000);
  const [isBorrowing, setIsBorrowing] = useState<boolean>(false);
  const [loanSuccess, setLoanSuccess] = useState<{
    txHash: string;
    amount: number;
    interestRate: string;
    blockHeight: number;
  } | null>(null);

  const isEligible = Boolean(activeCredential && activeCredential.thresholdUSD >= 100000);

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      onOpenConnectModal();
      return;
    }
    if (!isEligible) {
      onShowToast('Access Denied', 'You must generate an Accredited Investor ZK proof first.', 'error');
      return;
    }

    try {
      setIsBorrowing(true);
      await new Promise((r) => setTimeout(r, 1400));
      const txHash = `0xborrow_preprod_${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
      const result = {
        txHash,
        amount: borrowAmount,
        interestRate: '2.8% Fixed APR',
        blockHeight: 1894340 + Math.floor(Math.random() * 20)
      };
      setLoanSuccess(result);
      onShowToast('Loan Approved!', `Successfully disbursed $${borrowAmount.toLocaleString()} USDC via Midnight Private Vault!`, 'success');
    } catch (err: any) {
      onShowToast('Borrow Failed', err.message || 'Transaction failed', 'error');
    } finally {
      setIsBorrowing(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold mb-3 border border-emerald-500/20">
              <Landmark className="w-3.5 h-3.5" />
              <span>Live Cross-Protocol Integration Demo • Aave / Compound on Midnight</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Midnight Private DeFi Lending Pool
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Experience how third-party DeFi protocols leverage <strong className="text-purple-300">MidnightGate</strong>. 
              Borrow up to <span className="text-emerald-300 font-semibold">$500,000 in uncollateralized liquidity</span> with zero bank disclosures, verified strictly via on-chain zk-SNARK proof.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="p-4 rounded-2xl bg-midnight-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total Pool Liquidity</span>
              <p className="text-xl font-bold font-mono text-emerald-300 mt-1">$14.8M USDC</p>
            </div>
            <div className="p-4 rounded-2xl bg-midnight-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400">Fixed Borrow Rate</span>
              <p className="text-xl font-bold font-mono text-purple-300 mt-1">2.8% APR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Gate Status Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Compliance Gate Status</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
                isEligible 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                {isEligible ? 'Gate Unlocked' : 'Gate Locked'}
              </span>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${
              isEligible
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
                : 'bg-midnight-950/80 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-start space-x-3">
                {isEligible ? (
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <Unlock className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5">
                    <Lock className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold font-sans text-white">
                    {isEligible ? 'Accredited Investor Verified' : 'Accreditation Proof Required'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {isEligible 
                      ? `Your on-chain zk-SNARK nullifier (${activeCredential?.nullifier.slice(0, 12)}...) satisfies the $100k threshold constraint!`
                      : 'This institutional borrowing vault requires an active Accredited Investor proof (≥ $100,000 USD net worth).'}
                  </p>
                </div>
              </div>
            </div>

            {!isEligible && (
              <button
                onClick={onNavigateToProver}
                className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white shadow-lg shadow-purple-950/50 hover:shadow-purple-700/40 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>Go to ZK Prover &amp; Generate Proof</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Invariant Parameters Table */}
            <div className="p-4 rounded-2xl bg-midnight-950/80 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Required Gate:</span>
                <span className="text-white">Accredited Tier ($100k+)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Proof Protocol:</span>
                <span className="text-purple-300">Midnight Compact SNARK</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Borrow Limit:</span>
                <span className="text-emerald-400 font-bold">$500,000 USDC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Borrowing Interaction Terminal */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Institutional Borrow Terminal</h3>
              </div>
              <span className="text-xs font-mono text-purple-300">Instant Settlement</span>
            </div>

            {loanSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4 animate-scaleUp">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white font-sans">
                    ${loanSuccess.amount.toLocaleString()} USDC Disbursed!
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Funds released to your wallet without revealing your identity or total assets.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-midnight-950/90 border border-slate-800 font-mono text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Preprod Tx Hash:</span>
                    <span className="text-purple-300 truncate max-w-[200px]">{loanSuccess.txHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fixed Rate:</span>
                    <span className="text-emerald-400 font-bold">{loanSuccess.interestRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Midnight Block:</span>
                    <span className="text-slate-300">Block #{loanSuccess.blockHeight}</span>
                  </div>
                </div>

                <button
                  onClick={() => setLoanSuccess(null)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  Borrow More Funds
                </button>
              </div>
            ) : (
              <form onSubmit={handleBorrow} className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>Desired Borrow Amount (USDC)</span>
                    <span>Max: $500,000</span>
                  </div>

                  <div className="relative rounded-2xl bg-midnight-950/90 border border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                    <span className="absolute left-4 top-4 text-xl font-bold font-mono text-slate-400">$</span>
                    <input
                      type="number"
                      min="1000"
                      max="500000"
                      step="5000"
                      value={borrowAmount}
                      onChange={(e) => setBorrowAmount(Number(e.target.value))}
                      className="w-full pl-9 pr-24 py-4 bg-transparent text-white font-mono text-2xl font-bold rounded-2xl focus:outline-none"
                    />
                    <span className="absolute right-4 top-4 text-xs font-mono text-slate-400">USDC</span>
                  </div>

                  {/* Preset quick picks */}
                  <div className="flex items-center space-x-2 mt-2 font-mono text-xs">
                    <span className="text-slate-500">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setBorrowAmount(25000)}
                      className="px-2.5 py-1 rounded bg-midnight-950 border border-slate-700 hover:border-emerald-400 text-slate-300 transition-colors"
                    >
                      $25,000
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorrowAmount(100000)}
                      className="px-2.5 py-1 rounded bg-midnight-950 border border-slate-700 hover:border-emerald-400 text-slate-300 transition-colors"
                    >
                      $100,000
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorrowAmount(250000)}
                      className="px-2.5 py-1 rounded bg-midnight-950 border border-slate-700 hover:border-emerald-400 text-slate-300 transition-colors"
                    >
                      $250,000
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-midnight-950/70 border border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Borrow Interest:</span>
                    <span className="text-emerald-400 font-bold">2.8% Annual</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>KYC / Personal Data Disclosed:</span>
                    <span className="text-purple-300 font-bold">0.00% (Strictly ZK Proved)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isBorrowing || !isEligible}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                    !isEligible
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : isBorrowing
                      ? 'bg-emerald-800 text-emerald-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-xl shadow-emerald-950/60 hover:shadow-emerald-700/40 hover:scale-[1.01] cursor-pointer'
                  }`}
                >
                  {isBorrowing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                      <span>Verifying On-Chain Nullifier &amp; Disbursing...</span>
                    </>
                  ) : !isEligible ? (
                    <>
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span>Vault Locked — Generate Accredited Proof First</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Execute Zero-Knowledge Borrow (${borrowAmount.toLocaleString()} USDC)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
