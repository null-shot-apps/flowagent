import { ethers } from 'ethers';

// WaterBroker contract ABI
export const WATER_BROKER_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "pumpId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "liters",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PumpActivated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "pumpId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "WaterPurchased",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pumpId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "liters",
        "type": "uint256"
      }
    ],
    "name": "activatePump",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pumpId",
        "type": "uint256"
      }
    ],
    "name": "buyWater",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pumps",
    "outputs": [
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalDispensed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastActivation",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Base L2 testnet contract address (placeholder - will be deployed)
export const WATER_BROKER_ADDRESS = "0x1234567890123456789012345678901234567890";

// Base L2 testnet configuration
export const BASE_L2_CONFIG = {
  chainId: 84532, // Base Sepolia testnet
  name: 'Base Sepolia',
  currency: 'ETH',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia-explorer.base.org'
};

export const WATER_CREDIT_PRICE = ethers.parseEther("0.001"); // 0.001 ETH per credit

export interface PumpData {
  id: number;
  location: string;
  active: boolean;
  totalDispensed: number;
  lastActivation: number;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'activation';
  pumpId: number;
  amount: number;
  timestamp: number;
  txHash: string;
  buyer?: string;
}

export class WaterBrokerContract {
  private contract: ethers.Contract | null = null;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  async connect() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    await this.provider.send("eth_requestAccounts", []);
    this.signer = await this.provider.getSigner();
    
    // Switch to Base L2 network
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_L2_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Network not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${BASE_L2_CONFIG.chainId.toString(16)}`,
            chainName: BASE_L2_CONFIG.name,
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [BASE_L2_CONFIG.rpcUrl],
            blockExplorerUrls: [BASE_L2_CONFIG.blockExplorer],
          }],
        });
      }
    }

    this.contract = new ethers.Contract(
      WATER_BROKER_ADDRESS,
      WATER_BROKER_ABI,
      this.signer
    );

    return await this.signer.getAddress();
  }

  async buyWater(pumpId: number): Promise<string> {
    if (!this.contract) throw new Error('Contract not connected');
    
    const tx = await this.contract.buyWater(pumpId, {
      value: WATER_CREDIT_PRICE
    });
    
    return tx.hash;
  }

  async activatePump(pumpId: number, liters: number): Promise<string> {
    if (!this.contract) throw new Error('Contract not connected');
    
    const tx = await this.contract.activatePump(pumpId, liters);
    return tx.hash;
  }

  async getPumpData(pumpId: number): Promise<PumpData> {
    if (!this.contract) throw new Error('Contract not connected');
    
    const pumpData = await this.contract.pumps(pumpId);
    return {
      id: pumpId,
      location: this.getPumpLocation(pumpId),
      active: pumpData.active,
      totalDispensed: Number(pumpData.totalDispensed),
      lastActivation: Number(pumpData.lastActivation)
    };
  }

  private getPumpLocation(pumpId: number): string {
    const locations = [
      "Rural Kenya - Pump Station Alpha",
      "Ghana Village - Community Well",
      "Tanzania Well - Solar Powered Unit"
    ];
    return locations[pumpId] || `Pump ${pumpId}`;
  }

  setupEventListeners(
    onWaterPurchased: (event: any) => void,
    onPumpActivated: (event: any) => void
  ) {
    if (!this.contract) return;

    this.contract.on('WaterPurchased', onWaterPurchased);
    this.contract.on('PumpActivated', onPumpActivated);
  }

  removeEventListeners() {
    if (!this.contract) return;
    this.contract.removeAllListeners();
  }
}
