import React from 'react';
import { Zap, CheckCircle, Plus, Settings } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const Integrations: React.FC = () => {
  const integrations = [
    { name: 'QuickBooks', description: 'Sync your accounting data automatically', status: 'connected', icon: '📊' },
    { name: 'Stripe', description: 'Payment processing and revenue tracking', status: 'connected', icon: '💳' },
    { name: 'QuickBooks', description: 'Accounting software integration', status: 'available', icon: '📊' },
    { name: 'Sage', description: 'Business management software', status: 'available', icon: '📈' },
    { name: 'Slack', description: 'Team communication platform', status: 'available', icon: '💬' },
    { name: 'Shopify', description: 'E-commerce platform integration', status: 'available', icon: '🛒' },
    { name: 'Outlook Calendar', description: 'Calendar and scheduling sync', status: 'available', icon: '📅' },
    { name: 'Monday.com', description: 'Project management platform', status: 'available', icon: '📋' },
    { name: 'ClickUp', description: 'Task and project management', status: 'available', icon: '✅' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E2A38]">Integrations</h2>
        <p className="text-gray-600 mt-1">Connect your favorite tools and automate workflows</p>
      </div>

      {/* Connected Integrations */}
      <Card title="Connected Integrations">
        <div className="space-y-4">
          {integrations.filter(integration => integration.status === 'connected').map((integration, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-8 bg-[#1E2A38] rounded flex items-center justify-center mr-4">
                  <span className="text-white font-medium text-sm">
                    {integration.name === 'QuickBooks' ? 'QB' : integration.name.substring(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#1E2A38]">{integration.name}</p>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">Connected</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Available Integrations */}
      <Card title="Available Integrations">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.filter(integration => integration.status === 'available').map((integration, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-[#3AB7BF] hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-8 bg-[#1E2A38] rounded flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {integration.name === 'QuickBooks' ? 'QB' : 
                     integration.name === 'Outlook Calendar' ? 'OC' :
                     integration.name === 'Monday.com' ? 'MD' :
                     integration.name === 'ClickUp' ? 'CU' :
                     integration.name.substring(0, 2)}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              </div>
              <h3 className="font-medium text-[#1E2A38] mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-600">{integration.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Integrations;