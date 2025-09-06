import React, { useState } from 'react';
import { TrendingUp, DollarSign, Plus, Target, BarChart3, Calendar, Building, X, Trash2, MoreHorizontal } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const RevenueRunway: React.FC = () => {
  const [startingRevenue] = useState(425000);
  const [revenueGrowthRate] = useState(8.5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [revenueStreams, setRevenueStreams] = useState([
    { id: 1, name: 'Product Sales', amount: 285000, startMonth: 'Jan 2025', endMonth: 'Dec 2025', category: 'Product', active: true },
    { id: 2, name: 'Service Revenue', amount: 95000, startMonth: 'Jan 2025', endMonth: 'Dec 2025', category: 'Service', active: true },
    { id: 3, name: 'Subscription Revenue', amount: 35000, startMonth: 'Mar 2025', endMonth: 'Dec 2025', category: 'Subscription', active: true },
    { id: 4, name: 'Licensing Revenue', amount: 15000, startMonth: 'Jun 2025', endMonth: 'Dec 2025', category: 'Other', active: false }
  ]);
  const [newStream, setNewStream] = useState({
    name: '',
    amount: '',
    startMonth: 'Jan 2025',
    endMonth: 'Dec 2025',
    category: 'Product',
    customCategory: ''
  });

  const months = [
    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025',
    'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
  ];

  const revenueDrivers = [
    { id: 1, name: 'New Product Launch', impact: '+$45K/month', startMonth: 'Mar 2025', active: true, type: 'Product' },
    { id: 2, name: 'Price Optimization', impact: '+$25K/month', startMonth: 'Feb 2025', active: true, type: 'Pricing' },
    { id: 3, name: 'Market Expansion', impact: '+$65K/month', startMonth: 'May 2025', active: false, type: 'Growth' },
    { id: 4, name: 'Customer Upselling', impact: '+$35K/month', startMonth: 'Apr 2025', active: true, type: 'Sales' }
  ];

  const handleAddStream = () => {
    if (newStream.name.trim() && newStream.amount) {
      const finalCategory = newStream.category === 'Custom' ? newStream.customCategory : newStream.category;
      const stream = {
        id: Math.max(...revenueStreams.map(s => s.id)) + 1,
        name: newStream.name,
        amount: parseInt(newStream.amount),
        startMonth: newStream.startMonth,
        endMonth: newStream.endMonth,
        category: finalCategory,
        active: true
      };
      setRevenueStreams(prev => [...prev, stream]);
      setNewStream({ name: '', amount: '', startMonth: 'Jan 2025', endMonth: 'Dec 2025', category: 'Product', customCategory: '' });
      setShowAddModal(false);
    }
  };

  const handleDeleteStream = (id: number) => {
    setRevenueStreams(prev => prev.filter(s => s.id !== id));
  };

  const getMonthIndex = (month: string) => {
    return months.indexOf(month);
  };

  const getCategoryColor = (category: string) => {
    return '#9CA3AF'; // Light grey for all categories
  };

  const calculateRevenueProjection = () => {
    return months.map((month, index) => {
      let baseRevenue = startingRevenue * Math.pow(1 + revenueGrowthRate / 100, index);
      
      // Apply active drivers
      revenueDrivers.forEach(driver => {
        if (driver.active) {
          const driverStartIndex = months.indexOf(driver.startMonth);
          if (index >= driverStartIndex) {
            const impact = parseInt(driver.impact.replace(/[^0-9]/g, '')) * 1000;
            baseRevenue += impact;
          }
        }
      });

      // Apply revenue streams
      revenueStreams.forEach(stream => {
        if (stream.active) {
          const streamStartIndex = getMonthIndex(stream.startMonth);
          const streamEndIndex = getMonthIndex(stream.endMonth);
          if (index >= streamStartIndex && index <= streamEndIndex) {
            baseRevenue += stream.amount;
          }
        }
      });
      return {
        month,
        revenue: baseRevenue,
        growth: index === 0 ? 0 : ((baseRevenue - (startingRevenue * Math.pow(1 + revenueGrowthRate / 100, index - 1))) / (startingRevenue * Math.pow(1 + revenueGrowthRate / 100, index - 1))) * 100
      };
    });
  };

  const projectionData = calculateRevenueProjection();
  const totalProjectedRevenue = projectionData.reduce((sum, month) => sum + month.revenue, 0);
  const averageGrowthRate = projectionData.reduce((sum, month) => sum + month.growth, 0) / projectionData.length;

  return (
    <div className="space-y-6">
      <div className="mt-6"></div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex-shrink-0 w-full p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[#ec4899] text-white rounded-full text-xs font-semibold">Revenue</span>
            <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-white">${startingRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Current MRR</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Monthly recurring</span>
            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
          </div>
        </div>

        <div className="flex-shrink-0 w-full p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[#10b981] text-white rounded-full text-xs font-semibold">Growth</span>
            <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-white">{revenueGrowthRate}%</p>
            <p className="text-sm text-gray-400">Growth Rate</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Monthly growth</span>
            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
          </div>
        </div>

        <div className="flex-shrink-0 w-full p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[#f59e0b] text-white rounded-full text-xs font-semibold">Projection</span>
            <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-white">${(totalProjectedRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-400">12M Projection</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#10b981]">+{averageGrowthRate.toFixed(1)}% avg growth</span>
            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
          </div>
        </div>

        <div className="flex-shrink-0 w-full p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[#8b5cf6] text-white rounded-full text-xs font-semibold">Streams</span>
            <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-white">{revenueStreams.filter(s => s.active).length}</p>
            <p className="text-sm text-gray-400">Active Streams</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Revenue sources</span>
            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Revenue Streams Management */}
      <Card title="Revenue Streams">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">Manage your revenue streams and income timeline</p>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="!bg-[#1E2A38] !hover:bg-[#2A3441] !focus:ring-[#1E2A38] !text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Revenue Stream
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {revenueStreams.map(stream => (
            <div key={stream.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#4ADE80] transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div 
                    className={`w-4 h-4 rounded-full mr-4 ${
                      stream.active ? 'bg-[#4ADE80]' : 'bg-[#9CA3AF]'
                    }`}
                  />
                  <div>
                    <h3 className="font-semibold text-[#1E2A38] text-lg">{stream.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{stream.category} • ${stream.amount.toLocaleString()}/month</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    stream.active ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {stream.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleDeleteStream(stream.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Timeline:</span> {stream.startMonth} - {stream.endMonth}
                </div>
                <div className="text-sm font-semibold" style={{ color: getCategoryColor(stream.category) }}>
                  ${(stream.amount * 12).toLocaleString()}/year
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Revenue Streams Table */}
      <Card title="Revenue Streams Overview">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300 sticky top-0 bg-white z-10">
                <th className="text-left py-4 px-4 font-bold text-gray-800 w-48 sticky top-0 bg-white">Revenue Stream</th>
                <th className="text-center py-4 px-4 font-bold text-gray-800 w-20 sticky top-0 bg-white">Category</th>
                <th className="text-center py-4 px-4 font-bold text-gray-800 w-20 sticky top-0 bg-white">Type</th>
                <th className="text-center py-4 px-4 font-bold text-gray-800 w-20 sticky top-0 bg-white">Start</th>
                <th className="text-center py-4 px-4 font-bold text-gray-800 w-20 sticky top-0 bg-white">Duration</th>
                <th className="text-right py-4 px-4 font-bold text-gray-800 w-24 sticky top-0 bg-white">Monthly</th>
                <th className="text-center py-4 px-4 font-bold text-gray-800 w-20 sticky top-0 bg-white">Annual</th>
                <th className="text-center py-4 px-4 font-bold text-gray-800 w-20 sticky top-0 bg-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {revenueStreams.map((stream, streamIndex) => (
                <tr key={stream.id} className="border-b border-gray-200 hover:bg-white/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div 
                        className={`w-4 h-4 rounded-full mr-4 ${
                          stream.active ? 'bg-[#4ADE80]' : 'bg-[#9CA3AF]'
                        }`}
                      />
                      <span className="font-semibold text-[#1E2A38]">{stream.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-sm font-medium text-gray-700">{stream.category}</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">Recurring</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">{stream.startMonth.split(' ')[0]}</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">12 months</td>
                  <td className="py-3 px-4 text-right text-sm font-bold" style={{ color: getCategoryColor(stream.category) }}>${stream.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center text-sm font-semibold text-gray-700">${(stream.amount * 12).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stream.active ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {stream.active ? 'Active' : 'Inactive'}
                      </span>
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-[120px]">
                          <button
                            onClick={() => setRevenueStreams(prev => prev.map(s => s.id === stream.id ? {...s, active: !s.active} : s))}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            {stream.active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteStream(stream.id)}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Timeline Chart */}
      <Card title="Revenue Timeline Chart">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                {/* Timeline Header */}
                <div className="flex mb-4">
                  <div className="w-48 text-sm font-bold text-gray-800 p-3 bg-gray-100 rounded-l-lg">Revenue Stream</div>
                  <div className="flex-1 grid grid-cols-12 gap-1 bg-gray-100 rounded-r-lg p-3">
                    {months.map((month, index) => (
                      <div key={index} className="text-xs font-bold text-gray-700 text-center">
                        {month.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Timeline Rows */}
                {revenueStreams.map(stream => (
                  <div key={stream.id} className="flex mb-3 items-center bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="w-48 text-sm font-medium text-[#1E2A38] p-2 truncate">
                      <div className="flex items-center">
                        <div 
                          className={`w-3 h-3 rounded-full mr-3 ${
                            stream.active ? 'bg-[#4ADE80]' : 'bg-[#9CA3AF]'
                          }`}
                        />
                        {stream.name}
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-12 gap-1">
                      {months.map((month, index) => {
                        const startIndex = getMonthIndex(stream.startMonth);
                        const endIndex = getMonthIndex(stream.endMonth);
                        const isActive = index >= startIndex && index <= endIndex && stream.active;
                        
                        return (
                          <div
                            key={index}
                            className={`h-8 rounded-lg mx-1`}
                            style={{ 
                              backgroundColor: isActive ? '#4ADE80' : 'transparent'
                            }}
                            title={isActive ? `${stream.name}: $${stream.amount.toLocaleString()}` : ''}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Legend */}
              </div>
            </div>
        </div>
      </Card>


      {/* Revenue Projection Table */}
      <Card title="12-Month Revenue Projection">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Monthly Revenue Growth</span>
            <span className="text-sm text-[#4ADE80] font-medium">+{averageGrowthRate.toFixed(1)}% avg growth</span>
          </div>
          <div className="relative h-64">
            {/* Chart Container */}
            <div className="h-48 relative">
              {/* Base Revenue Line (Blue) */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  points={projectionData.map((data, index) => {
                    const baseRevenue = startingRevenue * Math.pow(1 + revenueGrowthRate / 100, index);
                    const x = 30 + index * 60;
                    const y = 140 - (baseRevenue - startingRevenue) / 10000;
                    return `${x},${Math.max(20, Math.min(140, y))}`;
                  }).join(' ')}
                />
                {/* Data points for base revenue */}
                {projectionData.map((data, index) => {
                  const baseRevenue = startingRevenue * Math.pow(1 + revenueGrowthRate / 100, index);
                  const x = 30 + index * 60;
                  const y = 140 - (baseRevenue - startingRevenue) / 10000;
                  return (
                    <circle 
                      key={index} 
                      cx={x} 
                      cy={Math.max(20, Math.min(140, y))} 
                      r="4" 
                      fill="#3B82F6"
                      title={`Base Revenue: $${baseRevenue.toLocaleString()}`}
                    />
                  );
                })}
              </svg>
              
              {/* Driver Impact Line (Green) */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
                <polyline
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="3"
                  points={projectionData.map((data, index) => {
                    const x = 30 + index * 60;
                    const y = 140 - (data.revenue - startingRevenue) / 10000;
                    return `${x},${Math.max(20, Math.min(140, y))}`;
                  }).join(' ')}
                />
                {/* Data points for total revenue */}
                {projectionData.map((data, index) => {
                  const x = 30 + index * 60;
                  const y = 140 - (data.revenue - startingRevenue) / 10000;
                  return (
                    <circle 
                      key={index} 
                      cx={x} 
                      cy={Math.max(20, Math.min(140, y))} 
                      r="4" 
                      fill="#4ADE80"
                      title={`Total Revenue: $${data.revenue.toLocaleString()}`}
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* Month Labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                <span key={index} className="flex-1 text-center">{month}</span>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#3B82F6] rounded mr-2"></div>
              <span className="text-sm text-gray-600">Base Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#4ADE80] rounded mr-2"></div>
              <span className="text-sm text-gray-600">Total Revenue (with drivers)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-[#3AB7BF]">${projectionData[projectionData.length - 1]?.revenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Final Month</p>
              <p className="text-xs text-[#4ADE80]">+{projectionData[projectionData.length - 1]?.growth.toFixed(1)}% vs Start</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#4ADE80]">${(totalProjectedRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500">Total 12M</p>
              <p className="text-xs text-[#4ADE80]">+{averageGrowthRate.toFixed(1)}% avg growth</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#F59E0B]">${((totalProjectedRevenue - startingRevenue * 12) / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500">Driver Impact</p>
              <p className="text-xs text-[#4ADE80]">Additional revenue</p>
            </div>
          </div>
        </div>
      </Card>


      {/* Add Revenue Stream Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Add Revenue Stream</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Stream Name</label>
                <input
                  type="text"
                  value={newStream.name}
                  onChange={(e) => setNewStream({...newStream, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                  placeholder="e.g., Enterprise Sales"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Amount ($)</label>
                  <input
                    type="number"
                    value={newStream.amount}
                    onChange={(e) => setNewStream({...newStream, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newStream.category}
                    onChange={(e) => setNewStream({...newStream, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                  >
                    <option value="Product">Product</option>
                    <option value="Service">Service</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Other">Other</option>
                    <option value="Custom">Custom (Enter your own)</option>
                  </select>
                </div>
                
                {newStream.category === 'Custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Category Name</label>
                    <input
                      type="text"
                      value={newStream.customCategory}
                      onChange={(e) => setNewStream({...newStream, customCategory: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                      placeholder="Enter custom category name"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
                  <select
                    value={newStream.startMonth}
                    onChange={(e) => setNewStream({...newStream, startMonth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Month</label>
                  <select
                    value={newStream.endMonth}
                    onChange={(e) => setNewStream({...newStream, endMonth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStream}
                disabled={!newStream.name.trim() || !newStream.amount || (newStream.category === 'Custom' && !newStream.customCategory.trim())}
                className="px-4 py-2 bg-[#4ADE80] text-white rounded-lg hover:bg-[#3BC66F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Revenue Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};








export default RevenueRunway
