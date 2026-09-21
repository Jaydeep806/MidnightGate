import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, XCircle, Code2, Copy, Check, Activity, ArrowUpRight } from 'lucide-react';
import { midnightClient, CONTRACT_PREPROD_ADDRESS } from '../midnight/midnightClient';
import { VerificationActivity } from '../types';

export const VerifierPortal: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<{
    searched: boolean;
    found: boolean;
    activity?: VerificationActivity;
  }>({ searched: false, found: false });
  const [selectedSnippetLang, setSelectedSnippetLang] = useState<'typescript' | 'compact'>('typescript');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const activities = midnightClient.getActivities();
  const stats = midnightClient.getStats();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const res = midnightClient.queryNullifier(searchQuery);
    setQueryResult({
      searched: true,
      found: res.exists,
      activity: res.activity
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const tsCodeSnippet = `// 1. Install MidnightGate Client SDK
import { MidnightGateVerifier } from '@midnight-ntwrk/midnight-gate';

// 2. Query On-Chain Zero-Knowledge Nullifier Status
const verifier = new MidnightGateVerifier({
  contractAddress: '${CONTRACT_PREPROD_ADDRESS}',
  network: 'preprod'
});

// 3. Verify user meets $100,000 threshold without seeing their bank balance
const verification = await verifier.verifyCredential({
  nullifier: '0x7c2bf190e84a...',
  requiredThresholdUSD: 100000,
  contextNonce: 'defi_protocol_round_1'
});

if (verification.isValid) {
  console.log('✅ User is Accredited Investor! Grant access.');
} else {
  console.log('❌ Invalid proof or threshold unmet.');
}`;

  const compactCodeSnippet = `// Integrate into your Compact Smart Contract
pragma language_version >= 0.20.0;

import { MidnightGate } from "./contracts/gate.compact";

export circuit borrow_liquid_assets(
    proof_nullifier: Bytes<32>,
    loan_amount: Uint<64>
): [] {
    // 1. Assert borrower has proven Accredited Status on MidnightGate
    const gate_contract = MidnightGate.bind("${CONTRACT_PREPROD_ADDRESS}");
    assert(
        gate_contract.ledger.verified_nullifiers.member(proof_nullifier),
        "Unauthorized: Borrower must satisfy Accredited Investor ZK Gate"
    );

    // 2. Execute zero-knowledge loan issuance...
}`;

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold mb-3 border border-indigo-500/20">
              <Activity className="w-3.5 h-3.5" />
              <span>Institutional Verifier &amp; DeFi Integration Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              On-Chain Nullifier Registry &amp; Verification API
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              DeFi protocols, OTC desks, and launchpads can instantly query on-chain nullifiers to verify accreditation credentials on Midnight Preprod without processing any private data.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="p-4 rounded-2xl bg-midnight-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total Volume Protected</span>
              <p className="text-xl font-bold font-mono text-emerald-300 mt-1">${(stats.totalVolumeProtectedUSD / 1000000).toFixed(1)}M+</p>
            </div>
            <div className="p-4 rounded-2xl bg-midnight-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400">Avg Prover Latency</span>
              <p className="text-xl font-bold font-mono text-purple-300 mt-1">{stats.averageProofTimeSeconds}s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Lookup Tool */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Search className="w-5 h-5 text-purple-400" />
            <span>Search On-Chain Nullifier Database</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter any cryptographic nullifier hash (e.g. <code className="text-purple-300 font-mono">0x7c2b...</code>) to verify its validity on the Midnight Preprod ledger.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Paste nullifier hash (0x7c2bf190e84a29d491f82c...)"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-midnight-950/90 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white transition-all flex items-center justify-center space-x-2 shadow-lg shadow-purple-950/50 cursor-pointer"
          >
            <span>Query Preprod Ledger</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Sample Queries */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Quick Test Nullifiers:</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('0x7c2bf190e84a29d491f82c3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a');
              const res = midnightClient.queryNullifier('0x7c2bf190e84a29d491f82c3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a');
              setQueryResult({ searched: true, found: res.exists, activity: res.activity });
            }}
            className="px-2.5 py-1 rounded-lg bg-midnight-950 border border-slate-700 hover:border-purple-400 text-purple-300 transition-colors"
          >
            Accredited Sample (0x7c2b...)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('0x9e4a2c1f8b3d5e7a0b2c4d6e8f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a');
              const res = midnightClient.queryNullifier('0x9e4a2c1f8b3d5e7a0b2c4d6e8f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a');
              setQueryResult({ searched: true, found: res.exists, activity: res.activity });
            }}
            className="px-2.5 py-1 rounded-lg bg-midnight-950 border border-slate-700 hover:border-amber-400 text-amber-300 transition-colors"
          >
            Whale Tier Sample (0x9e4a...)
          </button>
        </div>

        {/* Query Result Card */}
        {queryResult.searched && (
          <div className={`p-5 rounded-2xl border transition-all ${
            queryResult.found 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}>
            {queryResult.found && queryResult.activity ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white font-sans">
                      Verified On-Chain: {queryResult.activity.tierName}
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active On Preprod
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nullifier Hash:</span>
                    <span className="text-purple-300 break-all">{queryResult.activity.nullifier}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Verified Threshold:</span>
                    <span className="text-emerald-300 font-bold">${queryResult.activity.thresholdUSD.toLocaleString()} USD Minimum</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Block Height &amp; Status:</span>
                    <span className="text-slate-300">Block #{queryResult.activity.blockHeight} • {queryResult.activity.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Preprod Tx Hash:</span>
                    <span className="text-indigo-300 break-all">{queryResult.activity.txHash}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <XCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white font-sans">Nullifier Not Found on Midnight Preprod</h4>
                  <p className="text-xs text-rose-300/90 mt-0.5">
                    No verified credential exists for this hash on-chain. The user has not satisfied the ZK circuit for this context.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Stream Feed & SDK Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Proof Stream */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h3 className="text-base font-bold text-white">Live On-Chain Proof Feed</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Midnight Preprod
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {activities.map((act) => (
              <div key={act.id} className="p-3.5 rounded-2xl bg-midnight-950/80 border border-slate-800/80 hover:border-purple-500/40 transition-all font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-sans flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>{act.tierName}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-purple-300 truncate max-w-[200px]">Nullifier: {act.nullifier.slice(0, 16)}...</span>
                  <span className="text-emerald-400 font-semibold">≥ ${act.thresholdUSD.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                  <span>Block #{act.blockHeight}</span>
                  <span className="text-indigo-400 truncate max-w-[160px]">{act.txHash.slice(0, 14)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration SDK Code Generator */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">DeFi Smart Contract SDK</h3>
            </div>
            
            {/* Lang Tabs */}
            <div className="flex items-center space-x-1 bg-midnight-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setSelectedSnippetLang('typescript')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedSnippetLang === 'typescript' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                TypeScript
              </button>
              <button
                onClick={() => setSelectedSnippetLang('compact')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedSnippetLang === 'compact' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Compact
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Integrate MidnightGate zero-knowledge compliance verification directly into your dApp frontend or Midnight smart contract with 3 lines of code:
          </p>

          <div className="relative rounded-2xl bg-midnight-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-slate-300">
            <button
              onClick={() => copyCode(selectedSnippetLang === 'typescript' ? tsCodeSnippet : compactCodeSnippet)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-midnight-900 border border-slate-700 hover:border-purple-400 text-slate-400 hover:text-white transition-all flex items-center space-x-1"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{copiedSnippet ? 'Copied' : 'Copy'}</span>
            </button>

            <pre className="text-[11px] leading-relaxed text-indigo-200">
              {selectedSnippetLang === 'typescript' ? tsCodeSnippet : compactCodeSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
