# 💻 MidnightGate — Frontend Integration & Developer SDK Guide

> **Developer Documentation**: How to integrate MidnightGate ZK verification widgets and soulbound credential checks into your React / TypeScript DApp.

---

## 📦 Architecture Overview

The MidnightGate frontend is built with:
* **React 18 & TypeScript**: Robust, type-safe user interface.
* **Vite**: Lightning-fast bundler with WebAssembly prover support.
* **Tailwind CSS & Glassmorphism Design System**: Custom neon cyan/violet glowing theme.
* **Lucide React**: Modern iconography.
* **Midnight Lace Connector**: Official DApp browser connector integration.

---

## 🚀 Quick Integration Example

### 1. Installation

```bash
npm install @midnight-gate/react lucide-react
```

### 2. Connecting to MidnightGate Client

```typescript
import { midnightClient, TIERS } from './midnight/midnightClient';
import { walletService } from './midnight/laceConnector';

// Connect to Lace Wallet or Demo Keypair
const walletState = await walletService.connectLace();

// Execute Zero-Knowledge Proof Synthesis
const credential = await midnightClient.executeVerificationFlow(
  150000,                  // Private asset amount ($150k) - strictly client-side
  TIERS[0],                // Tier: Accredited Investor ($100k+)
  walletState.address,     // User's Midnight Preprod address
  'my_defi_vault',         // Target protocol ID
  (step, log) => {
    console.log(`Current ZK Prover Step: ${step} - ${log}`);
  }
);

console.log('Soulbound Credential Generated:', credential.proofHash);
```

---

## 🎨 UI Component Hierarchy

```
App.tsx
├── Navbar (Wallet Connector, Balance Chip, Network Status)
├── Hero (Protocol value proposition & quick stats)
├── TierSelector (Accredited $100k+, Qualified Purchaser $5M+, Whale $25M+)
├── ProofGenerator (Private witness input, ZK Prover stage visualizer)
├── VerifiableCredentialCard (Soulbound credential card with QR code)
├── PrivacyInspector (Dual-State comparison: Private vs Public)
├── DeFiVaultDemo (VIP high-yield permissioned vault demo)
├── GateBuilder (Custom gate creator tool)
├── CircuitVisualizer (Step-by-step ZK polynomial constraint flow)
├── VerifierPortal (Third-party instantaneous verification tool)
├── ContractExplorer (Live Preprod smart contract inspector)
├── WalletModal & FaucetModal
└── ToastContainer (Animated transaction status alerts)
```

---

## 🧪 Testing Frontend Integration Locally

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` to test the full end-to-end interactive flow.
