import React, { useState } from 'react';
import { Cpu, CheckCircle2, XCircle, Sliders, Layers } from 'lucide-react';

export const CircuitVisualizer: React.FC = () => {
  const [testWitness, setTestWitness] = useState<number>(150000);
  const [testThreshold, setTestThreshold] = useState<number>(100000);
  const [securityLevel, setSecurityLevel] = useState<'128-bit' | '256-bit'>('128-bit');

  const isConstraintSatisfied = testWitness >= testThreshold;
  const constraintCount = securityLevel === '128-bit' ? 14208 : 28416;
  const proofSize = securityLevel === '128-bit' ? '192 Bytes' : '384 Bytes';
  const proveTimeEst = securityLevel === '128-bit' ? '0.42s' : '0.86s';

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-purple-500/30 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono font-semibold mb-3 border border-purple-500/20">
              <Cpu className="w-3.5 h-3.5" />
              <span>Compact Cryptographic Circuit Visualizer &amp; R1CS Matrix</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Zero-Knowledge Circuit &amp; Proof Engine Playground
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Step inside Midnight's zk-SNARK compiler. Visualize how private witnesses are converted into R1CS constraint polynomials, evaluated on your device, and proven to the Midnight network.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="p-4 rounded-2xl bg-midnight-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total R1CS Constraints</span>
              <p className="text-xl font-bold font-mono text-purple-300 mt-1">{constraintCount.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-2xl bg-midnight-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400">Succinct Proof Size</span>
              <p className="text-xl font-bold font-mono text-emerald-300 mt-1">{proofSize}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Circuit Pipeline Graph */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Live Execution Pipeline Graph</h2>
          </div>
          <span className="text-xs font-mono text-purple-300">gate.compact Flow</span>
        </div>

        {/* 5-Step Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-midnight-950/90 border border-purple-900/50 space-y-2 relative">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono text-xs flex items-center justify-center font-bold">1</div>
            <h4 className="text-xs font-bold text-purple-300">Private Witness</h4>
            <p className="text-[11px] text-slate-400">`user_asset_value` ($150k) and `secret_salt` loaded into RAM.</p>
            <span className="text-[9px] font-mono text-emerald-400 block mt-1">● Local Only</span>
          </div>

          {/* Step 2 */}
          <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
            isConstraintSatisfied 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100' 
              : 'bg-rose-950/30 border-rose-500/40 text-rose-100'
          }`}>
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-mono text-xs flex items-center justify-center font-bold">2</div>
              {isConstraintSatisfied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
            </div>
            <h4 className="text-xs font-bold">Constraint Check</h4>
            <p className="text-[11px] text-slate-300">`assert(asset &gt;= threshold)` evaluated in R1CS field.</p>
            <span className="text-[9px] font-mono font-bold block mt-1">
              {isConstraintSatisfied ? '✓ Invariant SAT' : '✗ Invariant UNSAT'}
            </span>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-midnight-950/90 border border-indigo-900/50 space-y-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">3</div>
            <h4 className="text-xs font-bold text-indigo-300">Nullifier Derivation</h4>
            <p className="text-[11px] text-slate-400">`hash(secret_salt, context)` generates anti-replay hash.</p>
            <span className="text-[9px] font-mono text-indigo-400 block mt-1">● SHA-256 / Poseidon</span>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-midnight-950/90 border border-amber-900/50 space-y-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">4</div>
            <h4 className="text-xs font-bold text-amber-300">zk-SNARK Synthesis</h4>
            <p className="text-[11px] text-slate-400">Proof Server compiles 192-byte cryptographic proof.</p>
            <span className="text-[9px] font-mono text-amber-400 block mt-1">● {proveTimeEst} Latency</span>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-midnight-950/90 border border-emerald-900/50 space-y-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">5</div>
            <h4 className="text-xs font-bold text-emerald-300">Preprod Ledger</h4>
            <p className="text-[11px] text-slate-400">Midnight contract verifies proof &amp; registers nullifier.</p>
            <span className="text-[9px] font-mono text-emerald-400 block mt-1">● On-Chain State</span>
          </div>
        </div>

        {/* Interactive Constraint Simulator Controls */}
        <div className="p-6 rounded-2xl bg-midnight-950/80 border border-slate-800 space-y-6">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Interactive Circuit Constraint Simulator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Private Witness Amount ($ USD)
              </label>
              <input
                type="range"
                min="10000"
                max="300000"
                step="5000"
                value={testWitness}
                onChange={(e) => setTestWitness(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <span className="text-sm font-bold font-mono text-purple-300 mt-1 block">
                ${testWitness.toLocaleString()} USD
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Target Gate Threshold ($ USD)
              </label>
              <input
                type="range"
                min="10000"
                max="300000"
                step="5000"
                value={testThreshold}
                onChange={(e) => setTestThreshold(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-sm font-bold font-mono text-indigo-300 mt-1 block">
                ${testThreshold.toLocaleString()} USD
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Security Parameter
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSecurityLevel('128-bit')}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                    securityLevel === '128-bit' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  128-bit (Fast)
                </button>
                <button
                  type="button"
                  onClick={() => setSecurityLevel('256-bit')}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                    securityLevel === '256-bit' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  256-bit (Quantum Safe)
                </button>
              </div>
              <span className="text-xs font-mono text-slate-400 mt-1.5 block">
                {securityLevel === '128-bit' ? '14,208 gates • 192 byte proof' : '28,416 gates • 384 byte proof'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
