'use client';

import React from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Droplets, Wallet, Wifi, WifiOff } from 'lucide-react';

export default function Header() {
  const { account, isConnected, isConnecting, connect, disconnect } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Droplets className="h-8 w-8 text-teal-400" />
              <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-md"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                FlowAgent
              </h1>
              <p className="text-xs text-gray-400">AI Water Distribution</p>
            </div>
          </div>

          {/* Network Status & Wallet */}
          <div className="flex items-center space-x-4">
            {/* Network Status */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">Base L2</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-400">Disconnected</span>
                </>
              )}
            </div>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="px-4 py-2 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-lg border border-teal-500/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white">
                      {formatAddress(account || '')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={disconnect}
                  className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Wallet className="h-4 w-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
