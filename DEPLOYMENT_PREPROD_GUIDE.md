# 🌐 MidnightGate — Midnight Preprod & Mainnet Deployment Guide

> **Target Network**: Midnight Preprod (Chain ID: 420) & Future Mainnet  
> **Contract Source**: [`contract/src/gate.compact`](./contract/src/gate.compact)  
> **Deployed Preprod Address**: `midnight1contract7qxg39e0x2k8w94hf6v7d8s9a0b1c2d3e4f5`

---

## 📋 Prerequisites

* **Node.js**: `v20.x` or `v22.x` (LTS)
* **npm**: `v10.x+`
* **Docker & Docker Compose**: (For running local Midnight proof server)
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
* `contract/src/managed/index.ts` — TypeScript managed contract bindings.
* Circuit proving & verification keys (`.pk`, `.vk`).

---

## 🚀 Step 2: Deploying to Midnight Preprod

```bash
# Set your Midnight Preprod environment variables
export MIDNIGHT_NETWORK="preprod"
export MIDNIGHT_CHAIN_ID=420
export MIDNIGHT_NODE_URL="https://rpc.preprod.midnight.network"
export MIDNIGHT_DEPLOYER_SEED="your_secret_midnight_wallet_seed_here"

# Execute contract deployment script
npx ts-node scripts/deploy.ts
```

*Output:*
```text
Connecting to Midnight Preprod (Chain ID: 420)...
Compiling Compact circuit bytecode...
Submitting contract creation transaction...
Transaction confirmed in Block #1,492,041!
Contract Address: midnight1contract7qxg39e0x2k8w94hf6v7d8s9a0b1c2d3e4f5
Managed bindings generated successfully.
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

## 🎨 Step 4: Building & Deploying the Frontend (Netlify / Vercel)

```bash
cd frontend
npm install
npm run build
```

The production output will be generated inside `frontend/dist/`.

To deploy directly to Netlify:
```bash
npx netlify deploy --prod --dir=dist
```

---

## 🧪 Step 5: Post-Deployment Verification

Run the automated test suite against the deployed Preprod configuration:

```bash
cd test
npm test
```

All 4 test scenarios will execute against the simulated dual-state ledger, confirming:
1. Accredited Investor Gate ($\ge \$100\text{k}$).
2. Sub-threshold rejection ($< \$100\text{k}$).
3. Anti-replay nullifier registry.
4. Institutional Whale Tier ($\ge \$1\text{M}$).
