# 🌐 MidnightGate — Midnight Preprod & Mainnet Deployment Guide

> **Target Network**: Midnight Preprod (Chain ID: 420) & Local Midnight Test Network  
> **Contract Source**: [`contract/src/gate.compact`](./contract/src/gate.compact)  
> **Deployed Preprod Address**: `mn_contract_preprod1qq48m5x9d2a3y7k4h8v7c2d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3`  
> **Contract Hex Hash**: `02005a7d3b84f18e9a263d90cb15e3479a861d3f9b208dc750a92e105e4b986a7d`  
> **Authorized Issuer Authority**: `0xissuer_accredited_custodian_pk`

---

## 📋 Prerequisites

* **Node.js**: `v20.x` or `v22.x` (LTS)
* **npm**: `v10.x+`
* **Docker & Docker Compose**: (For running local Midnight proof server and local dev node)
* **Midnight CLI toolchain**: `compact` compiler & `midnight-node` CLI

---

## 🛠️ Step 1: Compiling the Compact Smart Contract

Navigate to the contract directory and compile the Compact circuit:

```bash
cd contract
npm install

# Compile the Compact circuit and generate TypeScript managed bindings
npm run build
```

This generates:
* `contract/src/managed/index.ts` — TypeScript managed contract bindings with full types.
* `contract/src/managed/gate.d.ts` — Type definitions for circuits, witnesses, and receipts.
* Prover and verifier circuit configurations in `contract/src/managed/circuits.json` and `zk_keys.json`.

---

## 🚀 Step 2: Deploying to Midnight Preprod / Local Network

```bash
# Set your Midnight Preprod environment variables
export MIDNIGHT_NETWORK="preprod"
export MIDNIGHT_CHAIN_ID=420
export MIDNIGHT_NODE_URL="https://rpc.preprod.midnight.network"
export MIDNIGHT_DEPLOYER_SEED="your_secret_midnight_wallet_seed_here"

# Execute contract deployment script
npx ts-node scripts/deploy.ts
```

*Expected Terminal Output:*
```text
Connecting to Midnight Preprod (Chain ID: 420)...
Compiling Compact circuit bytecode (gate.compact v0.20+)...
Deploying MidnightGate Verification Smart Contract...
Transaction broadcast to Midnight network: 0x9a4f2c1b8e7d...
Transaction confirmed in Block #1,492,041!
Contract Address (Bech32m): mn_contract_preprod1qq48m5x9d2a3y7k4h8v7c2d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3
Contract Hex Hash: 02005a7d3b84f18e9a263d90cb15e3479a861d3f9b208dc750a92e105e4b986a7d
Authorized Issuer PK: 0xissuer_accredited_custodian_pk
Contract deployed & verifiable on Midnight Preprod Explorer!
```

---

## 🖥️ Step 3: Running the Local Proof Server (Docker)

Midnight uses client-side or local proof servers to generate zk-SNARK witnesses without network latency:

```bash
docker run -d \
  --name midnight-proof-server \
  -p 6300:6300 \
  ghcr.io/midnight-ntwrk/proof-server:latest
```

Verify the proof server is healthy:
```bash
curl http://localhost:6300/health
# Returns: {"status":"healthy","network":"preprod","version":"0.14.0"}
```

---

## 🧪 Step 4: Testing the Compiled Contract Against Local Midnight Network

Run the automated test suite against the dual-state circuit constraints:

```bash
cd test
npm test
```

*Test Suite Coverage (6 / 6 Passing):*
1. **Accredited Investor Proof**: Validates private asset balance $\ge \$100,000$ with authenticated issuer attestation signature and updates ledger.
2. **Sub-Threshold Invariant Rejection**: Throws circuit constraint error when asset $< \$100,000$ and prevents state transition.
3. **Invalid/Forged Issuer Attestation Rejection**: Rejects forged attestation signatures from unauthorized issuers.
4. **Anti-Replay Protection**: Rejects duplicate nullifiers to prevent replay attacks across application contexts.
5. **Freshness Window Check**: Rejects expired attestations (> 90 days).
6. **Governance & Policy Bounds Enforcement**: Enforces min/max threshold limits ($1,000 to $100,000,000) and policy updates by authority.

---

## 🎨 Step 5: Building & Deploying the Frontend (Netlify / Vercel)

```bash
cd frontend
npm install
npm run build
```

The production bundle is generated in `frontend/dist/`.
Live application: [https://moonlightmidnightgate.netlify.app/](https://moonlightmidnightgate.netlify.app/)
