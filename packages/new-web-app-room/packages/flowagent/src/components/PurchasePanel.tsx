'use client';

import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { ShoppingCart, Droplets, MapPin, Zap, Clock } from 'lucide-react';

export default function PurchasePanel() {
  const { pumps, buyWater, isConnected } = useWeb3();
  const [selectedPump, setSelectedPump] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchase = async () => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      const txHash = await buyWater(selectedPump);
      console.log('Transaction hash:', txHash);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastActivation = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-lg">
          <ShoppingCart className="h-5 w-5 text-teal-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Purchase Water Credits</h2>
          <p className="text-sm text-gray-400">0.001 ETH per credit • Instant activation</p>
        </div>
      </div>

      {/* Pump Selection */}
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-medium text-gray-300">
          Select Pump Location
        </label>
        <div className="grid gap-3">
          {pumps.map((pump) => (
            <div
              key={pump.id}
              onClick={() => setSelectedPump(pump.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedPump === pump.id
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    pump.active 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{pump.location}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Droplets className="h-3 w-3" />
                        <span>{pump.totalDispensed}L dispensed</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{formatLastActivation(pump.lastActivation)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    pump.active 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      pump.active ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    <span>{pump.active ? 'Active' : 'Idle'}</span>
                  </div>
                  {selectedPump === pump.id && (
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Details */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-300">Water Credits</span>
          <span className="text-white font-medium">1 Credit</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-300">Estimated Water</span>
          <span className="text-white font-medium">~10 Liters</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-300">Network Fee</span>
          <span className="text-white font-medium">~0.0001 ETH</span>
        </div>
        <hr className="border-gray-700 my-3" />
        <div className="flex items-center justify-between">
          <span className="text-gray-300 font-medium">Total Cost</span>
          <span className="text-white font-semibold">0.001 ETH</span>
        </div>
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={!isConnected || isLoading || pumps.length === 0}
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-medium text-white transition-all duration-200 transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            <span>Purchase & Activate</span>
          </>
        )}
      </button>

      {!isConnected && (
        <p className="text-center text-sm text-gray-400 mt-3">
          Connect your wallet to purchase water credits
        </p>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">
              Purchase successful! Pump activation in progress...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
