import React, { useState, useEffect } from 'react';
import { Activity, MessageSquare, CreditCard as Edit3, CheckCircle, AtSign, AlertCircle, Filter, X } from 'lucide-react';
import { commentService } from '../../services/commentService';
import type { ActivityLog, ActivityType } from '../../types/comment';

interface ActivityFeedProps {
  forecastId?: string;
  userId: string;
  onClose?: () => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ forecastId, userId, onClose }) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadActivities();
  }, [forecastId]);

  useEffect(() => {
    applyFilters();
  }, [activities, filterType]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await commentService.getActivityLog(forecastId);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activity log:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (filterType === 'all') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter((a) => a.activity_type === filterType));
    }
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'edit':
        return <Edit3 className="w-4 h-4 text-orange-600" />;
      case 'approval':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-purple-600" />;
      case 'change_request':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'comment':
        return 'bg-blue-50 border-blue-200';
      case 'edit':
        return 'bg-orange-50 border-orange-200';
      case 'approval':
        return 'bg-green-50 border-green-200';
      case 'mention':
        return 'bg-purple-50 border-purple-200';
      case 'change_request':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Activity Feed</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Close activity feed"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <Filter className="w-4 h-4" />
          Filter Activities
        </button>

        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-xs ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('comment')}
              className={`px-3 py-1 rounded-full text-xs ${
                filterType === 'comment'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => setFilterType('edit')}
              className={`px-3 py-1 rounded-full text-xs ${
                filterType === 'edit'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Edits
            </button>
            <button
              onClick={() => setFilterType('approval')}
              className={`px-3 py-1 rounded-full text-xs ${
                filterType === 'approval'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approvals
            </button>
            <button
              onClick={() => setFilterType('change_request')}
              className={`px-3 py-1 rounded-full text-xs ${
                filterType === 'change_request'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Change Requests
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filterType === 'all'
              ? 'No activity yet'
              : `No ${filterType} activities`}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={`border rounded-lg p-3 ${getActivityColor(activity.activity_type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getActivityIcon(activity.activity_type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-800">{activity.description}</p>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatRelativeTime(activity.created_at)}
                      </span>
                    </div>
                    {activity.cell_reference && (
                      <div className="mt-1 text-xs text-gray-600">
                        Cell: <span className="font-mono">{activity.cell_reference}</span>
                      </div>
                    )}
                    {activity.actor_name && (
                      <div className="mt-1 text-xs text-gray-600">
                        By: {activity.actor_name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={loadActivities}
          className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Refresh Activity
        </button>
      </div>
    </div>
  );
};
