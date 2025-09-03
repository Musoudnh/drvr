import React from 'react';
import { Shield, Key, Lock, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const Security: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Score</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">92/100</p>
              <p className="text-sm text-[#4ADE80] mt-1">Excellent</p>
            </div>
            <Shield className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">24</p>
              <p className="text-sm text-gray-600 mt-1">Across all users</p>
            </div>
            <Key className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Logins</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">3</p>
              <p className="text-sm text-gray-600 mt-1">Last 24 hours</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>
      </div>

      {/* Security Settings */}
      <Card title="Security Settings">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-[#4ADE80] mr-3" />
              <div>
                <p className="font-medium text-[#1E2A38]">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Enhanced security for all admin accounts</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-[#4ADE80] mr-3" />
              <div>
                <p className="font-medium text-[#1E2A38]">SSL Certificate</p>
                <p className="text-sm text-gray-600">Valid until March 2026</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Renew</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
              <div>
                <p className="font-medium text-[#1E2A38]">Password Policy</p>
                <p className="text-sm text-gray-600">Requires review and updates</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Review</Button>
          </div>
        </div>
      </Card>

      {/* SOX Compliance */}
      <Card title="SOX Compliance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Compliance Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Data Retention Policy</span>
                <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Access Controls</span>
                <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Audit Trail</span>
                <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Financial Controls</span>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Recent Activities</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-700">Quarterly Review Completed</p>
                <p className="text-gray-500">2 days ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-700">Access Permissions Updated</p>
                <p className="text-gray-500">1 week ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-700">Security Audit Passed</p>
                <p className="text-gray-500">2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Security;