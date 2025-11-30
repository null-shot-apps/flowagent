'use client';

import React, { useState, useEffect } from 'react';

interface Pump {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  waterLevel: number;
  lastDispensed: string;
  totalDispensed: number;
  coordinates: string;
}

const PumpDashboard: React.FC = () => {
  const [pumps, setPumps] = useState<Pump[]>([
    {
      id: 1,
      name: 'Rural Kenya',
      location: 'Nairobi Region',
      status: 'active',
      waterLevel: 85,
      lastDispensed: '2 minutes ago',
      totalDispensed: 4250,
      coordinates: '1.2921°S, 36.8219°E'
    },
    {
      id: 2,
      name: 'Ghana Village',
      location: 'Ashanti Region',
      status: 'active',
      waterLevel: 92,
      lastDispensed: '5 minutes ago',
      totalDispensed: 3890,
      coordinates: '6.6885°N, 1.6244°W'
    },
    {
      id: 3,
      name: 'Tanzania Well',
      location: 'Dodoma Region',
      status: 'maintenance',
      waterLevel: 45,
      lastDispensed: '2 hours ago',
      totalDispensed: 4707,
      coordinates: '6.1630°S, 35.7516°E'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPumps(prev => prev.map(pump => ({
        ...pump,
        waterLevel: pump.status === 'active' 
          ? Math.max(20, pump.waterLevel - Math.random() * 2)
          : pump.waterLevel,
        totalDispensed: pump.status === 'active'
          ? pump.totalDispensed + Math.floor(Math.random() * 3)
          : pump.totalDispensed
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'maintenance': return 'text-yellow-400 bg-yellow-400/10';
      case 'inactive': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getWaterLevelColor = (level: number) => {
    if (level > 70) return 'from-blue-500 to-cyan-500';
    if (level > 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            🏭
          </span>
          Pump Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pumps.map((pump) => (
          <div key={pump.id} className="bg-slate-800/50 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{pump.name}</h3>
                <p className="text-sm text-gray-400">{pump.location}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pump.status)}`}>
                {pump.status}
              </span>
            </div>

            {/* Water Level */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Water Level</span>
                <span className="text-sm font-medium text-white">{pump.waterLevel.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full bg-gradient-to-r ${getWaterLevelColor(pump.waterLevel)} transition-all duration-500`}
                  style={{ width: `${pump.waterLevel}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Total Dispensed</span>
                <span className="text-sm font-medium text-white">{pump.totalDispensed.toLocaleString()}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Last Activity</span>
                <span className="text-sm font-medium text-white">{pump.lastDispensed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Coordinates</span>
                <span className="text-xs font-mono text-gray-300">{pump.coordinates}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <button 
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm py-2 px-3 rounded transition-colors"
                  disabled={pump.status !== 'active'}
                >
                  Send SMS
                </button>
                <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white text-sm py-2 px-3 rounded transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SMS Command Preview */}
      <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <span className="mr-2">📱</span>
          Latest SMS Commands
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
            <span className="text-sm text-gray-300">Pump #1 → Dispense 10L</span>
            <span className="text-xs text-gray-500">2 min ago</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
            <span className="text-sm text-gray-300">Pump #2 → Status Check</span>
            <span className="text-xs text-gray-500">5 min ago</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
            <span className="text-sm text-gray-300">Pump #1 → Dispense 5L</span>
            <span className="text-xs text-gray-500">8 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PumpDashboard;
