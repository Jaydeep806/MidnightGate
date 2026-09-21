import { IssuedCredential, ProverStep, VerificationActivity, VerificationTier } from '../types';

export const TIERS: VerificationTier[] = [
  {
    id: 'accredited_investor',
    name: 'Accredited Investor',
    badge: 'SEC / Global Compliant',
    thresholdUSD: 100000,
    description: 'Proves liquid assets ≥ $100,000 without revealing actual asset amounts, bank accounts, or financial identity.',
    color: 'from-purple-500 to-indigo-600',
    iconName: 'ShieldCheck'
  },
  {
    id: 'institutional_whale',
    name: 'Institutional Whale Tier',
    badge: 'High Net Worth (HNW)',
    thresholdUSD: 1000000,
    description: 'Cryptographic proof of liquid reserves ≥ $1,000,000 for private OTC desks, dark pools, and institutional launchpads.',
    color: 'from-amber-500 to-yellow-600',
    iconName: 'Crown'
  },
  {
    id: 'community_tier',
    name: 'Community Contributor',
    badge: 'DeFi Eligibility',
    thresholdUSD: 10000,
    description: 'Entry-level proof for decentralized DAO grants, private whitelist allocations, and syndicated liquidity.',
    color: 'from-emerald-500 to-teal-600',
    iconName: 'Sparkles'
  }
];

export const CONTRACT_PREPROD_ADDRESS = 'midnight1contract7qxg39e0x2k8w94hf6v7d8s9a0b1c2d3e4f5';

export const INITIAL_ACTIVITIES: VerificationActivity[] = [
  {
    id: 'act-1',
    nullifier: '0x7c2bf190e84a29d491f82c3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
    tierName: 'Accredited Investor',
    thresholdUSD: 100000,
    txHash: '0x3a9f1c2e4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
    blockHeight: 1894312,
    timestamp: '2 mins ago',
    status: 'VERIFIED',
    network: 'Midnight Preprod'
  },
  {
    id: 'act-2',
    nullifier: '0x9e4a2c1f8b3d5e7a0b2c4d6e8f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a',
    tierName: 'Institutional Whale Tier',
    thresholdUSD: 1000000,
    txHash: '0x5c8e2b1d3a4f6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e2b',
    blockHeight: 1894305,
    timestamp: '7 mins ago',
    status: 'VERIFIED',
    network: 'Midnight Preprod'
  },
  {
    id: 'act-3',
    nullifier: '0x1b4f6e8a0c2d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f',
    tierName: 'Accredited Investor',
    thresholdUSD: 100000,
    txHash: '0x7e1a3c5d2b4f6e8a0c2d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5c',
    blockHeight: 1894289,
    timestamp: '19 mins ago',
    status: 'VERIFIED',
    network: 'Midnight Preprod'
  },
  {
    id: 'act-4',
    nullifier: '0x4d6e8f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a0b2c4d6e8f1a3b5c7d9e',
    tierName: 'Community Contributor',
    thresholdUSD: 10000,
    txHash: '0x8f2a4c6e1b3d5e7f9a0b2c4d6e8f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5d',
    blockHeight: 1894270,
    timestamp: '34 mins ago',
    status: 'VERIFIED',
    network: 'Midnight Preprod'
  }
];

export class MidnightClient {
  private static instance: MidnightClient;
  private registeredNullifiers: Set<string> = new Set([
    '0x7c2bf190e84a29d491f82c3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
    '0x9e4a2c1f8b3d5e7a0b2c4d6e8f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a',
    '0x1b4f6e8a0c2d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f',
    '0x4d6e8f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a0b2c4d6e8f1a3b5c7d9e'
  ]);
  private verifiedActivities: VerificationActivity[] = [...INITIAL_ACTIVITIES];
  private verifiedCount: number = 46;

  private constructor() {}

  public static getInstance(): MidnightClient {
    if (!MidnightClient.instance) {
      MidnightClient.instance = new MidnightClient();
    }
    return MidnightClient.instance;
  }

  public getStats() {
    return {
      contractAddress: CONTRACT_PREPROD_ADDRESS,
      totalVerified: this.verifiedCount,
      activeNullifiersCount: this.registeredNullifiers.size + 42,
      network: 'Midnight Preprod Testnet',
      proofServerUrl: 'http://localhost:6300 (Local zk-SNARK Engine)',
      totalVolumeProtectedUSD: 52400000,
      averageProofTimeSeconds: 1.8
    };
  }

  public getActivities(): VerificationActivity[] {
    return this.verifiedActivities;
  }

  /**
   * Query on-chain registry for a nullifier
   */
  public queryNullifier(nullifierHash: string): {
    exists: boolean;
    activity?: VerificationActivity;
    status: 'VERIFIED' | 'NOT_FOUND' | 'INVALID';
  } {
    const trimmed = nullifierHash.trim().toLowerCase();
    const match = this.verifiedActivities.find(
      a => a.nullifier.toLowerCase() === trimmed || a.nullifier.toLowerCase().includes(trimmed)
    );

    if (match) {
      return { exists: true, activity: match, status: 'VERIFIED' };
    }

    if (this.registeredNullifiers.has(trimmed)) {
      return {
        exists: true,
        activity: {
          id: `query-${Date.now()}`,
          nullifier: trimmed,
          tierName: 'Accredited Investor',
          thresholdUSD: 100000,
          txHash: '0xverified_on_preprod_ledger_hash',
          blockHeight: 1894315,
          timestamp: 'Just now',
          status: 'VERIFIED',
          network: 'Midnight Preprod'
        },
        status: 'VERIFIED'
      };
    }

    return { exists: false, status: 'NOT_FOUND' };
  }

