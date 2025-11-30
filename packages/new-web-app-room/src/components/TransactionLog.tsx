'use client';

import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'purchase' | 'activation' | 'maintenance';
  amount: number;
  pump: string;
  user: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
}

const TransactionLog: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'purchase',
      amount: 15,
      pump: 'Rural Kenya',
      user: '0x1234...5678',
      timestamp: '2 minutes ago',
      status: 'completed',
      txHash: '0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
    },
    {
      id: '2',
      type: 'activation',
      amount: 10,
      pump: 'Ghana Village',
      user: '0x5678...9012',
      timestamp: '5 minutes ago',
      status: 'completed',
      txHash: '0xefgh5678901234efghij5678901234efghij5678901234efghij5678901234ef'
    },
    {
      id: '3',
      type: 'purchase',
      amount: 25,
      pump: 'Rural Kenya',
      user: '0x9012...3456',
      timestamp: '8 minutes ago',
      status: 'pending',
      txHash: '0xijkl9012345678ijklmn9012345678ijklmn9012345678ijklmn9012345678ij'
    },
    {
      id: '4',
      type: 'maintenance',
      amount: 0,
      pump: 'Tanzania Well',
      user: 'System',
      timestamp: '15 minutes ago',
      status: 'completed',
      txHash: '0xmnop3456789012mnopqr3456789012mnopqr3456789012mnopqr3456789012mn'
    },
    {
      id: '5',
      type: 'purchase',
      amount: 8,
      pump: 'Ghana Village',
      user: '0x3456...7890',
      timestamp: '22 minutes ago',
      status: 'completed',
      txHash: '0xqrst7890123456qrstuv7890123456qrstuv7890123456qrstuv7890123456qr'
    }
  ]);

  // Simulate new transactions
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: Math.random() > 0.7 ? 'activation' : 'purchase',
          amount: Math.floor(Math.random() * 20) + 5,
          pump: ['Rural Kenya', 'Ghana Village', 'Tanzania Well'][Math.floor(Math.random() * 3)],
          user: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
          timestamp: 'Just now',
          status: 'pending',
          txHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`
        };
        
        setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
        
        // Update status after 3 seconds
        setTimeout(() => {
          setTransactions(prev => prev.map(tx => 
            tx.id === newTransaction.id 
              ? { ...tx, status: 'completed' as const, timestamp: '1 minute ago' }
              : tx
          ));
        }, 3000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase': return '💧';
      case 'activation': return '⚡';
      case 'maintenance': return '🔧';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-blue-400 bg-blue-400/10';
      case 'activation': return 'text-green-400 bg-green-400/10';
      case 'maintenance': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            📊
          </span>
          Transaction Log
        </h2>
        <button className="btn-secondary text-sm">
          Export CSV
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-slate-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(tx.type)}`}>
                  <span className="text-lg">{getTypeIcon(tx.type)}</span>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium capitalize">{tx.type}</span>
                    {tx.amount > 0 && (
                      <span className="text-gray-400">• {tx.amount}L</span>
                    )}
                    <span className="text-gray-400">• {tx.pump}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">From: {tx.user}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-sm text-gray-500">{tx.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                  {tx.status === 'pending' && <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2"></span>}
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </div>
                <a 
                  href={`https://basescan.org/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gray-300 underline mt-1 block"
                >
                  {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{transactions.filter(tx => tx.type === 'purchase').length}</p>
          <p className="text-sm text-gray-400">Purchases</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{transactions.filter(tx => tx.type === 'activation').length}</p>
          <p className="text-sm text-gray-400">Activations</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{transactions.filter(tx => tx.status === 'pending').length}</p>
          <p className="text-sm text-gray-400">Pending</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionLog;
