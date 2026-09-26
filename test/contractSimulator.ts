import { createHash } from 'crypto';

export interface LedgerState {
  verified_nullifiers: Set<string>;
  total_verified_investors: bigint;
  default_threshold_usd: bigint;
  min_threshold_policy: bigint;
  max_threshold_policy: bigint;
  authority_id: string;
  authorized_issuer_pk: string;
}

export interface PrivateWitnesses {
  user_asset_value: bigint;
  user_secret_salt: string;
  issuer_attestation_sig: string;
  attestation_timestamp: bigint;
}

export class MidnightGateContract {
  public ledger: LedgerState;

  constructor(
    defaultThresholdUSD: bigint = 100000n,
    authorityId: string = '0xauthority_midnight_genesis',
    authorizedIssuerPk: string = '0xissuer_accredited_custodian_pk',
    minThreshold: bigint = 1000n,
    maxThreshold: bigint = 100000000n
  ) {
    this.ledger = {
      verified_nullifiers: new Set<string>(),
      total_verified_investors: 0n,
      default_threshold_usd: defaultThresholdUSD,
      min_threshold_policy: minThreshold,
      max_threshold_policy: maxThreshold,
      authority_id: authorityId,
      authorized_issuer_pk: authorizedIssuerPk
    };
  }

  /**
   * Cryptographic hash simulation matching Compact's hash(issuer_pk, salt, asset_value, timestamp)
   */
  public static computeIssuerAttestation(
    issuerPk: string,
    secretSalt: string,
    assetValue: bigint,
    timestamp: bigint
  ): string {
    const hash = createHash('sha256');
    hash.update(`${issuerPk}:${secretSalt}:${assetValue.toString()}:${timestamp.toString()}`);
    return `0x${hash.digest('hex')}`;
  }

  /**
   * Cryptographic hash simulation matching Compact's hash(salt, context)
   */
  public computeNullifier(secretSalt: string, contextNonce: string): string {
    const hash = createHash('sha256');
    hash.update(`${secretSalt}:${contextNonce}`);
    return `0x${hash.digest('hex')}`;
  }

  /**
   * Simulates the Compact circuit: verify_and_register_credential
   */
  public verifyAndRegisterCredential(
    witness: PrivateWitnesses,
    requiredThreshold: bigint,
    contextNonce: string,
    currentTime: bigint = BigInt(Math.floor(Date.now() / 1000))
  ): { success: boolean; nullifier: string; newTotal: bigint } {
    const { user_asset_value, user_secret_salt, issuer_attestation_sig, attestation_timestamp } = witness;

    // 1. Enforce Threshold Policy Bounds
    if (requiredThreshold < this.ledger.min_threshold_policy) {
      throw new Error('MidnightGate: Required threshold is below protocol minimum policy');
    }
    if (requiredThreshold > this.ledger.max_threshold_policy) {
      throw new Error('MidnightGate: Required threshold exceeds protocol maximum policy');
    }

    // 2. Attestation Freshness Check (90 days = 7,776,000 seconds)
    if (currentTime < attestation_timestamp) {
      throw new Error('MidnightGate: Attestation timestamp cannot be in the future');
    }
    if (currentTime - attestation_timestamp > 7776000n) {
      throw new Error('MidnightGate: Issuer attestation has expired (> 90 days)');
    }

    // 3. Authenticated Issuer Attestation Verification
    const expectedSig = MidnightGateContract.computeIssuerAttestation(
      this.ledger.authorized_issuer_pk,
      user_secret_salt,
      user_asset_value,
      attestation_timestamp
    );
    if (issuer_attestation_sig !== expectedSig) {
      throw new Error('MidnightGate: Invalid or unauthorized issuer attestation signature');
    }

    // 4. Threshold Constraint Check
    if (user_asset_value < requiredThreshold) {
      throw new Error('MidnightGate: Private asset value does not satisfy required threshold');
    }

    // 5. Nullifier Derivation
    const nullifier = this.computeNullifier(user_secret_salt, contextNonce);

    // 6. Anti-Replay Check
    if (this.ledger.verified_nullifiers.has(nullifier)) {
      throw new Error('MidnightGate: Credential nullifier already registered on-chain');
    }

    // 7. Ledger State Transition
    this.ledger.verified_nullifiers.add(nullifier);
    this.ledger.total_verified_investors += 1n;

    return {
      success: true,
      nullifier,
      newTotal: this.ledger.total_verified_investors
    };
  }

  /**
   * Circuit to update threshold policy
   */
  public updateThresholdPolicy(minThreshold: bigint, maxThreshold: bigint, defaultThreshold: bigint): void {
    if (minThreshold <= 0n) {
      throw new Error('MidnightGate: Minimum threshold must be > 0');
    }
    if (maxThreshold < minThreshold) {
      throw new Error('MidnightGate: Max threshold must be >= Min threshold');
    }
    if (defaultThreshold < minThreshold || defaultThreshold > maxThreshold) {
      throw new Error('MidnightGate: Default threshold must be within bounds');
    }
    this.ledger.min_threshold_policy = minThreshold;
    this.ledger.max_threshold_policy = maxThreshold;
    this.ledger.default_threshold_usd = defaultThreshold;
  }

  public setAuthorizedIssuer(newIssuerPk: string): void {
    this.ledger.authorized_issuer_pk = newIssuerPk;
  }
}
