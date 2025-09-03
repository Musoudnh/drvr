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
  const [billingAlerts, setBillingAlerts] = useState<BillingAlert[]>([
    {
      id: '1',
      type: 'usage_limit',
      message: 'You\'re approaching your API call limit (8,450/10,000)',
      severity: 'medium',
      createdAt: new Date(Date.now() - 3600000),
      isRead: false
    },
    {
      id: '2',
      type: 'plan_upgrade',
      message: 'Consider upgrading to Enterprise for unlimited team members',
      severity: 'low',
      createdAt: new Date(Date.now() - 86400000),
      isRead: false
    }
  ]);
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [usageAlerts, setUsageAlerts] = useState(true);

  const handleMarkAlertRead = (alertId: string) => {
    setBillingAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
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

      {/* Billing Alerts */}
      {billingAlerts.filter(a => !a.isRead).length > 0 && (
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#1E2A38] flex items-center">
                <Bell className="w-4 h-4 mr-2 text-[#F59E0B]" />
                Billing Alerts
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAlertsModal(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
            
            {billingAlerts.filter(a => !a.isRead).map(alert => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.createdAt.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleMarkAlertRead(alert.id)}
                    className="p-1 hover:bg-gray-100 rounded ml-2"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Current Plan */}
      <Card title="Current Plan">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#1E2A38]">Professional Plan</h3>
              <p className="text-gray-600">$79/month • Billed monthly</p>
              <p className="text-sm text-gray-500 mt-1">Next billing date: February 15, 2025</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Change Plan</Button>
              <Button variant="danger">Cancel Subscription</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#4ADE80]/10 rounded-lg text-center">
              <Users className="w-6 h-6 text-[#4ADE80] mx-auto mb-2" />
              <p className="font-bold text-[#4ADE80]">12 / 25</p>
              <p className="text-sm text-gray-600">Team Members</p>
            </div>
            <div className="p-4 bg-[#3AB7BF]/10 rounded-lg text-center">
              <Zap className="w-6 h-6 text-[#3AB7BF] mx-auto mb-2" />
              <p className="font-bold text-[#3AB7BF]">8,450 / 10,000</p>
              <p className="text-sm text-gray-600">API Calls</p>
            </div>
            <div className="p-4 bg-[#F59E0B]/10 rounded-lg text-center">
              <BarChart3 className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
              <p className="font-bold text-[#F59E0B]">2.4 / 5 GB</p>
              <p className="text-sm text-gray-600">Storage</p>
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

      {/* Enhanced Usage & Limits */}
      <Card title="Usage & Limits">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1E2A38]">Current Usage</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowUsageModal(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Detailed Usage
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Team Members</span>
              <span className="text-sm text-gray-600">12 / 25</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-[#3AB7BF] h-3 rounded-full transition-all duration-300" style={{ width: '48%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>48% used</span>
              <span>13 remaining</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">API Calls (Monthly)</span>
              <span className="text-sm text-gray-600">8,450 / 10,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-[#F59E0B] h-3 rounded-full transition-all duration-300" style={{ width: '84.5%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>84.5% used</span>
              <span>1,550 remaining</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Storage</span>
              <span className="text-sm text-gray-600">2.4 GB / 5 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-[#4ADE80] h-3 rounded-full transition-all duration-300" style={{ width: '48%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>48% used</span>
              <span>2.6 GB remaining</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#F59E0B]/10 rounded-lg">
            <div>
              <p className="font-medium text-[#1E2A38]">Usage Alerts</p>
              <p className="text-sm text-gray-600">Get notified when approaching limits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={usageAlerts}
                onChange={() => setUsageAlerts(!usageAlerts)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F59E0B]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B]"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Security & Compliance */}
      <Card title="Security & Compliance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Payment Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-[#4ADE80] mr-2" />
                  <span className="text-sm text-gray-700">PCI DSS Compliant</span>
                </div>
                <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 text-[#4ADE80] mr-2" />
                  <span className="text-sm text-gray-700">256-bit SSL Encryption</span>
                </div>
                <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 text-[#4ADE80] mr-2" />
                  <span className="text-sm text-gray-700">Tokenized Card Storage</span>
                </div>
                <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Billing Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email Receipts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Payment Reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Usage Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={usageAlerts}
                    onChange={() => setUsageAlerts(!usageAlerts)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Automated Payouts */}
      <Card title="Automated Payouts">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#1E2A38]">Referral Earnings</h3>
              <p className="text-sm text-gray-600">Automatic payouts when earnings reach threshold</p>
            </div>
            <Button variant="outline" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Setup Payout Method
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#4ADE80]/10 rounded-lg text-center">
              <p className="text-lg font-bold text-[#4ADE80]">$40</p>
              <p className="text-sm text-gray-600">Current Balance</p>
            </div>
            <div className="p-4 bg-[#3AB7BF]/10 rounded-lg text-center">
              <p className="text-lg font-bold text-[#3AB7BF]">$50</p>
              <p className="text-sm text-gray-600">Payout Threshold</p>
            </div>
            <div className="p-4 bg-[#F59E0B]/10 rounded-lg text-center">
              <p className="text-lg font-bold text-[#F59E0B]">$185</p>
              <p className="text-sm text-gray-600">Total Earned</p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-[#1E2A38] mb-2">Payout History</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">December 2024</span>
                <span className="font-medium text-[#4ADE80]">$75.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">November 2024</span>
                <span className="font-medium text-[#4ADE80]">$70.00</span>
              </div>
            </div>
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

      {/* Billing History */}
      <Card title="Enhanced Billing History">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Complete billing history with detailed breakdowns</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Filter by Date
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                date: 'Jan 15, 2025', 
                amount: '$79.00', 
                status: 'paid', 
                invoice: 'INV-2025-001',
                breakdown: { subscription: 79, tax: 0, credits: 0 },
                paymentMethod: '**** 4532'
              },
              { 
                date: 'Dec 15, 2024', 
                amount: '$74.00', 
                status: 'paid', 
                invoice: 'INV-2024-012',
                breakdown: { subscription: 79, tax: 0, credits: -5 },
                paymentMethod: '**** 4532'
              },
              { 
                date: 'Nov 15, 2024', 
                amount: '$79.00', 
                status: 'paid', 
                invoice: 'INV-2024-011',
                breakdown: { subscription: 79, tax: 0, credits: 0 },
                paymentMethod: '**** 4532'
              }
            ].map((bill, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-[#3AB7BF] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-[#1E2A38]">{bill.date}</p>
                      <p className="text-sm text-gray-600">{bill.invoice} • {bill.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-bold text-[#1E2A38]">{bill.amount}</span>
                      <div className="text-xs text-gray-500">
                        Sub: ${bill.breakdown.subscription}
                        {bill.breakdown.credits !== 0 && ` | Credits: ${bill.breakdown.credits > 0 ? '+' : ''}$${bill.breakdown.credits}`}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">
                      {bill.status}
                    </span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Legacy Usage & Limits - keeping for compatibility */}
      <Card title="Legacy Usage Tracking">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Team Members</span>
              <span className="text-sm text-gray-600">12 / 25</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#3AB7BF] h-2 rounded-full" style={{ width: '48%' }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">API Calls</span>
              <span className="text-sm text-gray-600">8,450 / 10,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#4ADE80] h-2 rounded-full" style={{ width: '84.5%' }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Storage</span>
              <span className="text-sm text-gray-600">2.4 GB / 5 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '48%' }} />
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default BillingSettings;