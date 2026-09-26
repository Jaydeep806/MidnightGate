import { describe, it, expect, beforeEach } from 'vitest';
import { MidnightGateContract, PrivateWitnesses } from './contractSimulator';

describe('MidnightGate Zero-Knowledge Verification Contract', () => {
  let contract: MidnightGateContract;
  const ISSUER_PK = '0xissuer_accredited_custodian_pk';
  const CURRENT_TIME = 1774600000n; // Fixed timestamp for deterministic testing

  beforeEach(() => {
    // Initializing fresh contract instance with $100k default threshold & issuer PK
    contract = new MidnightGateContract(
      100000n,
      '0xauthority_midnight_genesis',
      ISSUER_PK,
      1000n,
      100000000n
    );
  });

  it('Test 1: should successfully prove and register when private asset meets threshold and has valid authenticated issuer attestation', () => {
    const assetValue = 150000n;
    const salt = '0x9f4a8b2c1d3e5f7a0b2c4d6e8f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a';
    const attestationTime = CURRENT_TIME - 3600n; // 1 hour ago (fresh)
    const validSig = MidnightGateContract.computeIssuerAttestation(ISSUER_PK, salt, assetValue, attestationTime);

    const validWitness: PrivateWitnesses = {
      user_asset_value: assetValue,
      user_secret_salt: salt,
      issuer_attestation_sig: validSig,
      attestation_timestamp: attestationTime
    };

    const contextId = 'defi_launchpad_kyc_round_1';
    const result = contract.verifyAndRegisterCredential(validWitness, 100000n, contextId, CURRENT_TIME);

    expect(result.success).toBe(true);
    expect(result.nullifier).toMatch(/^0x[a-f0-9]{64}$/);
    expect(contract.ledger.total_verified_investors).toBe(1n);
    expect(contract.ledger.verified_nullifiers.has(result.nullifier)).toBe(true);
  });

  it('Test 2: should reject proof and throw circuit constraint error when private asset value is below threshold ($65k < $100k)', () => {
    const assetValue = 65000n; // Below threshold
    const salt = '0x111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000';
    const attestationTime = CURRENT_TIME - 3600n;
    const sig = MidnightGateContract.computeIssuerAttestation(ISSUER_PK, salt, assetValue, attestationTime);

    const insufficientWitness: PrivateWitnesses = {
      user_asset_value: assetValue,
      user_secret_salt: salt,
      issuer_attestation_sig: sig,
      attestation_timestamp: attestationTime
    };

    const contextId = 'defi_launchpad_kyc_round_1';

    expect(() => {
      contract.verifyAndRegisterCredential(insufficientWitness, 100000n, contextId, CURRENT_TIME);
    }).toThrowError('MidnightGate: Private asset value does not satisfy required threshold');

    expect(contract.ledger.total_verified_investors).toBe(0n);
    expect(contract.ledger.verified_nullifiers.size).toBe(0);
  });

  it('Test 3: should reject proof when authenticated issuer signature is forged or invalid', () => {
    const assetValue = 200000n;
    const salt = '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    const attestationTime = CURRENT_TIME - 1000n;

    const invalidWitness: PrivateWitnesses = {
      user_asset_value: assetValue,
      user_secret_salt: salt,
      issuer_attestation_sig: '0xforged_unauthorized_signature_00000000000000000000000000000000',
      attestation_timestamp: attestationTime
    };

    const contextId = 'defi_launchpad_kyc_round_1';

    expect(() => {
      contract.verifyAndRegisterCredential(invalidWitness, 100000n, contextId, CURRENT_TIME);
    }).toThrowError('MidnightGate: Invalid or unauthorized issuer attestation signature');

    expect(contract.ledger.total_verified_investors).toBe(0n);
  });

  it('Test 4: Anti-Replay Protection - should reject duplicate nullifiers to prevent credential reuse attacks', () => {
    const assetValue = 250000n;
    const salt = '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    const attestationTime = CURRENT_TIME - 500n;
    const sig = MidnightGateContract.computeIssuerAttestation(ISSUER_PK, salt, assetValue, attestationTime);

    const validWitness: PrivateWitnesses = {
      user_asset_value: assetValue,
      user_secret_salt: salt,
      issuer_attestation_sig: sig,
      attestation_timestamp: attestationTime
    };

    const contextId = 'institutional_private_vault_2026';

    // First attempt succeeds
    const firstAttempt = contract.verifyAndRegisterCredential(validWitness, 100000n, contextId, CURRENT_TIME);
    expect(firstAttempt.success).toBe(true);
    expect(contract.ledger.total_verified_investors).toBe(1n);

    // Second attempt with exact same salt and context must fail anti-replay check
    expect(() => {
      contract.verifyAndRegisterCredential(validWitness, 100000n, contextId, CURRENT_TIME);
    }).toThrowError('MidnightGate: Credential nullifier already registered on-chain');

    expect(contract.ledger.total_verified_investors).toBe(1n);
  });

  it('Test 5: should reject expired issuer attestations (> 90 days)', () => {
    const assetValue = 500000n;
    const salt = '0xexpired123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    const oldTime = CURRENT_TIME - 8000000n; // > 90 days old
    const sig = MidnightGateContract.computeIssuerAttestation(ISSUER_PK, salt, assetValue, oldTime);

    const expiredWitness: PrivateWitnesses = {
      user_asset_value: assetValue,
      user_secret_salt: salt,
      issuer_attestation_sig: sig,
      attestation_timestamp: oldTime
    };

    expect(() => {
      contract.verifyAndRegisterCredential(expiredWitness, 100000n, 'test_context', CURRENT_TIME);
    }).toThrowError('MidnightGate: Issuer attestation has expired (> 90 days)');
  });

  it('Test 6: Governance & Policy Enforcement - should enforce threshold policy bounds and allow updates', () => {
    // Attempting threshold above max policy ($100M)
    const assetValue = 200000000n;
    const salt = '0xwhale123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    const attestationTime = CURRENT_TIME - 100n;
    const sig = MidnightGateContract.computeIssuerAttestation(ISSUER_PK, salt, assetValue, attestationTime);

    const witness: PrivateWitnesses = {
      user_asset_value: assetValue,
      user_secret_salt: salt,
      issuer_attestation_sig: sig,
      attestation_timestamp: attestationTime
    };

    expect(() => {
      contract.verifyAndRegisterCredential(witness, 200000000n, 'super_whale_tier', CURRENT_TIME);
    }).toThrowError('MidnightGate: Required threshold exceeds protocol maximum policy');

    // Update policy to allow higher threshold
    contract.updateThresholdPolicy(1000n, 500000000n, 100000n);
    const result = contract.verifyAndRegisterCredential(witness, 200000000n, 'super_whale_tier', CURRENT_TIME);
    expect(result.success).toBe(true);
  });
});
