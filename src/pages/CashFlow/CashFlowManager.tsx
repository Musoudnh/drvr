import React, { useState } from 'react';
import { Layers, Grid3x3, List } from 'lucide-react';
import ReceivablesPayablesTimeline from '../../components/Dashboard/ReceivablesPayablesTimeline';
import OverdueSummary from '../../components/Dashboard/OverdueSummary';
import CashConversionMetrics from '../../components/Dashboard/CashConversionMetrics';
import TopCustomersVendors from '../../components/Dashboard/TopCustomersVendors';
import AlertsAutomationPanel from '../../components/Dashboard/AlertsAutomationPanel';

type ViewMode = 'dashboard' | 'timeline' | 'overdue' | 'metrics' | 'rankings' | 'alerts';

const CashFlowManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cash Flow Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive view of receivables, payables, and cash conversion metrics
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            Dashboard View
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'timeline'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Timeline
          </button>
          <button
            onClick={() => setViewMode('overdue')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'overdue'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List className="w-4 h-4" />
            Overdue Items
          </button>
          <button
            onClick={() => setViewMode('metrics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'metrics'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setViewMode('rankings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'rankings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Top 10
          </button>
          <button
            onClick={() => setViewMode('alerts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'alerts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Alerts
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'dashboard' ? (
          <div className="space-y-6">
            <ReceivablesPayablesTimeline />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OverdueSummary />
              <CashConversionMetrics />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopCustomersVendors />
              <AlertsAutomationPanel />
            </div>
          </div>
        ) : viewMode === 'timeline' ? (
          <ReceivablesPayablesTimeline />
        ) : viewMode === 'overdue' ? (
          <OverdueSummary />
        ) : viewMode === 'metrics' ? (
          <CashConversionMetrics />
        ) : viewMode === 'rankings' ? (
          <TopCustomersVendors />
        ) : (
          <AlertsAutomationPanel />
        )}
      </div>
    </div>
  );
};

export default CashFlowManager;
