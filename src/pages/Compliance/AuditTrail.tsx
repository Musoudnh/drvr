import React, { useState } from 'react';
import { Shield, Eye, Download, Search, Filter, Calendar, User, Activity, FileText, Lock, CheckCircle, AlertTriangle, Clock, Database } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  riskLevel: 'low' | 'medium' | 'high';
  complianceFlags: string[];
}

interface ComplianceReport {
  id: string;
  name: string;
  type: 'sox' | 'gdpr' | 'pci' | 'custom';
  status: 'compliant' | 'non_compliant' | 'pending_review';
  lastAssessment: Date;
  nextDue: Date;
  findings: number;
  criticalIssues: number;
}

const AuditTrail: React.FC = () => {
  const [auditEntries] = useState<AuditEntry[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000),
      userId: 'user1',
      userName: 'Sarah Johnson',
      action: 'UPDATE_REVENUE_FORECAST',
      resource: 'revenue_stream',
      resourceId: 'rs_001',
      oldValue: { amount: 425000 },
      newValue: { amount: 445000 },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_abc123',
      riskLevel: 'medium',
      complianceFlags: ['SOX_FINANCIAL_CHANGE']
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 900000),
      userId: 'user2',
      userName: 'Michael Chen',
      action: 'DELETE_EXPENSE_CATEGORY',
      resource: 'expense_category',
      resourceId: 'ec_045',
      oldValue: { name: 'Temporary Marketing', amount: 15000 },
      newValue: null,
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_def456',
      riskLevel: 'high',
      complianceFlags: ['SOX_DATA_DELETION', 'AUDIT_REQUIRED']
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1800000),
      userId: 'user3',
      userName: 'Emily Rodriguez',
      action: 'EXPORT_FINANCIAL_DATA',
      resource: 'financial_report',
      resourceId: 'fr_789',
      oldValue: null,
      newValue: { format: 'PDF', records: 1247 },
      ipAddress: '192.168.1.108',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_ghi789',
      riskLevel: 'medium',
      complianceFlags: ['DATA_EXPORT', 'PII_ACCESS']
    }
  ]);

  const [complianceReports] = useState<ComplianceReport[]>([
    {
      id: '1',
      name: 'SOX Compliance Assessment',
      type: 'sox',
      status: 'compliant',
      lastAssessment: new Date('2025-01-10'),
      nextDue: new Date('2025-04-10'),
      findings: 2,
      criticalIssues: 0
    },
    {
      id: '2',
      name: 'GDPR Data Protection Review',
      type: 'gdpr',
      status: 'pending_review',
      lastAssessment: new Date('2025-01-05'),
      nextDue: new Date('2025-02-05'),
      findings: 5,
      criticalIssues: 1
    },
    {
      id: '3',
      name: 'PCI DSS Compliance',
      type: 'pci',
      status: 'compliant',
      lastAssessment: new Date('2025-01-12'),
      nextDue: new Date('2025-07-12'),
      findings: 0,
      criticalIssues: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-[#F87171] bg-[#F87171]/10';
      case 'medium': return 'text-[#F59E0B] bg-[#F59E0B]/10';
      case 'low': return 'text-[#4ADE80] bg-[#4ADE80]/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-[#4ADE80] bg-[#4ADE80]/10';
      case 'non_compliant': return 'text-[#F87171] bg-[#F87171]/10';
      case 'pending_review': return 'text-[#F59E0B] bg-[#F59E0B]/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = !selectedRiskLevel || entry.riskLevel === selectedRiskLevel;
    const matchesAction = !selectedAction || entry.action.includes(selectedAction);
    
    return matchesSearch && matchesRisk && matchesAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#101010]">Audit Trail & Compliance</h2>
          <p className="text-gray-600 mt-1">Comprehensive audit logging and compliance monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Audit Log
          </Button>
          <Button variant="primary" className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Audit Entries</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">{auditEntries.length.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
            </div>
            <Database className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Events</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">{auditEntries.filter(e => e.riskLevel === 'high').length}</p>
              <p className="text-sm text-gray-600 mt-1">Need review</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">94%</p>
              <p className="text-sm text-gray-600 mt-1">Overall rating</p>
            </div>
            <Shield className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">24</p>
              <p className="text-sm text-gray-600 mt-1">This session</p>
            </div>
            <User className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit logs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              <option value="">All Actions</option>
              <option value="UPDATE">Updates</option>
              <option value="DELETE">Deletions</option>
              <option value="EXPORT">Exports</option>
              <option value="LOGIN">Logins</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card title="Audit Log Entries">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Resource</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk Level</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Compliance</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => (
                <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {entry.timestamp.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#8B5CF6] rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#101010] text-sm">{entry.userName}</p>
                        <p className="text-xs text-gray-500">{entry.ipAddress}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#101010] text-sm">{entry.action}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-[#101010] text-sm">{entry.resource}</p>
                      <p className="text-xs text-gray-500">{entry.resourceId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(entry.riskLevel)}`}>
                      {entry.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {entry.complianceFlags.map((flag, index) => (
                        <span key={index} className="block px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] rounded text-xs">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Compliance Reports */}
      <Card title="Compliance Reports">
        <div className="space-y-4">
          {complianceReports.map(report => (
            <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#8B5CF6] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center mr-4">
                    <Shield className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#101010]">{report.name}</h3>
                    <p className="text-sm text-gray-600">{report.type.toUpperCase()} Compliance Framework</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getComplianceStatusColor(report.status)}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Last Assessment</p>
                  <p className="font-medium text-[#101010]">{report.lastAssessment.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Next Due</p>
                  <p className="font-medium text-[#101010]">{report.nextDue.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Findings</p>
                  <p className="font-medium text-[#F59E0B]">{report.findings}</p>
                </div>
                <div>
                  <p className="text-gray-600">Critical Issues</p>
                  <p className="font-medium text-[#F87171]">{report.criticalIssues}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Data Retention Policy */}
      <Card title="Data Retention & Security">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#101010] mb-4">Retention Policies</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Audit Logs</span>
                <span className="text-sm text-[#3AB7BF]">7 years</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Financial Data</span>
                <span className="text-sm text-[#3AB7BF]">10 years</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">User Activity</span>
                <span className="text-sm text-[#3AB7BF]">3 years</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">System Logs</span>
                <span className="text-sm text-[#3AB7BF]">1 year</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#101010] mb-4">Security Measures</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 text-[#4ADE80] mr-2" />
                  <span className="text-sm text-gray-700">Encryption at Rest</span>
                </div>
                <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 text-[#4ADE80] mr-2" />
                  <span className="text-sm text-gray-700">Encryption in Transit</span>
                </div>
                <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-[#4ADE80] mr-2" />
                  <span className="text-sm text-gray-700">Access Controls</span>
                </div>
                <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 text-[#4ADE80] mr-2" />
                  <span className="text-sm text-gray-700">Activity Monitoring</span>
                </div>
                <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Change History */}
      <Card title="Recent Changes">
        <div className="space-y-3">
          {auditEntries.filter(e => e.oldValue && e.newValue).map(entry => (
            <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 text-[#3AB7BF] mr-2" />
                  <span className="font-medium text-[#101010]">{entry.action}</span>
                </div>
                <span className="text-sm text-gray-500">{entry.timestamp.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Before:</p>
                  <div className="p-2 bg-[#F87171]/10 rounded border border-[#F87171]/20">
                    <code className="text-[#F87171]">{JSON.stringify(entry.oldValue, null, 2)}</code>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">After:</p>
                  <div className="p-2 bg-[#4ADE80]/10 rounded border border-[#4ADE80]/20">
                    <code className="text-[#4ADE80]">{JSON.stringify(entry.newValue, null, 2)}</code>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Changed by {entry.userName} from {entry.ipAddress}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AuditTrail;