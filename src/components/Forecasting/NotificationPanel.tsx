import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Settings, X } from 'lucide-react';
import { commentService } from '../../services/commentService';
import type { Notification, NotificationPreferences } from '../../types/comment';

interface NotificationPanelProps {
  userId: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadPreferences();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.is_read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      const data = await commentService.getNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await commentService.getNotificationPreferences(userId);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await commentService.markNotificationRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await commentService.markAllNotificationsRead(userId);
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleUpdatePreferences = async (updates: Partial<NotificationPreferences>) => {
    try {
      const updated = await commentService.updateNotificationPreferences(userId, updates);
      setPreferences(updated);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mention':
        return '💬';
      case 'comment':
        return '📝';
      case 'approval':
        return '✅';
      case 'change_request':
        return '🔄';
      case 'digest':
        return '📊';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowPanel(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
            </div>

            {showSettings && preferences ? (
              <div className="p-4 border-b bg-gray-50">
                <h4 className="font-medium mb-3">Notification Preferences</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={preferences.email_enabled}
                      onChange={(e) =>
                        handleUpdatePreferences({ email_enabled: e.target.checked })
                      }
                      className="rounded"
                    />
                    Email notifications
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={preferences.in_app_enabled}
                      onChange={(e) =>
                        handleUpdatePreferences({ in_app_enabled: e.target.checked })
                      }
                      className="rounded"
                    />
                    In-app notifications
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={preferences.mention_alerts}
                      onChange={(e) =>
                        handleUpdatePreferences({ mention_alerts: e.target.checked })
                      }
                      className="rounded"
                    />
                    Mention alerts
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={preferences.comment_alerts}
                      onChange={(e) =>
                        handleUpdatePreferences({ comment_alerts: e.target.checked })
                      }
                      className="rounded"
                    />
                    Comment alerts
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={preferences.weekly_digest}
                      onChange={(e) =>
                        handleUpdatePreferences({ weekly_digest: e.target.checked })
                      }
                      className="rounded"
                    />
                    Weekly digest
                  </label>
                </div>
              </div>
            ) : null}

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No notifications</div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-medium text-sm">{notification.title}</div>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
