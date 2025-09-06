import React from 'react';
import { AlertTriangle, CheckCircle, Info, X, Bell, Clock } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const Alerts: React.FC = () => {
  return (
    <div className="space-y-6">

      {/* Active Alerts */}
      <Card className="mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#1E2A38]">Active Alerts</h3>
        </div>
        <div className="p-2 pt-6">
        <div className="space-y-4">
          {[
            {
              id: 1,
              type: 'critical',
              title: 'Cash Flow Alert',
              message: 'Cash flow projection shows potential shortage in 30 days',
              time: '2 hours ago',
              action: 'Review Forecast'
            },
            {
              id: 2,
              type: 'critical',
              title: 'Payment Overdue',
              message: 'Invoice #INV-2025-045 is 15 days overdue ($12,500)',
              time: '4 hours ago',
              action: 'Contact Client'
            },
            {
              id: 3,
              type: 'warning',
              title: 'Budget Variance',
              message: 'Marketing spend is 15% over budget for this month',
              time: '6 hours ago',
              action: 'Review Budget'
            },
            {
              id: 4,
              type: 'warning',
              title: 'Subscription Renewal',
              message: 'Software license expires in 7 days',
              time: '1 day ago',
              action: 'Renew License'
            },
            {
              id: 5,
              type: 'info',
              title: 'Monthly Report Ready',
              message: 'January financial report has been generated',
              time: '2 days ago',
              action: 'View Report'
            }
          ].map((alert) => (
            <div key={alert.id} className={`p-2 rounded-lg border-l-4 ${
              alert.type === 'critical' ? 'bg-[#F87171]/10 border-[#F87171]' :
              alert.type === 'warning' ? 'bg-[#F59E0B]/10 border-[#F59E0B]' :
              'bg-[#3AB7BF]/10 border-[#3AB7BF]'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  {alert.type === 'critical' ? (
                    <AlertTriangle className="w-3 h-3 text-[#F87171] mr-2 mt-0.5" />
                  ) : alert.type === 'warning' ? (
                    <Clock className="w-3 h-3 text-[#F59E0B] mr-2 mt-0.5" />
                  ) : (
                    <Info className="w-3 h-3 text-[#3AB7BF] mr-2 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-medium text-[#1E2A38] mb-0.5 text-xs">{alert.title}</h4>
                    <p className="text-gray-600 mb-0.5 text-xs">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm">{alert.action}</Button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4F46E5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </Card>

      {/* Alert Settings */}
      <Card title="Notification Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Alert Types</h3>
            <div className="space-y-3">
              {[
                { name: 'Cash Flow Warnings', enabled: true },
                { name: 'Budget Overruns', enabled: true },
                { name: 'Payment Reminders', enabled: true },
                { name: 'Tax Deadlines', enabled: true },
                { name: 'System Updates', enabled: false }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{setting.name}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4F46E5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Delivery Methods</h3>
            <div className="space-y-3">
              {[
                { name: 'Email Notifications', enabled: true },
                { name: 'SMS Alerts', enabled: false },
                { name: 'In-App Notifications', enabled: true },
                { name: 'Slack Integration', enabled: false },
                { name: 'Weekly Summary', enabled: true }
              ].map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{method.name}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={method.enabled} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4F46E5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Alerts;