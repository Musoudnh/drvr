import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, Mail, FileCheck, X, Filter } from 'lucide-react';
import Card from '../UI/Card';
import { cashFlowService } from '../../services/cashFlowService';
import type { CashFlowAlert } from '../../types/cashFlow';

interface AlertsAutomationPanelProps {
  className?: string;
}

const AlertsAutomationPanel: React.FC<AlertsAutomationPanelProps> = ({ className = '' }) => {
  const [alerts, setAlerts] = useState<CashFlowAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await cashFlowService.getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await cashFlowService.markAlertAsRead(id);
      await loadAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (showUnreadOnly && alert.is_read) return false;
    if (filterPriority !== 'all' && alert.priority !== filterPriority) return false;
    if (filterType !== 'all' && alert.alert_type !== filterType) return false;
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.is_read).length;
  const criticalCount = alerts.filter((a) => a.priority === 'critical' && !a.is_read).length;
  const highCount = alerts.filter((a) => a.priority === 'high' && !a.is_read).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'payment_due':
        return <Clock className="w-5 h-5" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5" />;
      case 'reminder_sent':
        return <Mail className="w-5 h-5" />;
      case 'approval_needed':
        return <FileCheck className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Alerts & Automation</h2>
            <p className="text-sm text-gray-500">Real-time notifications and workflow status</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {unreadCount} new
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <p className="text-xs font-medium text-red-600">Critical</p>
          </div>
          <p className="text-2xl font-bold text-red-900">{criticalCount}</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-orange-600" />
            <p className="text-xs font-medium text-orange-600">High Priority</p>
          </div>
          <p className="text-2xl font-bold text-orange-900">{highCount}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-xs font-medium text-green-600">Total Alerts</p>
          </div>
          <p className="text-2xl font-bold text-green-900">{alerts.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            showUnreadOnly
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Unread Only
        </button>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="payment_due">Payment Due</option>
          <option value="overdue">Overdue</option>
          <option value="reminder_sent">Reminder Sent</option>
          <option value="approval_needed">Approval Needed</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">
          Loading alerts...
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="py-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-500">No alerts to display</p>
          <p className="text-sm text-gray-400 mt-1">All caught up!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 transition-all ${
                alert.is_read
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority)}`}>
                  {getAlertIcon(alert.alert_type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(alert.priority)}`}
                      >
                        {alert.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {alert.alert_type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDate(alert.created_at)}
                    </span>
                  </div>

                  <p className={`text-sm ${alert.is_read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                    {alert.message}
                  </p>

                  {alert.reference_type && (
                    <p className="text-xs text-gray-500 mt-1">
                      Related to: {alert.reference_type}
                    </p>
                  )}
                </div>

                {!alert.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    title="Mark as read"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Automation Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-900">Payment Reminders</span>
            </div>
            <span className="text-xs font-medium text-green-600">Active</span>
          </div>

          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-900">Overdue Notifications</span>
            </div>
            <span className="text-xs font-medium text-green-600">Active</span>
          </div>

          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-900">Approval Workflows</span>
            </div>
            <span className="text-xs font-medium text-green-600">Active</span>
          </div>

          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-900">Scheduled Payments</span>
            </div>
            <span className="text-xs font-medium text-blue-600">3 Pending</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AlertsAutomationPanel;
