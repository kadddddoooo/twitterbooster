// Web3 Integration with Phantom Wallet
interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  on: (event: string, handler: (args: any) => void) => void;
  isConnected: boolean;
}

interface Window {
  solana?: PhantomProvider;
}

declare const window: Window;

export interface WalletInfo {
  address: string;
  balance: number;
  isConnected: boolean;
}

/**
 * Check if Phantom wallet is installed
 */
export function isPhantomInstalled(): boolean {
  const provider = window.solana;
  return provider?.isPhantom === true;
}

/**
 * Connect to Phantom wallet
 */
export async function connectPhantomWallet(): Promise<WalletInfo | null> {
  try {
    if (!isPhantomInstalled()) {
      throw new Error('Phantom wallet is not installed');
    }

    const provider = window.solana;
    const response = await provider?.connect();
    const address = response?.publicKey.toString() || '';

    // Get wallet balance through our API
    const balanceResponse = await fetch(`/api/web3/balance?address=${address}`);
    const balanceData = await balanceResponse.json();

    return {
      address,
      balance: balanceData.balance || 0,
      isConnected: true
    };
  } catch (error) {
    console.error('Error connecting to Phantom wallet:', error);
    return null;
  }
}

/**
 * Disconnect from Phantom wallet
 */
export async function disconnectPhantomWallet(): Promise<boolean> {
  try {
    if (!isPhantomInstalled()) {
      throw new Error('Phantom wallet is not installed');
    }

    await window.solana?.disconnect();
    return true;
  } catch (error) {
    console.error('Error disconnecting from Phantom wallet:', error);
    return false;
  }
}

/**
 * Check if wallet is connected
 */
export function getWalletConnectionStatus(): boolean {
  return !!window.solana?.isConnected;
}

/**
 * Create NFT collection (stub for API call)
 */
export async function createNFTCollection(name: string, description: string): Promise<any> {
  try {
    const response = await fetch('/api/web3/create-nft-collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create NFT collection');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating NFT collection:', error);
    throw error;
  }
}

/**
 * Set up token-gated content
 */
export async function setupTokenGatedContent(contentId: string, requiredToken: string): Promise<any> {
  try {
    const response = await fetch('/api/web3/token-gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId, requiredToken }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to set up token-gated content');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error setting up token-gated content:', error);
    throw error;
  }
}
