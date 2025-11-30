'use client';

import React from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Droplets, Activity, Clock, TrendingUp } from 'lucide-react';

export default function StatusCards() {
  const { totalDispensed, activePumps, pendingRequests, pumps } = useWeb3();

  const cards = [
    {
      title: 'Total Water Dispensed',
      value: `${totalDispensed.toLocaleString()}L`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Droplets,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'Active Pumps',
      value: `${activePumps}/${pumps.length}`,
      change: `${activePumps} online`,
      changeType: activePumps > 0 ? 'positive' as const : 'neutral' as const,
      icon: Activity,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
      title: 'Pending Requests',
      value: pendingRequests.toString(),
      change: 'Last 5 min',
      changeType: 'neutral' as const,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      title: 'System Efficiency',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${card.bgGradient}`}>
                <Icon className={`h-6 w-6 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                card.changeType === 'positive' 
                  ? 'bg-green-500/20 text-green-400' 
                  : card.changeType === 'negative'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {card.change}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white">{card.value}</h3>
              <p className="text-sm text-gray-400">{card.title}</p>
            </div>

            {/* Animated progress bar for visual appeal */}
            <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 ease-out`}
                style={{ 
                  width: index === 0 ? '75%' : index === 1 ? `${(activePumps / pumps.length) * 100}%` : index === 2 ? '30%' : '94%',
                  animationDelay: `${index * 200}ms`
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
