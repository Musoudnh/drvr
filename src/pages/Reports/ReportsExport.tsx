import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, Mail, Clock, CheckCircle, AlertTriangle, BarChart3, PieChart, TrendingUp, Settings, Share2, Eye, Archive, RefreshCw } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const ReportsExport: React.FC = () => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('current-month');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportCategories = [
    {
      title: 'Financial Statements',
      reports: [
        { id: 'profit-loss', name: 'Profit & Loss Statement', description: 'Income and expense summary', icon: TrendingUp, size: '2.4 MB', lastGenerated: '2 hours ago' },
        { id: 'balance-sheet', name: 'Balance Sheet', description: 'Assets, liabilities, and equity', icon: BarChart3, size: '1.8 MB', lastGenerated: '2 hours ago' },
        { id: 'cash-flow', name: 'Cash Flow Statement', description: 'Cash inflows and outflows', icon: PieChart, size: '1.2 MB', lastGenerated: '3 hours ago' },
      ]
    },
    {
      title: 'Management Reports',
      reports: [
        { id: 'budget-variance', name: 'Budget vs Actual', description: 'Budget performance analysis', icon: BarChart3, size: '1.5 MB', lastGenerated: '4 hours ago' },
        { id: 'kpi-dashboard', name: 'KPI Dashboard', description: 'Key performance indicators', icon: TrendingUp, size: '2.1 MB', lastGenerated: '1 hour ago' },
        { id: 'expense-analysis', name: 'Expense Analysis', description: 'Detailed expense breakdown', icon: PieChart, size: '1.7 MB', lastGenerated: '6 hours ago' },
        { id: 'revenue-analysis', name: 'Revenue Analysis', description: 'Revenue trends and forecasts', icon: TrendingUp, size: '1.9 MB', lastGenerated: '3 hours ago' }
      ]
    },
    {
      title: 'Operational Reports',
      reports: [
        { id: 'accounts-receivable', name: 'Accounts Receivable Aging', description: 'Outstanding customer invoices', icon: Clock, size: '1.1 MB', lastGenerated: '5 hours ago' },
        { id: 'accounts-payable', name: 'Accounts Payable Summary', description: 'Vendor payment obligations', icon: Clock, size: '950 KB', lastGenerated: '4 hours ago' },
        { id: 'inventory-valuation', name: 'Inventory Valuation', description: 'Current inventory values', icon: Archive, size: '1.3 MB', lastGenerated: '1 day ago' },
        { id: 'payroll-summary', name: 'Payroll Summary', description: 'Employee compensation details', icon: FileText, size: '780 KB', lastGenerated: '1 week ago' }
      ]
    },
    {
      title: 'Compliance & Tax',
      reports: [
        { id: 'tax-summary', name: 'Tax Summary Report', description: 'Tax obligations and payments', icon: FileText, size: '1.4 MB', lastGenerated: '2 days ago' },
        { id: 'audit-trail', name: 'Audit Trail Report', description: 'Transaction history and changes', icon: Eye, size: '3.2 MB', lastGenerated: '1 day ago' },
        { id: 'sox-compliance', name: 'SOX Compliance Report', description: 'Sarbanes-Oxley compliance status', icon: CheckCircle, size: '2.8 MB', lastGenerated: '1 week ago' },
        { id: 'regulatory-filing', name: 'Regulatory Filing Prep', description: 'Documents for regulatory submissions', icon: FileText, size: '4.1 MB', lastGenerated: '3 days ago' }
      ]
    }
  ];

  const scheduledReports = [
    { name: 'Monthly Financial Package', frequency: 'Monthly', nextRun: 'Feb 1, 2025', recipients: 'finance-team@company.com', status: 'active' },
    { name: 'Weekly KPI Summary', frequency: 'Weekly', nextRun: 'Jan 20, 2025', recipients: 'executives@company.com', status: 'active' },
    { name: 'Quarterly Board Report', frequency: 'Quarterly', nextRun: 'Apr 1, 2025', recipients: 'board@company.com', status: 'active' },
    { name: 'Annual Tax Package', frequency: 'Annually', nextRun: 'Dec 31, 2025', recipients: 'tax-advisor@company.com', status: 'paused' }
  ];

  const handleReportSelect = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = (categoryReports: any[]) => {
    const categoryIds = categoryReports.map(r => r.id);
    const allSelected = categoryIds.every(id => selectedReports.includes(id));
    
    if (allSelected) {
      setSelectedReports(prev => prev.filter(id => !categoryIds.includes(id)));
    } else {
      setSelectedReports(prev => [...new Set([...prev, ...categoryIds])]);
    }
  };

  const handleBulkDownload = async () => {
    if (selectedReports.length === 0) return;
    
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setSelectedReports([]);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#4ADE80]/20 text-[#4ADE80]';
      case 'paused': return 'bg-[#F59E0B]/20 text-[#F59E0B]';
      case 'error': return 'bg-[#F87171]/20 text-[#F87171]';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <Card className="mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              >
                <option value="current-month">Current Month</option>
                <option value="last-month">Last Month</option>
                <option value="current-quarter">Current Quarter</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="current-year">Current Year</option>
                <option value="last-year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Template</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              >
                <option value="standard">Standard</option>
                <option value="detailed">Detailed</option>
                <option value="summary">Summary</option>
                <option value="executive">Executive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <Button
              variant="primary"
              onClick={handleBulkDownload}
              disabled={selectedReports.length === 0 || isGenerating}
              className="w-full lg:w-auto"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Selected ({selectedReports.length})
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Categories - excluding Compliance & Tax */}
      {reportCategories.filter(category => category.title !== 'Compliance & Tax').map((category, categoryIndex) => (
        <Card key={categoryIndex} title={category.title}>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-xs text-gray-600">{category.reports.length} reports available</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll(category.reports)}
            >
              {category.reports.every(r => selectedReports.includes(r.id)) ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.reports.map((report) => (
              <div
                key={report.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedReports.includes(report.id)
                    ? 'border-[#3AB7BF] bg-[#3AB7BF]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleReportSelect(report.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#3AB7BF]/10 rounded-lg flex items-center justify-center mr-3">
                      <report.icon className="w-5 h-5 text-[#3AB7BF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#101010]">{report.name}</h3>
                      <p className="text-xs text-gray-600">{report.description}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={() => handleReportSelect(report.id)}
                    className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF]"
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Size: {report.size}</span>
                  <span>Updated: {report.lastGenerated}</span>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Scheduled Reports */}
      <Card title="Scheduled Reports">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-xs text-gray-600">Automated report generation and distribution</p>
          <Button variant="primary" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule New Report
          </Button>
        </div>
        
        <div className="space-y-4">
          {scheduledReports.map((schedule, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-[#101010]">{schedule.name}</p>
                  <p className="text-xs text-gray-600">
                    {schedule.frequency} • Next: {schedule.nextRun} • To: {schedule.recipients}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                  {schedule.status}
                </span>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Report Templates */}
      <Card title="Custom Report Builder">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#101010] mb-4">Quick Templates</h3>
            <div className="space-y-3">
              {[
                { name: 'Executive Summary', description: 'High-level financial overview for leadership', icon: TrendingUp },
                { name: 'Board Package', description: 'Comprehensive report for board meetings', icon: FileText },
                { name: 'Investor Report', description: 'Financial performance for investors', icon: BarChart3 },
                { name: 'Lender Package', description: 'Financial statements for loan applications', icon: PieChart },
                { name: 'Tax Preparation', description: 'Documents needed for tax filing', icon: FileText },
                { name: 'Audit Package', description: 'Complete audit trail and supporting docs', icon: Eye }
              ].map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#3AB7BF] hover:bg-[#3AB7BF]/5 transition-all cursor-pointer">
                  <div className="flex items-center">
                    <template.icon className="w-4 h-4 text-[#3AB7BF] mr-3" />
                    <div>
                      <p className="font-medium text-[#101010]">{template.name}</p>
                      <p className="text-xs text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#101010] mb-4">Report Customization</h3>
            <div className="space-y-4">
              <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
                <h4 className="font-medium text-[#101010] mb-2">Custom Branding</h4>
                <p className="text-xs text-gray-600 mb-3">Add your company logo and colors to reports</p>
                <Button variant="outline" size="sm">Configure Branding</Button>
              </div>
              
              <div className="p-4 bg-[#4ADE80]/10 rounded-lg">
                <h4 className="font-medium text-[#101010] mb-2">Data Filters</h4>
                <p className="text-xs text-gray-600 mb-3">Create custom filters for specific departments or projects</p>
                <Button variant="outline" size="sm">Manage Filters</Button>
              </div>
              
              <div className="p-4 bg-[#F59E0B]/10 rounded-lg">
                <h4 className="font-medium text-[#101010] mb-2">Report Layouts</h4>
                <p className="text-xs text-gray-600 mb-3">Design custom layouts and formatting options</p>
                <Button variant="outline" size="sm">Design Layout</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Export History */}
      <Card title="Recent Exports">
        <div className="space-y-4">
          {[
            { name: 'Monthly Financial Package - January 2025', date: '2 hours ago', size: '8.4 MB', format: 'PDF', status: 'completed', downloads: 3 },
            { name: 'Q4 2024 Board Report', date: '1 day ago', size: '12.1 MB', format: 'Excel', status: 'completed', downloads: 7 },
            { name: 'Weekly KPI Dashboard', date: '3 days ago', size: '2.8 MB', format: 'PDF', status: 'completed', downloads: 12 },
            { name: 'Audit Trail Report - December', date: '1 week ago', size: '15.2 MB', format: 'CSV', status: 'completed', downloads: 2 },
            { name: 'Custom Revenue Analysis', date: '2 weeks ago', size: '4.6 MB', format: 'Excel', status: 'expired', downloads: 5 }
          ].map((export_, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-[#101010]">{export_.name}</p>
                  <p className="text-xs text-gray-600">
                    {export_.date} • {export_.size} • {export_.format} • {export_.downloads} downloads
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  export_.status === 'completed' 
                    ? 'bg-[#4ADE80]/20 text-[#4ADE80]'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {export_.status}
                </span>
                {export_.status === 'completed' && (
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

      {/* Report Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Reports Generated</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">247</p>
              <p className="text-xs text-gray-600 mt-1">This month</p>
            </div>
            <FileText className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">1,847</p>
              <p className="text-xs text-[#4ADE80] mt-1">+23% vs last month</p>
            </div>
            <Download className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Scheduled Reports</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">12</p>
              <p className="text-xs text-gray-600 mt-1">Active schedules</p>
            </div>
            <Calendar className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">2.4 GB</p>
              <p className="text-xs text-gray-600 mt-1">Of 10 GB limit</p>
            </div>
            <Archive className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>
      </div>

      {/* Advanced Features */}
      <Card title="Advanced Export Features">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#3AB7BF]/10 rounded-lg">
            <Mail className="w-8 h-8 text-[#3AB7BF] mx-auto mb-3" />
            <h3 className="font-semibold text-[#101010] mb-2">Email Distribution</h3>
            <p className="text-xs text-gray-600 mb-3">Automatically email reports to stakeholders</p>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <RefreshCw className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <h3 className="font-semibold text-[#101010] mb-2">API Integration</h3>
            <p className="text-xs text-gray-600 mb-3">Connect reports to external systems via API</p>
            <Button variant="outline" size="sm">Setup API</Button>
          </div>
          
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <Archive className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <h3 className="font-semibold text-[#101010] mb-2">Archive Management</h3>
            <p className="text-xs text-gray-600 mb-3">Manage long-term storage and compliance</p>
            <Button variant="outline" size="sm">Manage Archive</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsExport;