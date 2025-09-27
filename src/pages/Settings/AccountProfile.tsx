import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Shield, Key, Bell, Eye, Lock, Smartphone, Globe, Clock, CheckCircle, AlertTriangle, Settings, Save, X } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface NotificationPreference {
  id: string;
  category: string;
  email: boolean;
  inApp: boolean;
  sms: boolean;
  push: boolean;
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  required: boolean;
}

interface NotificationPreference {
  id: string;
  category: string;
  email: boolean;
  inApp: boolean;
  sms: boolean;
  push: boolean;
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  required: boolean;
}

const AccountProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    title: 'Finance Director',
    department: 'Finance',
    location: 'San Francisco, CA',
    bio: 'Experienced finance professional with 10+ years in corporate finance and strategic planning.'
  });

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([
    { id: '1', category: 'Financial Alerts', email: true, inApp: true, sms: false, push: true },
    { id: '2', category: 'System Updates', email: true, inApp: true, sms: false, push: false },
    { id: '3', category: 'Team Activity', email: false, inApp: true, sms: false, push: true },
    { id: '4', category: 'Security Alerts', email: true, inApp: true, sms: true, push: true },
    { id: '5', category: 'Marketing', email: false, inApp: false, sms: false, push: false }
  ]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    { id: '1', name: 'Two-Factor Authentication', description: 'Add an extra layer of security', enabled: true, required: false },
    { id: '2', name: 'Login Notifications', description: 'Get notified of new login attempts', enabled: true, required: false },
    { id: '3', name: 'Session Timeout', description: 'Auto-logout after inactivity', enabled: true, required: true },
    { id: '4', name: 'IP Restrictions', description: 'Limit access to specific IP addresses', enabled: false, required: false }
  ]);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mfaMethods, setMfaMethods] = useState([
    { type: 'authenticator', name: 'Authenticator App', enabled: true, primary: true },
    { type: 'sms', name: 'SMS Backup', enabled: true, primary: false },
    { type: 'hardware', name: 'Hardware Key', enabled: false, primary: false }
  ]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    console.log('Profile updated:', formData);
  };

  const toggleNotificationPreference = (id: string, type: 'email' | 'inApp' | 'sms' | 'push') => {
    setNotificationPreferences(prev => prev.map(pref =>
      pref.id === id ? { ...pref, [type]: !pref[type] } : pref
    ));
  };

  const toggleSecuritySetting = (id: string) => {
    setSecuritySettings(prev => prev.map(setting =>
      setting.id === id && !setting.required ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E2A38]">Account Profile & Security</h2>
        <p className="text-gray-600 mt-1">Manage your personal information, security settings, and notification preferences</p>
      </div>

      {/* Security & Privacy Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications & Alerts */}
        <Card title="Notifications & Alerts">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#3AB7BF]/10 to-[#4ADE80]/10 rounded-xl border border-[#3AB7BF]/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-xl flex items-center justify-center mr-4">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1E2A38]">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Financial alerts and system updates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#3AB7BF] peer-checked:to-[#4ADE80]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#F59E0B]/10 rounded-xl border border-[#F59E0B]/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#F59E0B] rounded-xl flex items-center justify-center mr-4">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1E2A38]">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Mobile and desktop alerts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F59E0B]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B]"></div>
              </label>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowNotificationModal(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced Notification Settings
            </Button>
          </div>
        </Card>

        {/* Security & Privacy */}
        <Card title="Security & Privacy">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#4ADE80]/10 to-[#3AB7BF]/10 rounded-xl border border-[#4ADE80]/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#4ADE80] to-[#3AB7BF] rounded-xl flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1E2A38]">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Enhanced account security</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowMfaModal(true)}
                >
                  Configure
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#8B5CF6]/10 rounded-xl border border-[#8B5CF6]/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#8B5CF6] rounded-xl flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1E2A38]">Privacy Controls</h4>
                  <p className="text-sm text-gray-600">Data sharing and visibility</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8B5CF6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
              </label>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowSecurityModal(true)}
            >
              <Lock className="w-4 h-4 mr-2" />
              Advanced Security Settings
            </Button>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo */}
        <Card title="Profile Photo">
          <div className="text-center">
            <div className="w-32 h-32 bg-[#3AB7BF] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16 text-white" />
            </div>
            <Button variant="outline" size="sm">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </Card>

        {/* Basic Information */}
        <div className="lg:col-span-2">
          <Card title="Basic Information">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">Human Resources</option>
                    <option value="IT">Information Technology</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary" type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Granular Notification Preferences Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Notification Preferences</h3>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">In-App</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">SMS</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Push</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notificationPreferences.map(pref => (
                      <tr key={pref.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-[#1E2A38]">{pref.category}</td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={pref.email}
                            onChange={() => toggleNotificationPreference(pref.id, 'email')}
                            className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF]"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={pref.inApp}
                            onChange={() => toggleNotificationPreference(pref.id, 'inApp')}
                            className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF]"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={pref.sms}
                            onChange={() => toggleNotificationPreference(pref.id, 'sms')}
                            className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF]"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={pref.push}
                            onChange={() => toggleNotificationPreference(pref.id, 'push')}
                            className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <Button variant="primary">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Factor Authentication Modal */}
      {showMfaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Multi-Factor Authentication</h3>
              <button
                onClick={() => setShowMfaModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#4ADE80]/10 rounded-lg">
                <div>
                  <p className="font-medium text-[#1E2A38]">MFA Status</p>
                  <p className="text-sm text-gray-600">Two-factor authentication is enabled</p>
                </div>
                <CheckCircle className="w-6 h-6 text-[#4ADE80]" />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1E2A38]">Authentication Methods</h4>
                {mfaMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        method.enabled ? 'bg-[#4ADE80]' : 'bg-gray-300'
                      }`}>
                        {method.type === 'authenticator' && <Smartphone className="w-4 h-4 text-white" />}
                        {method.type === 'sms' && <Phone className="w-4 h-4 text-white" />}
                        {method.type === 'hardware' && <Key className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium text-[#1E2A38]">{method.name}</p>
                        {method.primary && (
                          <span className="px-2 py-1 bg-[#3AB7BF]/20 text-[#3AB7BF] rounded-full text-xs">Primary</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {method.enabled ? (
                        <Button variant="outline" size="sm">Configure</Button>
                      ) : (
                        <Button variant="primary" size="sm">Enable</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowMfaModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Security Settings</h3>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                {securitySettings.map(setting => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="font-medium text-[#1E2A38]">{setting.name}</p>
                        {setting.required && (
                          <span className="ml-2 px-2 py-1 bg-[#F87171]/20 text-[#F87171] rounded-full text-xs">Required</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={setting.enabled}
                        onChange={() => toggleSecuritySetting(setting.id)}
                        disabled={setting.required}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4ADE80]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4ADE80] disabled:opacity-50"></div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-[#4ADE80]/10 rounded-lg">
                <h4 className="font-medium text-[#1E2A38] mb-2">Security Score</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#4ADE80]">92/100</span>
                  <span className="text-sm text-gray-600">Excellent security posture</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="primary">
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Granular Notification Preferences Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Notification Preferences</h3>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">In-App</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">SMS</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Push</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notificationPreferences.map(pref => (
                      <tr key={pref.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-[#1E2A38]">{pref.category}</td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={pref.email}
                            onChange={() => toggleNotificationPreference(pref.id, 'email')}
                            className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF]"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={pref.inApp}
                            onChange={() => toggleNotificationPreference(pref.id, 'inApp')}
                            className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF]"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={pref.sms}
                            onChange={() => toggleNotificationPreference(pref.id, 'sms')}
                            className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF]"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={pref.push}
                            onChange={() => toggleNotificationPreference(pref.id, 'push')}
                            className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <Button variant="primary">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Factor Authentication Modal */}
      {showMfaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Multi-Factor Authentication</h3>
              <button
                onClick={() => setShowMfaModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#4ADE80]/10 rounded-lg">
                <div>
                  <p className="font-medium text-[#1E2A38]">MFA Status</p>
                  <p className="text-sm text-gray-600">Two-factor authentication is enabled</p>
                </div>
                <CheckCircle className="w-6 h-6 text-[#4ADE80]" />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1E2A38]">Authentication Methods</h4>
                {mfaMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        method.enabled ? 'bg-[#4ADE80]' : 'bg-gray-300'
                      }`}>
                        {method.type === 'authenticator' && <Smartphone className="w-4 h-4 text-white" />}
                        {method.type === 'sms' && <Phone className="w-4 h-4 text-white" />}
                        {method.type === 'hardware' && <Key className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium text-[#1E2A38]">{method.name}</p>
                        {method.primary && (
                          <span className="px-2 py-1 bg-[#3AB7BF]/20 text-[#3AB7BF] rounded-full text-xs">Primary</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {method.enabled ? (
                        <Button variant="outline" size="sm">Configure</Button>
                      ) : (
                        <Button variant="primary" size="sm">Enable</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowMfaModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Security Settings</h3>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                {securitySettings.map(setting => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="font-medium text-[#1E2A38]">{setting.name}</p>
                        {setting.required && (
                          <span className="ml-2 px-2 py-1 bg-[#F87171]/20 text-[#F87171] rounded-full text-xs">Required</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={setting.enabled}
                        onChange={() => toggleSecuritySetting(setting.id)}
                        disabled={setting.required}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4ADE80]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4ADE80] disabled:opacity-50"></div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-[#4ADE80]/10 rounded-lg">
                <h4 className="font-medium text-[#1E2A38] mb-2">Security Score</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#4ADE80]">92/100</span>
                  <span className="text-sm text-gray-600">Excellent security posture</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="primary">
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default AccountProfile;