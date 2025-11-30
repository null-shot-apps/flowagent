'use client';

import React from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { MapPin, Droplets, Clock, Activity, Zap, AlertCircle } from 'lucide-react';

export default function PumpDashboard() {
  const { pumps } = useWeb3();

  const formatLastActivation = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getStatusColor = (active: boolean, lastActivation: number) => {
    if (!active) return 'text-gray-400';
    
    const timeSinceActivation = Date.now() - lastActivation;
    const minutes = timeSinceActivation / 60000;
    
    if (minutes < 5) return 'text-green-400';
    if (minutes < 30) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getStatusText = (active: boolean, lastActivation: number) => {
    if (!active) return 'Idle';
    
    const timeSinceActivation = Date.now() - lastActivation;
    const minutes = timeSinceActivation / 60000;
    
    if (minutes < 5) return 'Active';
    if (minutes < 30) return 'Recently Active';
    return 'Standby';
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
            <Activity className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Pump Network Status</h2>
            <p className="text-sm text-gray-400">Real-time monitoring across all locations</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">Live</span>
        </div>
      </div>

      {pumps.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">No pumps connected</h3>
          <p className="text-sm text-gray-500">Waiting for pump network initialization...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pumps.map((pump) => (
            <div
              key={pump.id}
              className="p-5 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{pump.location}</h3>
                    <p className="text-sm text-gray-400">Pump ID: {pump.id}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  pump.active 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    pump.active ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span>{getStatusText(pump.active, pump.lastActivation)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Dispensed */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Total Dispensed</span>
                  </div>
                  <div className="text-xl font-bold text-white">{pump.totalDispensed}L</div>
                  <div className="text-xs text-gray-500 mt-1">Lifetime volume</div>
                </div>

                {/* Last Activation */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">Last Active</span>
                  </div>
                  <div className={`text-xl font-bold ${getStatusColor(pump.active, pump.lastActivation)}`}>
                    {formatLastActivation(pump.lastActivation)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Last dispensing</div>
                </div>

                {/* Status Indicator */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-gray-400">System Status</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {pump.active ? '100%' : '0%'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Operational</div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Recent Activity</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-500">Active</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-xs text-gray-500">Standby</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-500">Idle</span>
                    </div>
                  </div>
                </div>
                
                {/* Activity Bar */}
                <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div className="bg-green-400 flex-1"></div>
                    <div className="bg-yellow-400 w-1/4"></div>
                    <div className="bg-gray-600 w-1/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
