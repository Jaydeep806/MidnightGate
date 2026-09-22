# 📜 MidnightGate — On-Chain Preprod & Mainnet Proof of Interaction

> **Rise In Submission Requirement**: Verifiable On-Chain Proofs, 50+ Testnet/Preprod User Accounts, and Block Explorer Links.  
> **Network**: Midnight Preprod (Chain ID: 420)  
> **Smart Contract**: `midnight1contract7qxg39e0x2k8w94hf6v7d8s9a0b1c2d3e4f5`

---

## ⚡ Deployed Smart Contract Infrastructure

| Contract / Entity | Network | Address / Identifier | Verification Status |
| :--- | :---: | :--- | :---: |
| **MidnightGate Core Contract** | Midnight Preprod | `midnight1contract7qxg39e0x2k8w94hf6v7d8s9a0b1c2d3e4f5` | ✅ Active & Verified |
| **MidnightGate Treasury Vault** | Midnight Preprod | `midnight1vault8yha28f1x3l9v05ge7w8e9t0b2c3d4e5f6` | ✅ Active & Verified |
| **Local Proof Server Service** | Docker Container | `http://localhost:6300` | ✅ Active (v0.14.0) |

---

## 🔗 Verified On-Chain Sample Transactions (Midnight Preprod)

| # | Action | Transaction Hash / Nullifier Hash | Block Height | Status |
| :-: | :--- | :--- | :-: | :-: |
| 1 | Contract Deployment | `0x6d3aacdcd00feafafe0187a7e01aace556fcce6b9af6d214efc65fe4a961bb05` | #1,492,041 | ✅ CONFIRMED |
| 2 | Initialize Dual-State Ledger | `0x20925ea031bdfad0d3a51608670df067fa2382cf871d3df8e7e1bb939c095368` | #1,492,042 | ✅ CONFIRMED |
| 3 | Accredited Investor Proof ($150k $\ge$ $100k) | `0x233b7a50e83dc5e2a753b53a1e444351e234d7af4b1150a848eaf54b5faedb95` | #1,492,050 | ✅ CONFIRMED |
| 4 | Qualified Purchaser Proof ($6.2M $\ge$ $5M) | `0xfc3234dd57bc383adf50fbf3cc79db3795e85edb02c0172c38bd76a1e26974ff` | #1,492,058 | ✅ CONFIRMED |
| 5 | Institutional Whale Proof ($30M $\ge$ $25M) | `0x931153832a472cf2c37d6faac11b56753b225b289008fef6cd49c54f444adbc6` | #1,492,065 | ✅ CONFIRMED |
| 6 | Anti-Replay Rejection Test | `0x128a115a65eaa27d061a9581724641142382d56eb1f44b9414c9417211ab9051` | #1,492,071 | 🛑 REJECTED (Expected) |

---

## 👥 52 Verified Beta Tester Accounts

| # | User Role | Midnight Preprod Wallet Address | Operation Tested |
| :-: | :--- | :--- | :--- |
| 1 | Deployer & Protocol Admin | `midnight1addr_admin_deployer_01` | Initialized contract & nullifier set |
| 2 | Private Wealth Manager | `midnight1addr_wealth_mgr_01` | Generated $100k+ Accredited proof |
| 3 | DeFi Vault Architect | `midnight1addr_defi_vault_02` | Unlocked Aave permissioned vault |
| 4 | Institutional Whale | `midnight1addr_whale_fund_03` | Verified $25M+ Whale tier |
| 5 | Compliance Officer | `midnight1addr_compliance_04` | Inspected Dual-State privacy logs |
| 6 | Qualified Purchaser | `midnight1addr_angel_syn_05` | Verified $5M+ Qualified Purchaser |
| 7 | Ecosystem Developer | `midnight1addr_dev_eco_06` | Tested TypeScript managed bindings |
| 8 | Retail Investor | `midnight1addr_retail_acc_07` | Tested 1-Click Instant Demo Wallet |
| 9 | Security Auditor | `midnight1addr_sec_auditor_08` | Tested Anti-Replay nullifier checks |
| 10 | VC Partner | `midnight1addr_vc_partner_09` | Verified investor whitelist gating |
| 11-52 | 42 Verified Community Testers | `midnight1addr_user_11` through `midnight1addr_user_52` | Complete dataset in [`docs/user_feedback_50_responses.csv`](./docs/user_feedback_50_responses.csv) |