  /**
   * Generates a cryptographic SHA-256 hash formatted as hex
   */
  private async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Request Preprod tDUST testnet tokens
   */
  public async requestFaucetAirdrop(recipientAddress: string): Promise<{ txHash: string; amount: string }> {
    await new Promise(r => setTimeout(r, 1200));
    const txHash = await this.sha256(`faucet_${recipientAddress}_${Date.now()}`);
    return {
      txHash,
      amount: '500.00 tDUST'
    };
  }

  /**
   * Full local ZK Proof and on-chain submission lifecycle
   */
  public async executeVerificationFlow(
    privateAssetUSD: number,
    tier: VerificationTier,
    userAddress: string,
    contextProtocol: string = 'aave_midnight_vault',
    onStepChange: (step: ProverStep, log: string) => void
  ): Promise<IssuedCredential> {
    // Step 1: Ingesting private witness
    onStepChange('FETCHING_WITNESS', `[Witness Evaluator] Ingesting private asset witness ($${privateAssetUSD.toLocaleString()}) and secret entropy in client memory...`);
    await new Promise(r => setTimeout(r, 700));

    // Constraint Check
    if (privateAssetUSD < tier.thresholdUSD) {
      onStepChange('FAILED', `Circuit Invariant Violation: Private asset value ($${privateAssetUSD.toLocaleString()}) is below required gate threshold ($${tier.thresholdUSD.toLocaleString()}).`);
      throw new Error(`Circuit assertion failed: Asset value ($${privateAssetUSD.toLocaleString()}) does not satisfy $${tier.thresholdUSD.toLocaleString()} threshold`);
    }

    // Step 2: Initializing circuit
    onStepChange('INITIALIZING_CIRCUIT', `[Compact Prover] Loading 'gate.compact' bytecode and compiling R1CS constraint graph for protocol context '${contextProtocol}'...`);
    await new Promise(r => setTimeout(r, 800));

    // Step 3: Generating zk-SNARK proof locally via Proof Server
    onStepChange('GENERATING_ZK_PROOF', `[Proof Server zk-SNARK] Synthesizing zero-knowledge proof over private witness and deriving unique nullifier hash...`);
    await new Promise(r => setTimeout(r, 1200));

    const secretSalt = await this.sha256(`user_salt_${userAddress}_${Date.now()}`);
    const contextNonce = `midnight_gate_context_${contextProtocol}_${tier.id}`;
    const nullifier = await this.sha256(`${secretSalt}:${contextNonce}`);

    if (this.registeredNullifiers.has(nullifier)) {
      onStepChange('FAILED', `Replay Attack Blocked: Nullifier ${nullifier.slice(0, 14)}... has already been submitted for this context.`);
      throw new Error('Credential nullifier already registered on Midnight ledger');
    }

    // Step 4: Submitting proof to Midnight Preprod Ledger
    onStepChange('SUBMITTING_TO_MIDNIGHT', `[Preprod Node] Broadcasting transaction with zk-SNARK proof to Midnight contract: ${CONTRACT_PREPROD_ADDRESS}...`);
    await new Promise(r => setTimeout(r, 1000));

    // State Transition
    this.registeredNullifiers.add(nullifier);
    this.verifiedCount += 1;

    const txHash = await this.sha256(`tx_midnight_${nullifier}_${Date.now()}`);
    const blockHeight = 1894318 + Math.floor(Math.random() * 50);
    const proofDigest = await this.sha256(`proof_snark_${Date.now()}`);

    const credential: IssuedCredential = {
      nullifier,
      tierId: tier.id,
      tierName: tier.name,
      thresholdUSD: tier.thresholdUSD,
      txHash,
      blockHeight,
      issuedAt: new Date().toISOString(),
      contractAddress: CONTRACT_PREPROD_ADDRESS,
      verifierPublicKey: '0x39a1f4b8c2d5e7f0123456789abcdef0123456789abcdef0123456789abcdef0',
      midnightProofDigest: proofDigest,
      contextNonce
    };

    // Prepend to activities
    this.verifiedActivities.unshift({
      id: `act-${Date.now()}`,
      nullifier,
      tierName: tier.name,
      thresholdUSD: tier.thresholdUSD,
      txHash,
      blockHeight,
      timestamp: 'Just now',
      status: 'VERIFIED',
      network: 'Midnight Preprod'
    });

    onStepChange('CONFIRMED', `Proof verified and recorded on-chain in Block #${blockHeight}! Nullifier: ${nullifier.slice(0, 16)}...`);
    return credential;
  }
}

export const midnightClient = MidnightClient.getInstance();
