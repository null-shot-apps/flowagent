'use client';

import React from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { History, ShoppingCart, Zap, ExternalLink, Copy } from 'lucide-react';

export default function TransactionLog() {
  const { transactions, pumps } = useWeb3();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getPumpLocation = (pumpId: number) => {
    const pump = pumps.find(p => p.id === pumpId);
    return pump?.location || `Pump ${pumpId}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openInExplorer = (txHash: string) => {
    window.open(`https://sepolia-explorer.base.org/tx/${txHash}`, '_blank');
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, tx) => {
    const date = formatDate(tx.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tx);
    return groups;
  }, {} as Record<string, typeof transactions>);

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
          <History className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Transaction History</h2>
          <p className="text-sm text-gray-400">Real-time payment and activation log</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
            <History className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">No transactions yet</h3>
          <p className="text-sm text-gray-500">Purchase water credits to see transaction history</p>
        </div>
      ) : (
        <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
          {Object.entries(groupedTransactions).map(([date, txs]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-400 mb-3 sticky top-0 bg-gray-900/80 backdrop-blur-sm py-1">
                {date}
              </h3>
              <div className="space-y-3">
                {txs.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-200"
                  >
                    {/* Transaction Icon */}
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'purchase' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {tx.type === 'purchase' ? (
                        <ShoppingCart className="h-4 w-4" />
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-white">
                          {tx.type === 'purchase' ? 'Water Purchase' : 'Pump Activation'}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tx.type === 'purchase' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {tx.type === 'purchase' ? 'Purchase' : 'Activation'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{getPumpLocation(tx.pumpId)}</span>
                        <span>•</span>
                        <span>
                          {tx.type === 'purchase' ? `${tx.amount} credit` : `${tx.amount}L dispensed`}
                        </span>
                        <span>•</span>
                        <span>{formatTime(tx.timestamp)}</span>
                      </div>
                      {tx.buyer && (
                        <div className="mt-1 text-xs text-gray-500">
                          Buyer: {tx.buyer}
                        </div>
                      )}
                    </div>

                    {/* Transaction Hash */}
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-400 font-mono">
                        {tx.txHash.slice(0, 8)}...
                      </div>
                      <button
                        onClick={() => copyToClipboard(tx.txHash)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Copy transaction hash"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => openInExplorer(tx.txHash)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="View on explorer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
