'use client';

import React, { useState } from 'react';
import { useWeb3 } from './Web3Provider';
import { ethers } from 'ethers';

const WATER_PRICE = '0.001'; // ETH per credit
const DEMO_PUMPS = [
  { id: 1, name: 'Rural Kenya', location: 'Nairobi Region', status: 'active' },
  { id: 2, name: 'Ghana Village', location: 'Ashanti Region', status: 'active' },
  { id: 3, name: 'Tanzania Well', location: 'Dodoma Region', status: 'maintenance' },
];

const PurchasePanel: React.FC = () => {
  const { isConnected, signer, chainId } = useWeb3();
  const [selectedPump, setSelectedPump] = useState(1);
  const [waterAmount, setWaterAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);

  const isOnBase = chainId === 8453;

  const handlePurchase = async () => {
    if (!isConnected || !signer || !isOnBase) {
      alert('Please connect your wallet and switch to Base network');
      return;
    }

    setIsLoading(true);
    try {
      // Calculate total cost
      const totalCost = ethers.parseEther((parseFloat(WATER_PRICE) * waterAmount).toString());
      
      // For demo purposes, we'll simulate a transaction
      // In production, this would interact with the actual smart contract
      const tx = await signer.sendTransaction({
        to: '0x1234567890123456789012345678901234567890', // Demo contract address
        value: totalCost,
        data: ethers.id(`buyWater(${selectedPump})`).slice(0, 10), // Function selector
      });

      setLastTransaction(tx.hash);
      
      // Simulate AI agent processing
      setTimeout(() => {
        alert(`✅ Purchase successful! ${waterAmount} liters purchased for pump ${selectedPump}. AI agent is generating SMS commands...`);
      }, 2000);

    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-xl p-6 card-hover">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
          💧
        </span>
        Purchase Water
      </h2>

      {/* Pump Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Pump Location
        </label>
        <div className="space-y-2">
          {DEMO_PUMPS.map((pump) => (
            <div
              key={pump.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedPump === pump.id
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              } ${pump.status === 'maintenance' ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => pump.status !== 'maintenance' && setSelectedPump(pump.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{pump.name}</p>
                  <p className="text-sm text-gray-400">{pump.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    pump.status === 'active' ? 'status-active' : 
                    pump.status === 'maintenance' ? 'status-pending' : 'status-inactive'
                  }`}></div>
                  <span className="text-xs text-gray-400 capitalize">{pump.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Water Amount (Liters)
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            max="1000"
            value={waterAmount}
            onChange={(e) => setWaterAmount(parseInt(e.target.value) || 1)}
            className="w-full bg-slate-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
            placeholder="Enter amount"
          />
          <div className="absolute right-3 top-3 text-gray-400 text-sm">
            L
          </div>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-gray-400">Price per liter: {WATER_PRICE} ETH</span>
          <span className="text-teal-400 font-medium">
            Total: {(parseFloat(WATER_PRICE) * waterAmount).toFixed(4)} ETH
          </span>
        </div>
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={!isConnected || !isOnBase || isLoading || DEMO_PUMPS.find(p => p.id === selectedPump)?.status === 'maintenance'}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="spinner"></div>
            <span>Processing...</span>
          </>
        ) : !isConnected ? (
          <span>Connect Wallet to Purchase</span>
        ) : !isOnBase ? (
          <span>Switch to Base Network</span>
        ) : (
          <>
            <span>💧</span>
            <span>Purchase Water Credits</span>
          </>
        )}
      </button>

      {/* Last Transaction */}
      {lastTransaction && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-400">
            ✅ Last transaction: 
            <a 
              href={`https://basescan.org/tx/${lastTransaction}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline hover:text-green-300"
            >
              {lastTransaction.slice(0, 10)}...{lastTransaction.slice(-8)}
            </a>
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-400">
          💡 AI agents automatically generate SMS commands for IoT pumps after purchase confirmation
        </p>
      </div>
    </div>
  );
};

export default PurchasePanel;
