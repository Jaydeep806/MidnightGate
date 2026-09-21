import { describe, it, expect, beforeEach } from 'vitest';
import { MidnightGateContract, PrivateWitnesses } from './contractSimulator';

describe('MidnightGate Zero-Knowledge Verification Contract', () => {
  let contract: MidnightGateContract;

  beforeEach(() => {
    // Initializing fresh contract instance before each test with $100k default threshold
    contract = new MidnightGateContract(100000n, '0xauthority_midnight_genesis');
  });

  it('Test 1: should successfully prove and register when private asset value meets Accredited Investor threshold ($150k >= $100k)', () => {
    const validWitness: PrivateWitnesses = {
      user_asset_value: 150000n,
      user_secret_salt: '0x9f4a8b2c1d3e5f7a0b2c4d6e8f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a'
    };

    const contextId = 'defi_launchpad_kyc_round_1';
    const result = contract.verifyAndRegisterCredential(validWitness, 100000n, contextId);

    expect(result.success).toBe(true);
    expect(result.nullifier).toMatch(/^0x[a-f0-9]{64}$/);
    expect(contract.ledger.total_verified_investors).toBe(1n);
    expect(contract.ledger.verified_nullifiers.has(result.nullifier)).toBe(true);
  });

  it('Test 2: should reject proof and throw circuit constraint error when private asset value is below threshold ($65k < $100k)', () => {
    const insufficientWitness: PrivateWitnesses = {
      user_asset_value: 65000n, // Below threshold
      user_secret_salt: '0x111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000'
    };

    const contextId = 'defi_launchpad_kyc_round_1';

    expect(() => {
      contract.verifyAndRegisterCredential(insufficientWitness, 100000n, contextId);
    }).toThrowError('MidnightGate: Private asset value does not satisfy required threshold');

    // Ensure state remains unchanged on failure
    expect(contract.ledger.total_verified_investors).toBe(0n);
    expect(contract.ledger.verified_nullifiers.size).toBe(0);
  });

  it('Test 3: Anti-Replay Protection - should reject duplicate nullifiers to prevent credential reuse attacks', () => {
    const validWitness: PrivateWitnesses = {
      user_asset_value: 250000n,
      user_secret_salt: '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'
    };

    const contextId = 'institutional_private_vault_2026';

    // First attempt succeeds
    const firstAttempt = contract.verifyAndRegisterCredential(validWitness, 100000n, contextId);
    expect(firstAttempt.success).toBe(true);
    expect(contract.ledger.total_verified_investors).toBe(1n);

    // Second attempt with exact same salt and context must fail anti-replay check
    expect(() => {
      contract.verifyAndRegisterCredential(validWitness, 100000n, contextId);
    }).toThrowError('MidnightGate: Credential nullifier already registered on-chain');

    // Counter should not have incremented a second time
    expect(contract.ledger.total_verified_investors).toBe(1n);
  });

  it('Test 4: should support custom Institutional Whale tier threshold ($1,000,000+) verification', () => {
    const whaleWitness: PrivateWitnesses = {
      user_asset_value: 2500000n, // $2.5M
      user_secret_salt: '0xfeedfacecafebeef0123456789abcdef0123456789abcdef0123456789abcdef'
    };

    const institutionalThreshold = 1000000n;
    const contextId = 'vip_institutional_allocation_2026';

    const result = contract.verifyAndRegisterCredential(whaleWitness, institutionalThreshold, contextId);

    expect(result.success).toBe(true);
    expect(contract.ledger.total_verified_investors).toBe(1n);
  });
});
