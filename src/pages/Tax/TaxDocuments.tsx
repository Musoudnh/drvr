import React, { useState } from 'react';
import { FileText, Download, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const TaxDocuments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E2A38]">Tax Documents</h2>
        <p className="text-gray-600 mt-1">Tax forms, documents, and compliance tools</p>
      </div>

      {/* Tax Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">2024 Tax Status</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">Filed</p>
              <p className="text-sm text-[#4ADE80] mt-1">On time</p>
            </div>
            <CheckCircle className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">2025 Estimated</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">$89,450</p>
              <p className="text-sm text-gray-600 mt-1">Tax liability</p>
            </div>
            <Calendar className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quarterly Due</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">Mar 15</p>
              <p className="text-sm text-gray-600 mt-1">Next payment</p>
            </div>
            <Clock className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deductions</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">$24,680</p>
              <p className="text-sm text-gray-600 mt-1">YTD savings</p>
            </div>
            <FileText className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>
      </div>

      {/* Tax Documents */}
      <Card title="Tax Documents & Forms">
        <div className="space-y-4">
          {[
            { name: '2024 Form 1120 - Corporate Tax Return', status: 'completed', date: 'Filed: Mar 15, 2024', type: 'annual' },
            { name: '2024 Q4 Form 941 - Payroll Tax', status: 'completed', date: 'Filed: Jan 31, 2025', type: 'quarterly' },
            { name: '2025 Q1 Estimated Tax Payment', status: 'pending', date: 'Due: Mar 15, 2025', type: 'quarterly' },
            { name: '2024 Form W-2 - Employee Wages', status: 'completed', date: 'Issued: Jan 31, 2025', type: 'annual' },
            { name: '2024 Form 1099-MISC - Contractor Payments', status: 'completed', date: 'Issued: Jan 31, 2025', type: 'annual' }
          ].map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-[#1E2A38]">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'completed' 
                    ? 'bg-[#4ADE80]/20 text-[#4ADE80]'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {doc.status}
                </span>
                {doc.status === 'completed' && (
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tax Planning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Tax Planning Opportunities">
          <div className="space-y-4">
            <div className="p-4 bg-[#4ADE80]/10 rounded-lg">
              <h4 className="font-medium text-[#1E2A38] mb-2">Equipment Depreciation</h4>
              <p className="text-sm text-gray-600">Potential $12,500 deduction available</p>
            </div>
            <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
              <h4 className="font-medium text-[#1E2A38] mb-2">R&D Tax Credits</h4>
              <p className="text-sm text-gray-600">Eligible for $8,900 in credits</p>
            </div>
            <div className="p-4 bg-[#F59E0B]/10 rounded-lg">
              <h4 className="font-medium text-[#1E2A38] mb-2">Retirement Contributions</h4>
              <p className="text-sm text-gray-600">Maximize $15,000 annual contribution</p>
            </div>
          </div>
        </Card>

        <Card title="Upcoming Deadlines">
          <div className="space-y-4">
            {[
              { task: 'Q1 2025 Estimated Tax Payment', date: 'Mar 15, 2025', priority: 'high' },
              { task: 'Q1 2025 Payroll Tax Filing', date: 'Apr 30, 2025', priority: 'medium' },
              { task: 'Annual Corporate Tax Return', date: 'Mar 15, 2026', priority: 'low' },
              { task: 'State Tax Registration Renewal', date: 'Jun 30, 2025', priority: 'medium' }
            ].map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    deadline.priority === 'high' ? 'bg-[#F87171]' :
                    deadline.priority === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#4ADE80]'
                  }`} />
                  <div>
                    <p className="font-medium text-[#1E2A38]">{deadline.task}</p>
                    <p className="text-sm text-gray-600">{deadline.date}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Set Reminder</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TaxDocuments;