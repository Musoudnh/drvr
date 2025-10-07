import React, { useState } from 'react';
import { Database, Zap, CheckCircle, AlertTriangle, Clock, Settings, Plus, RefreshCw, Eye, X, Key, Shield } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface Integration {
  id: string;
  name: string;
  type: 'erp' | 'crm' | 'accounting' | 'banking' | 'payroll';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: Date;
  recordsCount: number;
  apiEndpoint: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  dataMapping: { [key: string]: string };
}

const DataIntegration: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'SAP ERP',
      type: 'erp',
      status: 'connected',
      lastSync: new Date(Date.now() - 300000),
      recordsCount: 15420,
      apiEndpoint: 'https://api.sap.com/v1/financials',
      syncFrequency: 'hourly',
      dataMapping: {
        'revenue': 'total_sales',
        'expenses': 'operating_costs',
        'accounts_receivable': 'ar_balance'
      }
    },
    {
      id: '2',
      name: 'Salesforce CRM',
      type: 'crm',
      status: 'connected',
      lastSync: new Date(Date.now() - 900000),
      recordsCount: 8750,
      apiEndpoint: 'https://api.salesforce.com/v1/opportunities',
      syncFrequency: 'daily',
      dataMapping: {
        'pipeline': 'opportunity_amount',
        'customers': 'account_records'
      }
    },
    {
      id: '3',
      name: 'QuickBooks Online',
      type: 'accounting',
      status: 'syncing',
      lastSync: new Date(Date.now() - 1800000),
      recordsCount: 12340,
      apiEndpoint: 'https://api.quickbooks.com/v3/company',
      syncFrequency: 'realtime',
      dataMapping: {
        'transactions': 'journal_entries',
        'invoices': 'sales_receipts'
      }
    },
    {
      id: '4',
      name: 'Chase Bank API',
      type: 'banking',
      status: 'error',
      lastSync: new Date(Date.now() - 7200000),
      recordsCount: 0,
      apiEndpoint: 'https://api.chase.com/v1/accounts',
      syncFrequency: 'daily',
      dataMapping: {
        'transactions': 'bank_transactions',
        'balance': 'account_balance'
      }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'erp' as const,
    apiEndpoint: '',
    apiKey: '',
    syncFrequency: 'daily' as const
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-[#4ADE80]/20 text-[#4ADE80]';
      case 'syncing': return 'bg-[#3AB7BF]/20 text-[#3AB7BF]';
      case 'error': return 'bg-[#F87171]/20 text-[#F87171]';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'syncing': return RefreshCw;
      case 'error': return AlertTriangle;
      default: return Clock;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'erp': return Database;
      case 'crm': return Users;
      case 'accounting': return Calculator;
      case 'banking': return DollarSign;
      case 'payroll': return Users;
      default: return Database;
    }
  };

  const handleSync = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: 'syncing' as const, lastSync: new Date() }
        : integration
    ));

    // Simulate sync completion
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, status: 'connected' as const, recordsCount: integration.recordsCount + Math.floor(Math.random() * 100) }
          : integration
      ));
    }, 3000);
  };

  const handleAddIntegration = () => {
    const integration: Integration = {
      id: Date.now().toString(),
      name: newIntegration.name,
      type: newIntegration.type,
      status: 'disconnected',
      lastSync: new Date(),
      recordsCount: 0,
      apiEndpoint: newIntegration.apiEndpoint,
      syncFrequency: newIntegration.syncFrequency,
      dataMapping: {}
    };

    setIntegrations(prev => [...prev, integration]);
    setNewIntegration({
      name: '',
      type: 'erp',
      apiEndpoint: '',
      apiKey: '',
      syncFrequency: 'daily'
    });
    setShowAddModal(false);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#101010]">Data Integration</h2>
          <p className="text-gray-600 mt-1">Connect and sync data from external systems</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="bg-[#3AB7BF] hover:bg-[#2A9BA3] focus:ring-[#3AB7BF]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Integration Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Active Integrations</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">{integrations.filter(i => i.status === 'connected').length}</p>
              <p className="text-xs text-gray-600 mt-1">Connected systems</p>
            </div>
            <CheckCircle className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">{integrations.reduce((sum, i) => sum + i.recordsCount, 0).toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">Synced data points</p>
            </div>
            <Database className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Sync Status</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">{integrations.filter(i => i.status === 'syncing').length}</p>
              <p className="text-xs text-gray-600 mt-1">Currently syncing</p>
            </div>
            <RefreshCw className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">{integrations.filter(i => i.status === 'error').length}</p>
              <p className="text-xs text-gray-600 mt-1">Need attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>
      </div>

      {/* Integration List */}
      <Card title="Connected Systems">
        <div className="space-y-4">
          {integrations.map(integration => {
            const StatusIcon = getStatusIcon(integration.status);
            const TypeIcon = getTypeIcon(integration.type);
            
            return (
              <div key={integration.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#3AB7BF] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#3AB7BF]/10 rounded-lg flex items-center justify-center mr-4">
                      <TypeIcon className="w-5 h-5 text-[#3AB7BF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#101010]">{integration.name}</h3>
                      <p className="text-xs text-gray-600">{integration.type.toUpperCase()} • {integration.recordsCount.toLocaleString()} records</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(integration.status)}`}>
                      <StatusIcon className={`w-3 h-3 mr-1 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                    </span>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSync(integration.id)}
                        disabled={integration.status === 'syncing'}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Sync now"
                      >
                        <RefreshCw className={`w-4 h-4 text-gray-400 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedIntegration(integration);
                          setShowMappingModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Configure mapping"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last sync: {formatTimeAgo(integration.lastSync)}</span>
                  <span>Frequency: {integration.syncFrequency}</span>
                </div>
                
                {integration.status === 'error' && (
                  <div className="mt-3 p-3 bg-[#F87171]/10 rounded-lg">
                    <p className="text-xs text-[#F87171]">Connection failed. Please check API credentials and try again.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Data Mapping */}
      <Card title="Data Mapping Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#101010] mb-4">Field Mapping</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700">Revenue</span>
                  <span className="text-xs text-[#3AB7BF]">→ total_sales</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700">Expenses</span>
                  <span className="text-xs text-[#3AB7BF]">→ operating_costs</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700">Cash Flow</span>
                  <span className="text-xs text-[#3AB7BF]">→ cash_movements</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#101010] mb-4">Sync Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Default Sync Frequency</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent">
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Auto-retry on failure</p>
                  <p className="text-xs text-gray-500">Automatically retry failed syncs</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Add Integration</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">System Name</label>
                <input
                  type="text"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="e.g., Oracle ERP"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">System Type</label>
                <select
                  value={newIntegration.type}
                  onChange={(e) => setNewIntegration({...newIntegration, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="erp">ERP System</option>
                  <option value="crm">CRM System</option>
                  <option value="accounting">Accounting Software</option>
                  <option value="banking">Banking API</option>
                  <option value="payroll">Payroll System</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">API Endpoint</label>
                <input
                  type="url"
                  value={newIntegration.apiEndpoint}
                  onChange={(e) => setNewIntegration({...newIntegration, apiEndpoint: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="https://api.example.com/v1"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={newIntegration.apiKey}
                  onChange={(e) => setNewIntegration({...newIntegration, apiKey: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="Enter API key"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIntegration}
                disabled={!newIntegration.name.trim() || !newIntegration.apiEndpoint.trim()}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Integration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Mapping Modal */}
      {showMappingModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Configure Data Mapping</h3>
              <button
                onClick={() => setShowMappingModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
                <h4 className="font-medium text-[#101010] mb-2">{selectedIntegration.name}</h4>
                <p className="text-xs text-gray-600">Map external system fields to FinanceFlow data points</p>
              </div>
              
              <div className="space-y-3">
                {Object.entries(selectedIntegration.dataMapping).map(([internal, external]) => (
                  <div key={internal} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-[#101010]">{internal}</span>
                    <span className="text-[#3AB7BF]">→</span>
                    <span className="text-gray-600">{external}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowMappingModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Save Mapping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataIntegration;