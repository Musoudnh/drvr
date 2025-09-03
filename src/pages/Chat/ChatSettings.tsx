import React, { useState } from 'react';
import { Bell, Volume2, Moon, Smartphone, Mail, MessageSquare, Users, Hash, Lock, Eye, Clock, Palette } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const ChatSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      desktop: true,
      mobile: true,
      email: false,
      sound: true,
      mentions: true,
      directMessages: true,
      channelMessages: false,
      quietHours: true,
      quietStart: '22:00',
      quietEnd: '08:00'
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      messageGrouping: true,
      showAvatars: true,
      compactMode: false,
      emojiSize: 'medium'
    },
    privacy: {
      readReceipts: true,
      typingIndicators: true,
      onlineStatus: true,
      lastSeen: true,
      messagePreview: true
    },
    channels: {
      autoJoin: false,
      showUnread: true,
      markAsRead: 'auto',
      threadNotifications: true,
      channelSuggestions: true
    }
  });

  const handleToggle = (section: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: !prev[section as keyof typeof prev][setting as keyof typeof prev[typeof section]]
      }
    }));
  };

  const handleSelectChange = (section: string, setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const renderToggle = (section: string, setting: string, enabled: boolean) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={enabled}
        onChange={() => handleToggle(section, setting)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
    </label>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E2A38]">Chat Settings</h2>
        <p className="text-gray-600 mt-1">Customize your chat experience and notification preferences</p>
      </div>

      {/* Notification Settings */}
      <Card title="Notifications">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notification Types
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Desktop Notifications</p>
                    <p className="text-sm text-gray-500">Show notifications on your desktop</p>
                  </div>
                  {renderToggle('notifications', 'desktop', settings.notifications.desktop)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Mobile Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications on mobile devices</p>
                  </div>
                  {renderToggle('notifications', 'mobile', settings.notifications.mobile)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-500">Get notified via email for important messages</p>
                  </div>
                  {renderToggle('notifications', 'email', settings.notifications.email)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Sound Alerts</p>
                    <p className="text-sm text-gray-500">Play sound when receiving messages</p>
                  </div>
                  {renderToggle('notifications', 'sound', settings.notifications.sound)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Alerts
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Mentions & Replies</p>
                    <p className="text-sm text-gray-500">When someone mentions you or replies</p>
                  </div>
                  {renderToggle('notifications', 'mentions', settings.notifications.mentions)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Direct Messages</p>
                    <p className="text-sm text-gray-500">All direct message notifications</p>
                  </div>
                  {renderToggle('notifications', 'directMessages', settings.notifications.directMessages)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Channel Messages</p>
                    <p className="text-sm text-gray-500">All messages in channels you're in</p>
                  </div>
                  {renderToggle('notifications', 'channelMessages', settings.notifications.channelMessages)}
                </div>
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <Moon className="w-4 h-4 mr-2" />
              Quiet Hours
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Enable Quiet Hours</p>
                  <p className="text-sm text-gray-500">Mute notifications during specified hours</p>
                </div>
                {renderToggle('notifications', 'quietHours', settings.notifications.quietHours)}
              </div>
              {settings.notifications.quietHours && (
                <div className="grid grid-cols-2 gap-4 ml-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={settings.notifications.quietStart}
                      onChange={(e) => handleSelectChange('notifications', 'quietStart', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={settings.notifications.quietEnd}
                      onChange={(e) => handleSelectChange('notifications', 'quietEnd', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card title="Appearance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Display Options
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  value={settings.appearance.theme}
                  onChange={(e) => handleSelectChange('appearance', 'theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                <select
                  value={settings.appearance.fontSize}
                  onChange={(e) => handleSelectChange('appearance', 'fontSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emoji Size</label>
                <select
                  value={settings.appearance.emojiSize}
                  onChange={(e) => handleSelectChange('appearance', 'emojiSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Message Display
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Group Messages</p>
                  <p className="text-sm text-gray-500">Group consecutive messages from same user</p>
                </div>
                {renderToggle('appearance', 'messageGrouping', settings.appearance.messageGrouping)}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Show Avatars</p>
                  <p className="text-sm text-gray-500">Display user avatars next to messages</p>
                </div>
                {renderToggle('appearance', 'showAvatars', settings.appearance.showAvatars)}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Compact Mode</p>
                  <p className="text-sm text-gray-500">Reduce spacing between messages</p>
                </div>
                {renderToggle('appearance', 'compactMode', settings.appearance.compactMode)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card title="Privacy & Status">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Privacy Controls
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Read Receipts</p>
                  <p className="text-sm text-gray-500">Let others know when you've read their messages</p>
                </div>
                {renderToggle('privacy', 'readReceipts', settings.privacy.readReceipts)}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Typing Indicators</p>
                  <p className="text-sm text-gray-500">Show when you're typing a message</p>
                </div>
                {renderToggle('privacy', 'typingIndicators', settings.privacy.typingIndicators)}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Online Status</p>
                  <p className="text-sm text-gray-500">Show your online/offline status to others</p>
                </div>
                {renderToggle('privacy', 'onlineStatus', settings.privacy.onlineStatus)}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Last Seen</p>
                  <p className="text-sm text-gray-500">Show when you were last active</p>
                </div>
                {renderToggle('privacy', 'lastSeen', settings.privacy.lastSeen)}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Message Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Message Previews</p>
                  <p className="text-sm text-gray-500">Show message content in notifications</p>
                </div>
                {renderToggle('privacy', 'messagePreview', settings.privacy.messagePreview)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-mark as Read</label>
                <select
                  value={settings.channels.markAsRead}
                  onChange={(e) => handleSelectChange('channels', 'markAsRead', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="auto">Automatically</option>
                  <option value="manual">Manual only</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Channel Settings */}
      <Card title="Channel Preferences">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <Hash className="w-4 h-4 mr-2" />
              Channel Behavior
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Auto-join New Channels</p>
                  <p className="text-sm text-gray-500">Automatically join channels you're invited to</p>
                </div>
                {renderToggle('channels', 'autoJoin', settings.channels.autoJoin)}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Show Unread Indicators</p>
                  <p className="text-sm text-gray-500">Display unread message counts</p>
                </div>
                {renderToggle('channels', 'showUnread', settings.channels.showUnread)}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Thread Notifications</p>
                  <p className="text-sm text-gray-500">Get notified about thread replies</p>
                </div>
                {renderToggle('channels', 'threadNotifications', settings.channels.threadNotifications)}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Channel Suggestions</p>
                  <p className="text-sm text-gray-500">Show suggested channels to join</p>
                </div>
                {renderToggle('channels', 'channelSuggestions', settings.channels.channelSuggestions)}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <Volume2 className="w-4 h-4 mr-2" />
              Sound & Alerts
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Sound</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="default">Default</option>
                  <option value="chime">Chime</option>
                  <option value="bell">Bell</option>
                  <option value="pop">Pop</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Frequency</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="immediate">Immediate</option>
                  <option value="bundled">Bundled (every 5 min)</option>
                  <option value="hourly">Hourly digest</option>
                  <option value="daily">Daily summary</option>
                </select>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                <p className="text-sm font-medium text-[#1E2A38] mb-1">Test Notifications</p>
                <p className="text-xs text-gray-600 mb-2">Send a test notification to verify your settings</p>
                <Button variant="outline" size="sm">Send Test</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Settings */}
      <Card title="Advanced Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Message History
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Retention</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="forever">Keep forever</option>
                  <option value="1year">1 year</option>
                  <option value="6months">6 months</option>
                  <option value="3months">3 months</option>
                  <option value="1month">1 month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search History</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="all">Search all messages</option>
                  <option value="recent">Recent messages only</option>
                  <option value="none">Disable search</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4 flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Mobile Sync</p>
                  <p className="text-sm text-gray-500">Sync settings across devices</p>
                </div>
                {renderToggle('notifications', 'mobile', settings.notifications.mobile)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Notification Style</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="banner">Banner</option>
                  <option value="alert">Alert</option>
                  <option value="badge">Badge only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card title="Keyboard Shortcuts">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Message Actions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Send message</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New line</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Shift + Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mention user</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">@</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Upload file</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + U</kbd>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Navigation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Next channel</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + K</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Search messages</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + F</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mark as read</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toggle sidebar</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + \\</kbd>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data & Storage */}
      <Card title="Data & Storage">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Storage Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Messages</span>
                  <span className="text-sm text-gray-600">2.4 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#3AB7BF] h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Files & Media</span>
                  <span className="text-sm text-gray-600">1.8 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#4ADE80] h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Used</span>
                  <span className="font-bold text-[#1E2A38]">4.2 GB / 10 GB</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Data Management</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Export Chat History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Clear Cache
              </Button>
              <Button variant="danger" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Delete All Messages
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button variant="primary">Save Settings</Button>
      </div>
    </div>
  );
};

export default ChatSettings;