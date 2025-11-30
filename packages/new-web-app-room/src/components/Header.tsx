'use client';

import React from 'react';
import { useWeb3 } from './Web3Provider';

const Header: React.FC = () => {
  const { account, isConnected, isConnecting, chainId, connectWallet, disconnectWallet, switchToBase } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isOnBase = chainId === 8453;

  return (
    <header className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FlowAgent</h1>
              <p className="text-sm text-gray-400">AI Water Distribution</p>
            </div>
          </div>

          {/* Network Status & Wallet */}
          <div className="flex items-center space-x-4">
            {/* Network Status */}
            {isConnected && (
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnBase ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-300">
                  {isOnBase ? 'Base L2' : 'Wrong Network'}
                </span>
                {!isOnBase && (
                  <button
                    onClick={switchToBase}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                  >
                    Switch to Base
                  </button>
                )}
              </div>
            )}

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{formatAddress(account!)}</p>
                  <p className="text-xs text-gray-400">Connected</p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="btn-secondary text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-primary flex items-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h.01a1 1 0 100-2H5zm3 0a1 1 0 000 2h.01a1 1 0 100-2H8zm3 0a1 1 0 000 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                    </svg>
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
