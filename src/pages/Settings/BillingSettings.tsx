import React, { useState } from 'react';
import { CreditCard, Download, Calendar, AlertCircle, Zap, Shield, Users, BarChart3, Bell, Settings, Eye, RefreshCw, Lock, CheckCircle, X, Plus } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isValid: boolean;
}

interface BillingAlert {
  id: string;
  type: 'payment_failed' | 'usage_limit' | 'plan_upgrade' | 'renewal_reminder';
  message: string;
  severity: 'high' | 'medium' | 'low';
  createdAt: Date;
  isRead: boolean;
}

const BillingSettings: React.FC = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'card', last4: '4532', expiryMonth: 12, expiryYear: 2027, isDefault: true, isValid: true },
    { id: '2', type: 'bank', last4: '7890', isDefault: false, isValid: true }
  ]);
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);

  const handleMarkAlertRead = (alertId: string) => {
    // Alert handling logic can be added here if needed
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-[#F87171]/20 text-[#F87171] border-[#F87171]';
      case 'medium': return 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]';
      case 'low': return 'bg-[#3AB7BF]/20 text-[#3AB7BF] border-[#3AB7BF]';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E2A38]">Subscription & Billing</h2>
        <p className="text-gray-600 mt-1">Manage your plan, billing, and usage with automated alerts</p>
      </div>


      {/* Current Plan */}
      <Card title="Current Plan">
        <div className="space-y-4">
          {/* Plan Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-8 bg-[#1E2A38] rounded flex items-center justify-center mr-4">
                <span className="text-white font-medium text-sm">P</span>
              </div>
              <div>
                <h3 className="font-medium text-[#1E2A38]">Professional Plan</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#1E2A38]">$79</span>
                  <span className="text-sm text-gray-600">per month</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Change Plan</Button>
              <Button variant="danger" size="sm">Cancel</Button>
            </div>
          </div>
          
          {/* Next Billing */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-[#1E2A38]">Next Billing Date</p>
                <p className="text-sm text-gray-600">February 15, 2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#1E2A38]">$79.00</p>
              <p className="text-xs text-gray-500">Auto-renewal</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Payment Methods */}
      <Card title="Payment Methods">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Manage your payment methods and autopay settings</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPaymentModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
          
          {paymentMethods.map(method => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-8 bg-[#1E2A38] rounded flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1E2A38]">
                    {method.type === 'card' ? `**** **** **** ${method.last4}` : `Bank ****${method.last4}`}
                  </p>
                  <div className="flex items-center gap-2">
                    {method.expiryMonth && method.expiryYear && (
                      <span className="text-sm text-gray-600">Expires {method.expiryMonth}/{method.expiryYear}</span>
                    )}
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">Default</span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      method.isValid ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-[#F87171]/20 text-[#F87171]'
                    }`}>
                      {method.isValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                {!method.isDefault && (
                  <Button variant="outline" size="sm">Set Default</Button>
                )}
              </div>
            </div>
          ))}
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-[#1E2A38]">Automatic Payments</p>
              <p className="text-sm text-gray-600">Automatically charge your default payment method</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={autoPayEnabled}
                onChange={() => setAutoPayEnabled(!autoPayEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Usage Details Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Detailed Usage Analytics</h3>
              <button
                onClick={() => setShowUsageModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-4">API Usage by Feature</h4>
                <div className="space-y-3">
                  {[
                    { feature: 'Financial Reports', calls: 3250, percentage: 38.5 },
                    { feature: 'Forecasting Models', calls: 2180, percentage: 25.8 },
                    { feature: 'Data Integrations', calls: 1820, percentage: 21.5 },
                    { feature: 'Analytics Engine', calls: 1200, percentage: 14.2 }
                  ].map((usage, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{usage.feature}</span>
                          <span className="text-sm text-gray-600">{usage.calls.toLocaleString()} calls</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#3AB7BF] h-2 rounded-full" 
                            style={{ width: `${usage.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-4">Usage Trends (Last 30 Days)</h4>
                <div className="relative h-32">
                  <svg className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#3AB7BF"
                      strokeWidth="2"
                      points="30,100 90,95 150,85 210,90 270,80 330,75 390,85 450,80"
                    />
                    {[100, 95, 85, 90, 80, 75, 85, 80].map((y, index) => (
                      <circle key={index} cx={30 + index * 60} cy={y} r="3" fill="#3AB7BF" />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Usage Data
              </Button>
              <button
                onClick={() => setShowUsageModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Card title="Integrations">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Manage your connected services and data sync</p>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-8 bg-[#1E2A38] rounded flex items-center justify-center mr-4">
                <span className="text-white font-medium text-sm">QB</span>
              </div>
              <div>
                <p className="font-medium text-[#1E2A38]">QuickBooks Online</p>
                <p className="text-sm text-gray-600">Last sync: 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">Connected</span>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-8 bg-[#1E2A38] rounded flex items-center justify-center mr-4">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#1E2A38]">Stripe</p>
                <p className="text-sm text-gray-600">Last transaction: 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">Connected</span>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-[#1E2A38]">Available Integrations</p>
              <p className="text-sm text-gray-600">Connect Xero, Slack, Zapier and more</p>
            </div>
            <Button variant="outline" size="sm">Browse All</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BillingSettings;