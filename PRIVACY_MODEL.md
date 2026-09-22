# 🔐 MidnightGate — Formal ZK Privacy & Threat Model

> **Specification**: Formal Zero-Knowledge Privacy Guarantees, Public vs Private State Breakdown, and Cryptographic Threat Model for MidnightGate on the Midnight Network.

---

## 🏛️ Dual-State Privacy Architecture

The Midnight Network utilizes a **dual-state execution model**, separating computation into private client-side witness evaluation and public ledger state validation.

```
┌─────────────────────────────────────────────────────────────┐
│                      USER LOCAL CLIENT                      │
│                                                             │
│   [Private Witness: user_asset_value = $150,000]            │
│   [Private Witness: user_secret_salt = 0x9f4a...]           │
│                           │                                 │
│                           ▼                                 │
│              Local Proof Server (zk-SNARK)                  │
│       Constraint Check: (asset_value >= $100,000)           │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Submits: zk-SNARK Proof + Nullifier
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              MIDNIGHT PUBLIC LEDGER (Preprod)               │
│                                                             │
│   - Verified Nullifiers: Set<0x7c2b...9a41> (Anti-Replay)   │
│   - Total Verified Investors: Increment (+1)                │
│   - Status: VALID (Credential Registered)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Public State vs Private Witness Breakdown

| Component | Storage Layer | Cryptographic Nature | Description |
| :--- | :--- | :--- | :--- |
| **`user_asset_value`** | **Private Witness** | Strictly local memory | The user's actual asset balance in USD. Never broadcasted or leaked. |
| **`user_secret_salt`** | **Private Witness** | 256-bit cryptographic entropy | Secret salt preventing dictionary or brute-force pre-image attacks. |
| **`required_threshold`**| **Public Input** | Known circuit parameter | Minimum asset threshold required for the gate ($100k, $5M, $25M). |
| **`context_nonce`** | **Public Input** | Domain separator | Unique nonce binding the proof to a specific gate or protocol context. |
| **`nullifier`** | **Public Ledger State**| Poseidon Hash $H(\text{Salt}, \text{Nonce})$ | Cryptographic hash recorded on-chain to prevent credential reuse. |
| **`total_verified`** | **Public Ledger State**| Monotonic Counter | Global tally of verified participants on Midnight Preprod. |

---

## 🔍 What an Observer CAN and CANNOT Learn

### ✅ What an Observer CAN Learn:
1. **Mathematical Validity**: That a transaction on Midnight Preprod submitted a mathematically sound zk-SNARK proof meeting the circuit threshold.
2. **Public Nullifier**: The cryptographic nullifier hash registered on the ledger.
3. **Block Height & Timestamp**: When the verification occurred on-chain.
4. **Target Contract Address**: The verifiable MidnightGate contract ID.

### ❌ What an Observer CANNOT Learn:
1. **Actual Asset Amount**: The exact net worth, bank balance, or portfolio valuation of the user.
2. **Account Balances & Institutions**: Which financial institution, bank, or private wallet holds the assets.
3. **User Identity & Linkability**: Any direct connection between the on-chain nullifier and the user's real-world identity or IP address.
4. **Other Verification Attempts**: Cannot link two separate proofs generated with different nonces to the same user.

---

## 🛡️ Threat Model & Security Mitigations

### 1. Brute-Force & Rainbow Attacks
* **Threat**: An attacker attempts to guess the user's private asset value by hashing common dollar amounts.
* **Mitigation**: The private witness incorporates a 256-bit high-entropy secret salt `user_secret_salt`, making pre-image brute-forcing computationally infeasible.

### 2. Double-Spending / Credential Replay Attacks
* **Threat**: A malicious user shares their proof or re-submits the same proof to verify multiple times or across different accounts.
* **Mitigation**: The Compact contract enforces `assert !verified_nullifiers.member(nullifier)`. Once a nullifier is inserted into the on-chain set, duplicate attempts are rejected automatically.

### 3. Front-Running / Transaction Hijacking
* **Threat**: A third party observes a pending proof in the mempool and attempts to submit it under their own address.
* **Mitigation**: The proof is cryptographically bound to the prover's public key context, ensuring only the intended originator can submit the transaction.
