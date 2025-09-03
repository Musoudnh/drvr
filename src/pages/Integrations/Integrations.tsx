import React from 'react';
import { Zap, CheckCircle, Plus, Settings } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const Integrations: React.FC = () => {
  const integrations = [
    { name: 'QuickBooks', description: 'Sync your accounting data automatically', status: 'connected', icon: '📊' },
    { name: 'Stripe', description: 'Payment processing and revenue tracking', status: 'connected', icon: '💳' },
    { name: 'Slack', description: 'Get notifications in your workspace', status: 'available', icon: '💬' },
    { name: 'Salesforce', description: 'CRM data integration', status: 'available', icon: '🏢' },
    { name: 'HubSpot', description: 'Marketing and sales automation', status: 'available', icon: '🚀' },
    { name: 'Zapier', description: 'Connect with 1000+ other apps', status: 'available', icon: '⚡' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E2A38]">Integrations</h2>
        <p className="text-gray-600 mt-1">Connect your favorite tools and automate workflows</p>
      </div>

      {/* Connected Integrations */}
      <Card title="Connected Integrations">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.filter(integration => integration.status === 'connected').map((integration, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-[#4ADE80]/30 bg-[#4ADE80]/5 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{integration.icon}</span>
                <div>
                  <h3 className="font-semibold text-[#1E2A38]">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
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
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{integration.icon}</span>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Connect
                </Button>
              </div>
              <h3 className="font-semibold text-[#1E2A38] mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-600">{integration.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Integration Benefits */}
      <Card title="Why Connect?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#3AB7BF]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-[#3AB7BF]" />
            </div>
            <h3 className="font-semibold text-[#1E2A38] mb-2">Automation</h3>
            <p className="text-sm text-gray-600">Reduce manual data entry and eliminate errors with automated syncing</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-[#4ADE80]" />
            </div>
            <h3 className="font-semibold text-[#1E2A38] mb-2">Accuracy</h3>
            <p className="text-sm text-gray-600">Keep your financial data accurate and up-to-date across all platforms</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#F87171]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-[#F87171]" />
            </div>
            <h3 className="font-semibold text-[#1E2A38] mb-2">Efficiency</h3>
            <p className="text-sm text-gray-600">Save time and focus on growing your business instead of managing data</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Integrations;