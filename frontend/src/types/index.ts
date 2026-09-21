export type NavigationPage = 
  | 'PROVER_GATEWAY' 
  | 'DEFI_VAULT_DEMO'
  | 'GATE_BUILDER'
  | 'CIRCUIT_VISUALIZER'
  | 'PROTOCOL_VERIFIER' 
  | 'CONTRACT_SPECS';

export interface VerificationTier {
  id: string;
  name: string;
  badge: string;
  thresholdUSD: number;
  description: string;
  color: string;
  iconName: string;
}

export type WalletType = 'LACE_DAPP_CONNECTOR' | 'STELLAR_FREIGHTER' | 'DEMO_WALLET';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string;
  balance: string;
  walletName: string;
  connectorType: WalletType;
}

export type ProverStep = 
  | 'IDLE'
  | 'FETCHING_WITNESS'
  | 'INITIALIZING_CIRCUIT'
  | 'GENERATING_ZK_PROOF'
  | 'SUBMITTING_TO_MIDNIGHT'
  | 'CONFIRMED'
  | 'FAILED';

export interface IssuedCredential {
  nullifier: string;
  tierId: string;
  tierName: string;
  thresholdUSD: number;
  txHash: string;
  blockHeight: number;
  issuedAt: string;
  contractAddress: string;
  verifierPublicKey: string;
  midnightProofDigest: string;
  contextNonce: string;
}

export interface VerificationActivity {
  id: string;
  nullifier: string;
  tierName: string;
  thresholdUSD: number;
  txHash: string;
  blockHeight: number;
  timestamp: string;
  status: 'VERIFIED' | 'REVOKED';
  network: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface CustomGateConfig {
  name: string;
  targetProtocol: string;
  thresholdAmount: number;
  currency: string;
  requiresAccreditation: boolean;
  jurisdictionExclusion: string[];
}
