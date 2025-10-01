import React, { useState } from 'react';
import { Palette, Monitor, Bell, Shield, Database, Globe } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const AdminSettings: React.FC = () => {
  const [navigationColor, setNavigationColor] = useState('#4F46E5');

  const colorOptions = [
    { name: 'Purple', value: '#4F46E5' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Teal', value: '#3AB7BF' },
    { name: 'Green', value: '#10B981' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' }
  ];

  const handleColorChange = (color: string) => {
    setNavigationColor(color);
    document.documentElement.style.setProperty('--nav-bg-color', color);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#101010]">Admin Settings</h2>
        <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
      </div>

      {/* Appearance Settings */}
      <Card title="Appearance">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-[#101010] mb-4 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Navigation Color
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    navigationColor === color.value
                      ? 'border-gray-400 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs text-gray-600">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* System Settings */}
      <Card title="System Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#101010] mb-4 flex items-center">
              <Monitor className="w-4 h-4 mr-2" />
              Display Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Dark Mode</p>
                  <p className="text-sm text-gray-500">Enable dark theme across the platform</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4F46E5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#101010] mb-4 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">System Alerts</p>
                  <p className="text-sm text-gray-500">Receive notifications for system events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4F46E5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F46E5]"></div>
                </label>
              </div>
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

export default AdminSettings;