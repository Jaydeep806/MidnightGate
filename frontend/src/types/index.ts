export interface VerificationTier {
  id: string;
  name: string;
  badge: string;
  thresholdUSD: number;
  description: string;
  color: string;
  iconName: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string;
  balance: string;
  connectorType: 'LACE_DAPP_CONNECTOR' | 'SIMULATOR';
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
}
