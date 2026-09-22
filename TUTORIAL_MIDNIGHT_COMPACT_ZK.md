# 📚 Tutorial: Building Privacy-Preserving DApps with Midnight Compact & React

> **Comprehensive Developer Guide**: How to build a Zero-Knowledge Net Worth & Accreditation Verifier from scratch using Midnight's Compact smart contract language and React.

---

## 🎯 What You Will Build

In this tutorial, you will learn how to:
1. Write a zero-knowledge smart contract in **Compact** (`gate.compact`).
2. Define **Private Witnesses** vs **Public Ledger State**.
3. Implement anti-replay nullifier sets.
4. Generate TypeScript managed bindings.
5. Build an interactive React frontend with client-side ZK proof synthesis.

---

## 🏗️ 1. Writing the Compact Smart Contract

Compact is Midnight's specialized programming language for zero-knowledge smart contracts.

```compact
// gate.compact — Midnight ZK Net Worth Verifier

export ledger verified_nullifiers: Set<Bytes[32]>;
export ledger total_verified_count: Counter;

// Private Witness (Supplied only by the prover locally)
witness user_asset_value(): Uint<64>;
witness user_secret_salt(): Bytes[32];

export circuit verify_accredited_investor(
    threshold: Uint<64>,
    context_nonce: Bytes[32]
): [] {
    // 1. Retrieve private witness from local client memory
    const asset = user_asset_value();
    const salt = user_secret_salt();

    // 2. Zero-Knowledge Assertion (Mathematically verified via zk-SNARK)
    assert asset >= threshold;

    // 3. Compute public nullifier to prevent replay attacks
    const nullifier = hash(salt, context_nonce);

    // 4. Assert nullifier has not been used yet
    assert !verified_nullifiers.member(nullifier);

    // 5. Update public ledger state atomically
    verified_nullifiers.insert(nullifier);
    total_verified_count.increment(1);
}
```

---

## ⚡ 2. Generating Managed TypeScript Bindings

Use the Compact compiler to output TypeScript bindings:

```bash
compact compile src/gate.compact -o src/managed/
```

This generates `src/managed/index.ts` containing strongly-typed interfaces for contract circuits, ledger state queries, and witness providers.

---

## 💻 3. Integrating with React & Lace Wallet

In your React application, connect the prover to the local witness provider:

```typescript
import { midnightClient, TIERS } from './midnight/midnightClient';

async function handleVerification(assetAmount: number) {
  const result = await midnightClient.executeVerificationFlow(
    assetAmount,
    TIERS[0], // $100,000 threshold
    userWalletAddress,
    'defi_lending_gate',
    (step, message) => console.log(step, message)
  );
  
  console.log('Proof verified on Midnight Preprod:', result.proofHash);
}
```

---

## 🚀 4. Testing Your Circuit with Vitest

Write unit tests simulating the dual-state ledger:

```typescript
import { describe, it, expect } from 'vitest';
import { simulateContractExecution, INITIAL_LEDGER } from './contractSimulator';

describe('Midnight Compact Verification', () => {
  it('Verifies asset >= threshold', () => {
    const result = simulateContractExecution(150000, 100000, '0xabc', INITIAL_LEDGER);
    expect(result.success).toBe(true);
    expect(result.newLedgerState.totalVerifiedInvestors).toBe(1);
  });
});
```

Run tests: `npm test`!

---

*Written by the MidnightGate Core Team for the Rise In Moonshots on Midnight program.*
