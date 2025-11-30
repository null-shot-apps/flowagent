'use client';

import { Web3Provider } from '../components/Web3Provider';
import Header from '../components/Header';
import PurchasePanel from '../components/PurchasePanel';
import StatusCards from '../components/StatusCards';
import PumpDashboard from '../components/PumpDashboard';
import TransactionLog from '../components/TransactionLog';

export default function Home() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                FlowAgent
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              AI-Powered Water Distribution System on Base L2
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              <PurchasePanel />
              <StatusCards />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              <PumpDashboard />
              <TransactionLog />
            </div>
          </div>
        </main>
      </div>
    </Web3Provider>
  );
}

