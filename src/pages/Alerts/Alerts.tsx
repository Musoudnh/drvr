import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, X, Bell, Clock, Settings, Filter, Brain, Zap, Target, TrendingUp, Users, DollarSign, Calendar, RefreshCw, Eye, Plus } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface SmartAlert {
  id: string;
  type: 'anomaly' | 'threshold' | 'prediction' | 'optimization';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  confidence: number;
  dataSource: string;
  suggestedActions: string[];
  autoRemediationAvailable: boolean;
  createdAt: Date;
  isAcknowledged: boolean;
}

interface AlertThreshold {
  id: string;
  metric: string;
  condition: 'above' | 'below' | 'change';
  value: number;
  isActive: boolean;
  notifications: string[];
}

const Alerts: React.FC = () => {
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([
    {
      id: '1',
      type: 'anomaly',
      severity: 'critical',
      title: 'Unusual Revenue Pattern Detected',
      description: 'AI detected 23% deviation from expected revenue pattern in enterprise segment',
      confidence: 94,
      dataSource: 'Revenue Analytics Engine',
      suggestedActions: ['Review enterprise sales pipeline', 'Check for data entry errors', 'Analyze market conditions'],
      autoRemediationAvailable: false,
      createdAt: new Date(Date.now() - 1800000),
      isAcknowledged: false
    },
    {
      id: '2',
      type: 'prediction',
      severity: 'warning',
      title: 'Cash Flow Shortage Predicted',
      description: 'Predictive model indicates potential cash shortage in 45 days with 87% confidence',
      confidence: 87,
      dataSource: 'Cash Flow Prediction Model',
      suggestedActions: ['Accelerate collections', 'Review payment terms', 'Consider credit line'],
      autoRemediationAvailable: true,
      createdAt: new Date(Date.now() - 3600000),
      isAcknowledged: false
    },
    {
      id: '3',
      type: 'optimization',
      severity: 'info',
      title: 'Cost Optimization Opportunity',
      description: 'AI identified potential $15K monthly savings through software license optimization',
      confidence: 78,
      dataSource: 'Cost Optimization Engine',
      suggestedActions: ['Audit software usage', 'Negotiate with vendors', 'Implement usage tracking'],
      autoRemediationAvailable: true,
      createdAt: new Date(Date.now() - 7200000),
      isAcknowledged: true
    }
  ]);

  const [alertThresholds, setAlertThresholds] = useState<AlertThreshold[]>([
    { id: '1', metric: 'Monthly Revenue', condition: 'below', value: 400000, isActive: true, notifications: ['email', 'in-app'] },
    { id: '2', metric: 'Cash Flow', condition: 'below', value: 100000, isActive: true, notifications: ['email', 'sms', 'in-app'] },
    { id: '3', metric: 'Customer Acquisition Cost', condition: 'above', value: 200, isActive: true, notifications: ['in-app'] },
    { id: '4', metric: 'Profit Margin', condition: 'below', value: 20, isActive: false, notifications: ['email'] }
  ]);

  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [showSmartAlertsModal, setShowSmartAlertsModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const handleAcknowledgeAlert = (alertId: string) => {
    setSmartAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
    ));
  };

  const handleAutoRemediation = (alertId: string) => {
    const alert = smartAlerts.find(a => a.id === alertId);
    if (alert?.autoRemediationAvailable) {
      // Simulate auto-remediation
      console.log(`Auto-remediation triggered for: ${alert.title}`);
      window.alert('Auto-remediation workflow initiated. You will receive updates on progress.');
    }
  };

  const toggleThreshold = (thresholdId: string) => {
    setAlertThresholds(prev => prev.map(threshold =>
      threshold.id === thresholdId ? { ...threshold, isActive: !threshold.isActive } : threshold
    ));
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'anomaly': return '#F87171';
      case 'prediction': return '#F59E0B';
      case 'optimization': return '#4ADE80';
      case 'threshold': return '#3AB7BF';
      default: return '#6B7280';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return AlertTriangle;
      case 'prediction': return Brain;
      case 'optimization': return Target;
      case 'threshold': return Bell;
      default: return Info;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Smart Alerts & Monitoring</h2>
          <p className="text-gray-600 mt-1">AI-powered alerts with automated remediation and custom thresholds</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowThresholdModal(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Thresholds
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowIncidentModal(true)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Incident Management
          </Button>
          <Button 
            variant="primary" 
            onClick={() => setShowSmartAlertsModal(true)}
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Alerts
          </Button>
        </div>
      </div>

      {/* Alert Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">{smartAlerts.filter(a => !a.isAcknowledged).length}</p>
              <p className="text-sm text-gray-600 mt-1">Need attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Predictions</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">{smartAlerts.filter(a => a.type === 'prediction').length}</p>
              <p className="text-sm text-gray-600 mt-1">Forecasted issues</p>
            </div>
            <Brain className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Auto-Remediation</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">{smartAlerts.filter(a => a.autoRemediationAvailable).length}</p>
              <p className="text-sm text-gray-600 mt-1">Available actions</p>
            </div>
            <Zap className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">
                {Math.round(smartAlerts.reduce((sum, a) => sum + a.confidence, 0) / smartAlerts.length)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">AI accuracy</p>
            </div>
            <Target className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>
      </div>

      {/* Smart Alerts */}
      <Card title="AI-Powered Smart Alerts">
        <div className="space-y-4">
          {smartAlerts.slice(0, 3).map(alert => {
            const Icon = getAlertTypeIcon(alert.type);
            return (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${alert.isAcknowledged ? 'opacity-60' : ''}`}
                style={{ 
                  backgroundColor: `${getAlertTypeColor(alert.type)}10`,
                  borderLeftColor: getAlertTypeColor(alert.type)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Icon className="w-4 h-4 mr-2" style={{ color: getAlertTypeColor(alert.type) }} />
                      <h4 className="font-semibold text-[#1E2A38]">{alert.title}</h4>
                      <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium" style={{
                        backgroundColor: `${getAlertTypeColor(alert.type)}20`,
                        color: getAlertTypeColor(alert.type)
                      }}>
                        {alert.confidence}% confidence
                      </span>
                      <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {alert.suggestedActions.slice(0, 2).map((action, index) => (
                        <button
                          key={index}
                          className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                      {alert.autoRemediationAvailable && (
                        <button
                          onClick={() => handleAutoRemediation(alert.id)}
                          className="px-3 py-1 bg-[#4ADE80] text-white rounded-lg text-xs hover:bg-[#3BC66F] transition-colors"
                        >
                          Auto-Fix Available
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Source: {alert.dataSource} • {alert.createdAt.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!alert.isAcknowledged && (
                      <button
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="px-3 py-1 bg-[#3AB7BF] text-white rounded-lg text-xs hover:bg-[#2A9BA3] transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Alert History & Analytics */}
      <Card title="Alert History & Pattern Analysis">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#4ADE80]/10 rounded-lg text-center">
              <TrendingUp className="w-6 h-6 text-[#4ADE80] mx-auto mb-2" />
              <p className="text-lg font-bold text-[#4ADE80]">89%</p>
              <p className="text-sm text-gray-600">Alert Accuracy</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
            <div className="p-4 bg-[#3AB7BF]/10 rounded-lg text-center">
              <Clock className="w-6 h-6 text-[#3AB7BF] mx-auto mb-2" />
              <p className="text-lg font-bold text-[#3AB7BF]">2.3 hrs</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-xs text-gray-500">To acknowledge</p>
            </div>
            <div className="p-4 bg-[#F59E0B]/10 rounded-lg text-center">
              <Zap className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
              <p className="text-lg font-bold text-[#F59E0B]">67%</p>
              <p className="text-sm text-gray-600">Auto-Resolved</p>
              <p className="text-xs text-gray-500">With remediation</p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-[#1E2A38] mb-3">Alert Pattern Insights</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#4ADE80] rounded-full mt-1.5 mr-3" />
                Most alerts occur during month-end close (65% of total)
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#3AB7BF] rounded-full mt-1.5 mr-3" />
                Cash flow alerts have 94% accuracy in predicting actual shortages
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full mt-1.5 mr-3" />
                Revenue anomaly detection prevented 3 major issues this quarter
              </li>
            </ul>
          </div>
        </div>
      </Card>

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

      {/* Custom Alert Thresholds Modal */}
      {showThresholdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Custom Alert Thresholds</h3>
              <button
                onClick={() => setShowThresholdModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {alertThresholds.map(threshold => (
                <div key={threshold.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[#1E2A38]">{threshold.metric}</h4>
                      <p className="text-sm text-gray-600">
                        Alert when {threshold.condition} ${threshold.value.toLocaleString()}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={threshold.isActive}
                        onChange={() => toggleThreshold(threshold.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                    </label>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {threshold.notifications.map((method, index) => (
                      <span key={index} className="px-2 py-1 bg-[#3AB7BF]/20 text-[#3AB7BF] rounded text-xs">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Threshold
              </Button>
              <button
                onClick={() => setShowThresholdModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Alerts Modal */}
      {showSmartAlertsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">AI-Powered Smart Alerts</h3>
              <button
                onClick={() => setShowSmartAlertsModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {smartAlerts.map(alert => {
                const Icon = getAlertTypeIcon(alert.type);
                return (
                  <div 
                    key={alert.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" style={{ color: getAlertTypeColor(alert.type) }} />
                        <div>
                          <h4 className="font-semibold text-[#1E2A38]">{alert.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={{
                              backgroundColor: `${getAlertTypeColor(alert.type)}20`,
                              color: getAlertTypeColor(alert.type)
                            }}>
                              {alert.severity}
                            </span>
                            <span className="text-xs text-gray-500">{alert.confidence}% confidence</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{alert.createdAt.toLocaleString()}</span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-[#1E2A38]">Suggested Actions:</h5>
                      <div className="space-y-1">
                        {alert.suggestedActions.map((action, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-[#4ADE80] mr-2" />
                            <span className="text-sm text-gray-700">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">Source: {alert.dataSource}</span>
                      <div className="flex gap-2">
                        {alert.autoRemediationAvailable && (
                          <Button variant="primary" size="sm">
                            <Zap className="w-3 h-3 mr-1" />
                            Auto-Fix
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          {alert.isAcknowledged ? 'Acknowledged' : 'Acknowledge'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSmartAlertsModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Incident Management Integration */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Incident Management Integration</h3>
              <button
                onClick={() => setShowIncidentModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
                <h4 className="font-medium text-[#1E2A38] mb-2">PagerDuty Integration</h4>
                <p className="text-sm text-gray-600 mb-3">Push critical financial alerts to PagerDuty for rapid response</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Status: Connected</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-[#1E2A38] mb-2">Opsgenie Integration</h4>
                <p className="text-sm text-gray-600 mb-3">Route alerts to appropriate teams based on severity and type</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Status: Available</span>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-[#1E2A38] mb-2">Custom Webhook</h4>
                <p className="text-sm text-gray-600 mb-3">Send alerts to custom endpoints for integration with internal systems</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Status: Not configured</span>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowIncidentModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Alerts;