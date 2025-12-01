'use client';

import React, { useState, useEffect } from 'react';

interface StatusData {
  totalDispensed: number;
  activePumps: number;
  pendingRequests: number;
  totalRevenue: number;
}

const StatusCards: React.FC = () => {
  const [stats, setStats] = useState<StatusData>({
    totalDispensed: 12847,
    activePumps: 2,
    pendingRequests: 3,
    totalRevenue: 0.156
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalDispensed: prev.totalDispensed + Math.floor(Math.random() * 5),
        pendingRequests: Math.max(0, prev.pendingRequests + (Math.random() > 0.7 ? 1 : -1)),
        totalRevenue: prev.totalRevenue + (Math.random() * 0.001)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: 'Total Dispensed',
      value: `${stats.totalDispensed.toLocaleString()}L`,
      icon: '💧',
      color: 'from-blue-500 to-cyan-500',
      change: '+2.3%',
      changeType: 'positive' as const
    },
    {
      title: 'Active Pumps',
      value: stats.activePumps.toString(),
      icon: '⚡',
      color: 'from-green-500 to-emerald-500',
      change: 'Online',
      changeType: 'positive' as const
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests.toString(),
      icon: '⏳',
      color: 'from-yellow-500 to-orange-500',
      change: 'Processing',
      changeType: 'neutral' as const
    },
    {
      title: 'Total Revenue',
      value: `${stats.totalRevenue.toFixed(4)} ETH`,
      icon: '💰',
      color: 'from-purple-500 to-pink-500',
      change: '+5.7%',
      changeType: 'positive' as const
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
      
      {cards.map((card, index) => (
        <div key={index} className="glass rounded-xl p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center text-xl`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-sm px-2 py-1 rounded-full ${
                card.changeType === 'positive' 
                  ? 'text-green-400 bg-green-400/10' 
                  : 'text-yellow-400 bg-yellow-400/10'
              }`}>
                {card.change}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* AI Agent Status */}
      <div className="glass rounded-xl p-4 card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🤖</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">AI Agent</p>
              <p className="text-lg font-bold text-white">Active</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Monitoring</span>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-400">
          Last SMS command: 2 minutes ago
        </div>
      </div>
    </div>
  );
};

export default StatusCards;
