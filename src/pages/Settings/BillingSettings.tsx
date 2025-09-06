import React from 'react';
import { CreditCard, Download, Calendar, AlertCircle } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const BillingSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E2A38]">Subscription</h2>
        <p className="text-gray-600 mt-1">Manage your plan and billing information</p>
      </div>

      {/* Current Plan */}
      <Card title="Current Plan">
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
      </Card>

      {/* Payment Method */}
      <Card title="Payment Method">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-8 bg-[#1E2A38] rounded flex items-center justify-center mr-4">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-[#1E2A38]">**** **** **** 4532</p>
              <p className="text-sm text-gray-600">Expires 12/27</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Update</Button>
        </div>
      </Card>

      {/* Usage & Limits */}
      <Card title="Usage & Limits">
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

      {/* Billing History */}
      <Card title="Billing History">
        <div className="space-y-4">
          {[
            { date: 'Jan 15, 2025', amount: '$79.00', status: 'paid', invoice: 'INV-2025-001' },
            { date: 'Dec 15, 2024', amount: '$79.00', status: 'paid', invoice: 'INV-2024-012' },
            { date: 'Nov 15, 2024', amount: '$79.00', status: 'paid', invoice: 'INV-2024-011' },
            { date: 'Oct 15, 2024', amount: '$79.00', status: 'paid', invoice: 'INV-2024-010' }
          ].map((bill, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-[#1E2A38]">{bill.date}</p>
                  <p className="text-sm text-gray-600">{bill.invoice}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#1E2A38]">{bill.amount}</span>
                <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">
                  {bill.status}
                </span>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default BillingSettings;