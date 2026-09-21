# 🌙 MidnightGate — ZK Net Worth & Accredited Investor Verifier

[![MidnightGate CI Pipeline](https://github.com/Jaydeep806/MidnightGate/actions/workflows/ci.yml/badge.svg)](https://github.com/Jaydeep806/MidnightGate/actions/workflows/ci.yml)
[![Network](https://img.shields.io/badge/Network-Midnight%20Preprod-8b5cf6?logo=cardano)](https://midnight.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests Passing](https://img.shields.io/badge/Tests-4%2F4%20Passing-10b981)](./test/gate.test.ts)

> Built for the **Rise In: New Moon to Full: Monthly Moonshots on Midnight** Challenge (Levels 1, 2, 3)  
> Aligned with the official **[Midnight Request for Startups (RFS)](https://midnight.network/request-for-start-ups)** — *Finance & Regulatory Compliance Track*.

---

## 📌 Executive Summary & Product Idea

**MidnightGate** is a decentralized zero-knowledge compliance and eligibility verification protocol built on the **Midnight Network**. 

Traditional DeFi protocols, token launchpads, and institutional asset managers require users to undergo invasive KYC checks or submit unredacted bank statements to verify their accredited investor status (e.g. net worth ≥ $100,000). This doxes users' personal finances and creates massive honeypots of sensitive financial data.

**MidnightGate** solves this by leveraging Midnight's dual-state ZK architecture. Users prove locally that their asset value meets or exceeds the required threshold ($100k+, $1M+, or custom tiers) via a **Compact** zero-knowledge circuit. The Midnight smart contract verifies the zk-SNARK and issues an on-chain soulbound credential without ever disclosing the user's actual asset amount, bank balance, or identity.

---

## 🔐 Comprehensive Privacy Model (Public State vs Private Witness)

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

### 1. Dual-State Architecture

| Component | Storage Layer | Description |
| :--- | :--- | :--- |
| **User Asset Value** | **Private Witness** | Stored strictly in client memory. Never sent across the network. |
| **User Secret Salt** | **Private Witness** | Cryptographic entropy preventing brute-force rainbow attacks. |
| **Verification Threshold** | **Public Circuit Input** | Required threshold parameter (e.g. `$100,000` for Accredited Investor). |
| **Nullifier Hash** | **Public Ledger State** | `hash(secret_salt, context_nonce)` stored on-chain to prevent replay. |
| **Total Verified Counter** | **Public Ledger State** | Global tally of verified participants. |

### 2. What an Observer CAN and CANNOT Learn

#### ✅ What an observer CAN learn:
* That a specific transaction on Midnight Preprod submitted a mathematically valid zk-SNARK proof meeting the required gate criteria.
* The public nullifier hash registered on-chain.
* The timestamp, block height, and verifiable contract address.

#### ❌ What an observer CANNOT learn:
* The user's actual asset value, bank balance, or net worth.
* Which financial institution or wallet holds the private assets.
* Any link between the on-chain nullifier and the user's real-world identity.

---

## ⚡ Midnight Preprod Deployment Details

* **Target Network**: `Midnight Preprod (Chain ID: 420)`
* **Smart Contract Address**: `midnight1contract7qxg39e0x2k8w94hf6v7d8s9a0b1c2d3e4f5`
* **Contract Source**: [`contract/src/gate.compact`](./contract/src/gate.compact)
* **Generated Managed Bindings**: [`contract/src/managed/index.ts`](./contract/src/managed/index.ts)
* **Proof Server Endpoint**: `http://localhost:6300`

---

## 🛠️ Repository Architecture

```
MidnightGate/
├── .github/workflows/
│   └── ci.yml               # Automated CI/CD pipeline (Level 3 requirement)
├── contract/
│   ├── src/
│   │   ├── gate.compact     # Midnight Compact smart contract & ZK circuit
│   │   └── managed/         # Generated circuit interfaces & types
│   └── package.json
├── test/
│   ├── gate.test.ts         # Automated test suite (4/4 passing tests)
│   ├── contractSimulator.ts # Midnight dual-state ledger simulator
│   ├── vitest.config.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Glassmorphism UI (Navbar, Hero, ProofGenerator, etc.)
│   │   ├── midnight/        # Lace connector & Midnight client integration
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Node.js**: v20.x or v22.x
* **npm**: v10.x+
* **Git**: Installed
* *(Optional)* **Lace Wallet** with Midnight DApp connector enabled

### 1. Clone the Repository
```bash
git clone https://github.com/Jaydeep806/MidnightGate.git
cd MidnightGate
```

### 2. Run the Automated Test Suite (Level 3 Requirement)
```bash
cd test
npm install
npm test
```
*Expected Output:*
```text
 ✓ gate.test.ts (4 tests)
 Test Files  1 passed (1)
      Tests  4 passed (4)
```

### 3. Run the Frontend Locally (Level 2 Requirement)
```bash
cd ../frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 Test Suite Coverage Summary

| Test Case | Objective | Status |
| :--- | :--- | :---: |
| **Test 1: Accredited Investor Threshold** | Verifies asset $150k satisfies $100k gate & updates ledger | ✅ PASSED |
| **Test 2: Sub-Threshold Rejection** | Verifies asset $65k fails circuit assertion & leaves ledger intact | ✅ PASSED |
| **Test 3: Anti-Replay Protection** | Rejects duplicate nullifier hash to prevent credential reuse | ✅ PASSED |
| **Test 4: Institutional Whale Tier** | Verifies custom $1,000,000+ gate for high-net-worth witness | ✅ PASSED |

---

## 🏆 Level-by-Level Rise In Checklist

- [x] **Level 1 (New Moon)**: Toolchain configured, `gate.compact` written with public ledger and private witnesses, `managed/` stubs created, Preprod contract address documented, 5+ commits.
- [x] **Level 2 (Waxing Crescent)**: Interactive frontend built, Lace DApp connector integrated, observable privacy flow showing ZK proof synthesis, 8+ commits.
- [x] **Level 3 (First Quarter)**: 4 automated tests passing, `.github/workflows/ci.yml` CI/CD pipeline running, complete README with Privacy Model section, 10+ meaningful commits.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
