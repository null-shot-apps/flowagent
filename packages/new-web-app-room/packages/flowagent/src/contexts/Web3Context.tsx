'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WaterBrokerContract, PumpData, Transaction } from '@/lib/contract';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  contract: WaterBrokerContract | null;
  pumps: PumpData[];
  transactions: Transaction[];
  totalDispensed: number;
  activePumps: number;
  pendingRequests: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  buyWater: (pumpId: number) => Promise<string>;
  refreshData: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contract, setContract] = useState<WaterBrokerContract | null>(null);
  const [pumps, setPumps] = useState<PumpData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Demo data for hackathon
  const [demoTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'purchase',
      pumpId: 0,
      amount: 1,
      timestamp: Date.now() - 300000,
      txHash: '0xabc123...',
      buyer: '0x1234...5678'
    },
    {
      id: '2',
      type: 'activation',
      pumpId: 0,
      amount: 10,
      timestamp: Date.now() - 240000,
      txHash: '0xdef456...'
    },
    {
      id: '3',
      type: 'purchase',
      pumpId: 1,
      amount: 1,
      timestamp: Date.now() - 180000,
      txHash: '0x789abc...',
      buyer: '0x9876...4321'
    }
  ]);

  const [demoPumps] = useState<PumpData[]>([
    {
      id: 0,
      location: "Rural Kenya - Pump Station Alpha",
      active: true,
      totalDispensed: 1250,
      lastActivation: Date.now() - 240000
    },
    {
      id: 1,
      location: "Ghana Village - Community Well",
      active: false,
      totalDispensed: 890,
      lastActivation: Date.now() - 3600000
    },
    {
      id: 2,
      location: "Tanzania Well - Solar Powered Unit",
      active: true,
      totalDispensed: 2100,
      lastActivation: Date.now() - 120000
    }
  ]);

  const totalDispensed = pumps.reduce((sum, pump) => sum + pump.totalDispensed, 0);
  const activePumps = pumps.filter(pump => pump.active).length;
  const pendingRequests = transactions.filter(tx => 
    tx.type === 'purchase' && 
    Date.now() - tx.timestamp < 300000
  ).length;

  const connect = async () => {
    try {
      setIsConnecting(true);
      const waterContract = new WaterBrokerContract();
      const address = await waterContract.connect();
      
      setContract(waterContract);
      setAccount(address);
      setIsConnected(true);
      
      // Setup event listeners
      waterContract.setupEventListeners(
        (event) => {
          console.log('Water purchased:', event);
          addTransaction({
            id: Date.now().toString(),
            type: 'purchase',
            pumpId: Number(event.pumpId),
            amount: Number(event.amount),
            timestamp: Date.now(),
            txHash: event.transactionHash,
            buyer: event.buyer
          });
        },
        (event) => {
          console.log('Pump activated:', event);
          addTransaction({
            id: Date.now().toString(),
            type: 'activation',
            pumpId: Number(event.pumpId),
            amount: Number(event.liters),
            timestamp: Date.now(),
            txHash: event.transactionHash
          });
        }
      );

      // Load initial data (use demo data for hackathon)
      setPumps(demoPumps);
      setTransactions(demoTransactions);
      
    } catch (error) {
      console.error('Failed to connect:', error);
      // For demo purposes, still show demo data even if wallet connection fails
      setPumps(demoPumps);
      setTransactions(demoTransactions);
      setAccount('0x1234...5678'); // Demo account
      setIsConnected(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (contract) {
      contract.removeEventListeners();
    }
    setContract(null);
    setAccount(null);
    setIsConnected(false);
    setPumps([]);
    setTransactions([]);
  };

  const buyWater = async (pumpId: number): Promise<string> => {
    if (!contract) {
      // Demo mode - simulate transaction
      const demoTxHash = `0x${Math.random().toString(16).substr(2, 8)}...`;
      addTransaction({
        id: Date.now().toString(),
        type: 'purchase',
        pumpId,
        amount: 1,
        timestamp: Date.now(),
        txHash: demoTxHash,
        buyer: account || '0x1234...5678'
      });
      
      // Simulate pump activation after purchase
      setTimeout(() => {
        addTransaction({
          id: (Date.now() + 1).toString(),
          type: 'activation',
          pumpId,
          amount: 10,
          timestamp: Date.now(),
          txHash: `0x${Math.random().toString(16).substr(2, 8)}...`
        });
        
        // Update pump status
        setPumps(prev => prev.map(pump => 
          pump.id === pumpId 
            ? { ...pump, active: true, totalDispensed: pump.totalDispensed + 10, lastActivation: Date.now() }
            : pump
        ));
      }, 2000);
      
      return demoTxHash;
    }
    
    return await contract.buyWater(pumpId);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev].slice(0, 10)); // Keep last 10 transactions
  };

  const refreshData = async () => {
    if (!contract) return;
    
    try {
      // In a real implementation, this would fetch fresh data from the blockchain
      // For demo, we'll just update timestamps
      setPumps(prev => prev.map(pump => ({
        ...pump,
        lastActivation: pump.active ? Date.now() - Math.random() * 300000 : pump.lastActivation
      })));
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(refreshData, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connect();
          }
        } catch (error) {
          console.error('Failed to check existing connection:', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  const value: Web3ContextType = {
    account,
    isConnected,
    isConnecting,
    contract,
    pumps,
    transactions,
    totalDispensed,
    activePumps,
    pendingRequests,
    connect,
    disconnect,
    buyWater,
    refreshData
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}
