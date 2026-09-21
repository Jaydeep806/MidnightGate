import { isConnected as isFreighterConnected, requestAccess, getAddress, getNetwork } from '@stellar/freighter-api';
import { WalletState } from '../types';

export class WalletService {
  private static instance: WalletService;

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Check if Lace Midnight / Cardano DApp Connector is injected in browser
   */
  public async hasLaceExtension(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).midnight?.mnLace || 
      (window as any).cardano?.lace
    );
  }

  /**
   * Check if Stellar Freighter wallet extension is installed
   */
  public async hasFreighterExtension(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const res = await isFreighterConnected();
      return Boolean(res && (res as any).isConnected !== false);
    } catch {
      return Boolean((window as any).freighter);
    }
  }

  /**
   * Connect to REAL Lace Wallet on Midnight Preprod
   */
  public async connectLace(): Promise<WalletState> {
    const isLacePresent = await this.hasLaceExtension();

    if (!isLacePresent) {
      throw new Error(
        'LACE_NOT_INSTALLED: Lace Wallet extension was not detected in your browser. Please install Lace from the Chrome Web Store, or use the Quick Demo Wallet.'
      );
    }

    try {
      // 1. Try Midnight specific Lace connector
      if ((window as any).midnight?.mnLace) {
        const midnightApi = await (window as any).midnight.mnLace.enable();
        const addresses = await midnightApi.getUsedAddresses?.();
        const address = addresses?.[0] || 'midnight1addr_preprod_lace_user';
        
        return {
          isConnected: true,
          address,
          walletName: 'Lace (Midnight Preprod)',
          network: 'Midnight Preprod Testnet',
          balance: 'Active tDUST Account',
          connectorType: 'LACE_DAPP_CONNECTOR'
        };
      }

      // 2. Try standard Lace connector
      if ((window as any).cardano?.lace) {
        const api = await (window as any).cardano.lace.enable();
        const usedAddresses = await api.getUsedAddresses?.();
        const rawAddr = usedAddresses?.[0] || 'lace_wallet_connected';

        return {
          isConnected: true,
          address: rawAddr,
          walletName: 'Lace Wallet',
          network: 'Midnight Preprod (Cardano/Midnight Bridge)',
          balance: 'Active Lace Account',
          connectorType: 'LACE_DAPP_CONNECTOR'
        };
      }

      throw new Error('Unable to initialize Lace DApp connector.');
    } catch (err: any) {
      if (err?.message?.includes('declined') || err?.message?.includes('cancel') || err?.code === -1) {
        throw new Error('Connection request was declined in Lace Wallet.');
      }
      throw new Error(err?.message || 'Failed to connect with Lace Wallet.');
    }
  }

  /**
   * Connect to REAL Stellar Freighter Wallet via official @stellar/freighter-api
   */
  public async connectFreighter(): Promise<WalletState> {
    const isInstalled = await this.hasFreighterExtension();

    if (!isInstalled) {
      throw new Error(
        'FREIGHTER_NOT_INSTALLED: Stellar Freighter extension was not detected in your browser. Please install Freighter from freighter.app, or use the Quick Demo Wallet.'
      );
    }

    try {
      // Triggers the real Freighter browser pop-up authorization!
      const accessObj = await requestAccess();
      
      let publicKey = '';
      if (typeof accessObj === 'string') {
        publicKey = accessObj;
      } else if (accessObj && (accessObj as any).address) {
        publicKey = (accessObj as any).address;
      } else {
        const addrObj = await getAddress();
        publicKey = typeof addrObj === 'string' ? addrObj : (addrObj as any)?.address || '';
      }

      if (!publicKey) {
        throw new Error('Could not retrieve public key from Freighter.');
      }

      let networkName = 'Stellar Testnet';
      try {
        const net = await getNetwork();
        networkName = typeof net === 'string' ? net : (net as any)?.network || 'Stellar Testnet';
      } catch {
        // Default to Stellar Testnet
      }

      return {
        isConnected: true,
        address: publicKey,
        walletName: 'Stellar Freighter',
        network: `${networkName} ➔ Midnight Bridge`,
        balance: 'Active Stellar Account',
        connectorType: 'STELLAR_FREIGHTER'
      };
    } catch (err: any) {
      if (err?.message?.includes('User declined') || err?.message?.includes('rejected') || err?.message?.includes('User rejected')) {
        throw new Error('Connection request was cancelled in Freighter Wallet.');
      }
      throw new Error(err?.message || 'Failed to connect to Stellar Freighter wallet.');
    }
  }

  /**
   * Connect to instant Demo Testnet Sandbox Wallet
   */
  public async connectDemo(): Promise<WalletState> {
    await new Promise(res => setTimeout(res, 350));
    return {
      isConnected: true,
      address: 'mn_demo1z8x9y0k1w2d3j4v5f6h7s8a9b0c1d2e3f4g5h6',
      walletName: 'Quick Demo Sandbox',
      network: 'Midnight Preprod Sandbox',
      balance: '5,000.00 tDUST (Pre-funded)',
      connectorType: 'DEMO_WALLET'
    };
  }

  public async disconnect(): Promise<WalletState> {
    return {
      isConnected: false,
      address: null,
      walletName: '',
      network: 'Midnight Preprod',
      balance: '0.00 tDUST',
      connectorType: 'DEMO_WALLET'
    };
  }
}

export const walletService = WalletService.getInstance();
export const laceConnector = walletService;
