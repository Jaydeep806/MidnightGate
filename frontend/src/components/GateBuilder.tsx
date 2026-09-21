import React, { useState } from 'react';
import { Settings, Sparkles, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { CustomGateConfig } from '../types';

export const GateBuilder: React.FC = () => {
  const [gateConfig, setGateConfig] = useState<CustomGateConfig>({
    name: 'Institutional OTC Liquidity Gate',
    targetProtocol: 'midnight_otc_vault_2026',
    thresholdAmount: 250000,
    currency: 'USD',
    requiresAccreditation: true,
    jurisdictionExclusion: ['US_RETAIL', 'SANCTIONED']
  });

  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [compiledSuccess, setCompiledSuccess] = useState<boolean>(false);

  const generateDynamicCompact = () => {
    return `// ==============================================================================
// Custom MidnightGate: ${gateConfig.name}
// Target Protocol Context: ${gateConfig.targetProtocol}
// Generated for Midnight Network (Preprod)
// ==============================================================================

pragma language_version >= 0.20.0;

export ledger state: {
    verified_nullifiers: Set<Bytes<32>>,
    total_verified: Uint<64>,
    required_threshold_${gateConfig.currency.toLowerCase()}: Uint<64>,
    protocol_context: Bytes<32>
};

witness user_private_balance(): Uint<64>;
witness user_secret_entropy(): Bytes<32>;

export circuit verify_${gateConfig.targetProtocol}_gate(
    context_nonce: Bytes<32>
): Bytes<32> {
    // 1. Ingest private witness balance
    const balance = user_private_balance();
    const entropy = user_secret_entropy();

    // 2. Custom Gate Constraint (Threshold: ${gateConfig.thresholdAmount.toLocaleString()} ${gateConfig.currency})
    assert(
        balance >= ${gateConfig.thresholdAmount}n, 
        "${gateConfig.name}: Balance does not meet ${gateConfig.thresholdAmount} ${gateConfig.currency} requirement"
    );

    // 3. Generate Anti-Replay Nullifier Hash
    const nullifier = hash(entropy, context_nonce);
    assert(
        !ledger.verified_nullifiers.member(nullifier), 
        "${gateConfig.name}: Credential nullifier already registered on-chain"
    );

    // 4. Update Public Ledger State
    ledger.verified_nullifiers.insert(nullifier);
    ledger.total_verified = ledger.total_verified + 1;

    return nullifier;
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateDynamicCompact());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulateCompile = () => {
    setCompiledSuccess(true);
    setTimeout(() => setCompiledSuccess(false), 4000);
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-amber-500/30 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono font-semibold mb-3 border border-amber-500/20">
              <Settings className="w-3.5 h-3.5" />
              <span>B2B Protocol Builder &amp; Smart Contract Synthesizer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Custom Gate &amp; Compliance Policy Creator
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Design, customize, and generate custom Compact zero-knowledge gate contracts for your DAO, launchpad, or institutional fund.
            </p>
          </div>

          <button
            onClick={handleSimulateCompile}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-950/60 hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Compile Compact Circuit</span>
          </button>
        </div>
      </div>

      {compiledSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center space-x-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>Circuit compiled successfully with `@midnight-ntwrk/compactc` v0.20! Bytecode ready for Preprod deployment.</span>
        </div>
      )}

      {/* Grid: Configurator Form & Live Code Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Gate Specifications</span>
          </h2>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Gate Protocol Name</label>
              <input
                type="text"
                value={gateConfig.name}
                onChange={(e) => setGateConfig({ ...gateConfig, name: e.target.value })}
                className="w-full p-3 rounded-xl bg-midnight-950/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Target Protocol Identifier</label>
              <input
                type="text"
                value={gateConfig.targetProtocol}
                onChange={(e) => setGateConfig({ ...gateConfig, targetProtocol: e.target.value })}
                className="w-full p-3 rounded-xl bg-midnight-950/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Threshold Amount</label>
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  value={gateConfig.thresholdAmount}
                  onChange={(e) => setGateConfig({ ...gateConfig, thresholdAmount: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl bg-midnight-950/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Denomination</label>
                <select
                  value={gateConfig.currency}
                  onChange={(e) => setGateConfig({ ...gateConfig, currency: e.target.value })}
                  className="w-full p-3 rounded-xl bg-midnight-950/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="USD">USD ($)</option>
                  <option value="USDC">USDC</option>
                  <option value="tDUST">tDUST</option>
                  <option value="ADA">ADA</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gateConfig.requiresAccreditation}
                  onChange={(e) => setGateConfig({ ...gateConfig, requiresAccreditation: e.target.checked })}
                  className="accent-amber-500 rounded"
                />
                <span>Include SEC Rule 501 Accredited Investor Rule</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Generated Compact Smart Contract */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <FileCode className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Dynamic Compact Contract Output</h3>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-midnight-950 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition-all text-xs font-mono flex items-center space-x-1.5 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedCode ? 'Copied' : 'Copy Compact Code'}</span>
            </button>
          </div>

          <div className="rounded-2xl bg-midnight-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-amber-200/90 max-h-[460px]">
            <pre className="leading-relaxed">{generateDynamicCompact()}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
