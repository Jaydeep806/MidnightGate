# 🎬 MidnightGate — Complete Demo Walkthrough & User Guide

> **Interactive Step-by-Step Guide for MidnightGate (ZK Net Worth & Accredited Investor Verifier)**  
> **Network**: Midnight Preprod (Chain ID: 420)  
> **Video Demo**: [Watch Full 1080p Demo on YouTube](https://youtu.be/tyFBRt-QJQs)

---

## 🚀 Overview of the Demo Experience

In this walkthrough, you will learn how to:
1. Connect a wallet (Lace DApp Connector or 1-Click Instant Demo Wallet).
2. Select an investor verification tier ($100k+, $5M+, $25M+).
3. Input your private asset witness in the client-side ZK synthesizer.
4. Generate a zk-SNARK proof locally in $< 1.5$ seconds.
5. Submit the proof and nullifier to the Midnight Preprod smart contract.
6. Inspect the Dual-State Privacy model.
7. Use your issued soulbound credential to unlock permissioned DeFi vaults.

---

## 📸 Demo Screenshots Reference

| Screenshot | Description |
| :--- | :--- |
| ![Product UI](./screenshots/product-ui.png) | **Main Web Dashboard**: Live ZK Synthesizer, Tier Selector, Credential Card, and Metrics. |
| ![Mobile Responsive UI](./screenshots/mobile-responsive-ui.png) | **Mobile View**: Responsive glassmorphism cards and bottom navigation bar. |
| ![Monitoring Setup](./screenshots/monitoring-setup.png) | **Node Telemetry**: Midnight Preprod block tracking, latency graph, and health metrics. |
| ![CI/CD Pipeline](./screenshots/cicd-pipeline.png) | **GitHub Actions**: 100% automated test and build pipeline passing. |
| ![Test Output](./screenshots/test-output.png) | **Vitest Execution**: 4/4 passing dual-state simulation test cases. |

---

## 🛠️ Step-by-Step Walkthrough

### Step 1: Connecting Your Wallet

1. Navigate to the MidnightGate frontend at `http://localhost:5173` (or the deployed Netlify URL).
2. Click **Connect Wallet** in the top navigation bar.
3. Select your preferred wallet option:
   * **Lace DApp Connector**: Connects to the official Midnight Lace browser extension.
   * **1-Click Instant Demo Wallet**: Instantly creates a pre-funded test keypair for rapid evaluation.

---

### Step 2: Choosing Your Investor Verification Tier

Select the tier required by the target DeFi protocol or launchpad:
* **Accredited Investor**: Requires Net Worth $\ge \$100,000$.
* **Qualified Purchaser**: Requires Net Worth $\ge \$5,000,000$.
* **Institutional Whale**: Requires Net Worth $\ge \$25,000,000$.

---

### Step 3: Entering Private Witness Data & Generating ZK Proof

1. In the **Interactive Local ZK Proof Synthesizer** card, enter your private asset balance (e.g. `$150,000`).
2. Notice the **Privacy Lock Indicator**: this value is encrypted into local browser WebAssembly memory and **never transmitted over the internet**.
3. Click **Generate Proof Locally**.
4. Observe the real-time proof synthesis stages:
   * `GENERATING_WITNESS`: Preparing private polynomial constraints.
   * `PROVING`: Generating zk-SNARK cryptographic proof ($\approx 1.2\text{s}$).
   * `SUBMITTING_TX`: Submitting public nullifier and proof to Midnight Preprod.
   * `CONFIRMED`: Contract registers nullifier and increments global verified investor counter.

---

### Step 4: Receiving Your Soulbound Verifiable Credential

Once confirmed on Midnight Preprod, your **Verifiable Credential Card** will render with:
* Unique Cryptographic Proof Hash.
* Verifiable Nullifier String.
* Midnight Preprod Block Height confirmation.
* QR Code for third-party mobile verifiers.

---

### Step 5: Testing with the Permissioned DeFi Vault Demo

1. Switch to the **DeFi Vault Demo** tab.
2. The vault detects your verified soulbound credential on-chain.
3. The deposit gate is unlocked, allowing you to access VIP high-yield institutional lending pools.

---

*Walkthrough prepared by the MidnightGate Core Team.*
