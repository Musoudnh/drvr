import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Target, BarChart3, CheckCircle, X, Save, AlertTriangle, Clock, User, Edit3, Plus, Eye, Filter, Download, Trash2 } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface ForecastItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  period: string;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  submittedBy: string;
  submittedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  type: 'revenue' | 'expense' | 'investment';
}

const Forecasting: React.FC = () => {
  const [forecastItems, setForecastItems] = useState<ForecastItem[]>([
    {
      id: '1',
      category: 'Product Sales',
      description: 'Q2 product sales forecast based on pipeline analysis',
      amount: 485000,
      period: 'Q2 2025',
      confidence: 87,
      status: 'pending',
      submittedBy: 'Sarah Johnson',
      submittedAt: new Date('2025-01-15'),
      type: 'revenue'
    },
    {
      id: '2',
      category: 'Marketing Expenses',
      description: 'Digital marketing campaign budget for Q2',
      amount: 125000,
      period: 'Q2 2025',
      confidence: 92,
      status: 'pending',
      submittedBy: 'Michael Chen',
      submittedAt: new Date('2025-01-14'),
      type: 'expense'
    },
    {
      id: '3',
      category: 'Service Revenue',
      description: 'Consulting services revenue projection',
      amount: 245000,
      period: 'Q2 2025',
      confidence: 78,
      status: 'approved',
      submittedBy: 'Emily Rodriguez',
      submittedAt: new Date('2025-01-12'),
      approvedBy: 'John Doe',
      approvedAt: new Date('2025-01-13'),
      type: 'revenue'
    },
    {
      id: '4',
      category: 'Technology Investment',
      description: 'New software infrastructure investment',
      amount: 85000,
      period: 'Q2 2025',
      confidence: 95,
      status: 'rejected',
      submittedBy: 'David Kim',
      submittedAt: new Date('2025-01-10'),
      rejectedBy: 'John Doe',
      rejectedAt: new Date('2025-01-11'),
      rejectionReason: 'Budget constraints for Q2, defer to Q3',
      type: 'investment'
    }
  ]);

  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ForecastItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState<{ type: 'approve' | 'reject'; itemId: string } | null>(null);

  const handleApprove = async (item: ForecastItem) => {
    if (window.confirm(`Are you sure you want to approve "${item.category}" for ${item.period}? This will add $${item.amount.toLocaleString()} to the budget.`)) {
      setProcessingItems(prev => new Set(prev).add(item.id));
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setForecastItems(prev => prev.map(forecast =>
          forecast.id === item.id
            ? {
                ...forecast,
                status: 'approved' as const,
                approvedBy: 'Current User',
                approvedAt: new Date()
              }
            : forecast
        ));
        
        // Show success message
        setShowSuccessMessage({ type: 'approve', itemId: item.id });
        setTimeout(() => setShowSuccessMessage(null), 3000);
        
      } catch (error) {
        alert('Failed to approve forecast item. Please try again.');
      } finally {
        setProcessingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      }
    }
  };

  const handleReject = (item: ForecastItem) => {
    setSelectedItem(item);
    setShowRejectionModal(true);
  };

  const confirmReject = async () => {
    if (!selectedItem || !rejectionReason.trim()) return;
    
    setProcessingItems(prev => new Set(prev).add(selectedItem.id));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setForecastItems(prev => prev.map(forecast =>
        forecast.id === selectedItem.id
          ? {
              ...forecast,
              status: 'rejected' as const,
              rejectedBy: 'Current User',
              rejectedAt: new Date(),
              rejectionReason: rejectionReason
            }
          : forecast
      ));
      
      // Show success message
      setShowSuccessMessage({ type: 'reject', itemId: selectedItem.id });
      setTimeout(() => setShowSuccessMessage(null), 3000);
      
      setShowRejectionModal(false);
      setSelectedItem(null);
      setRejectionReason('');
      
    } catch (error) {
      alert('Failed to reject forecast item. Please try again.');
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedItem.id);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-[#4ADE80]/20 text-[#4ADE80]';
      case 'rejected': return 'bg-[#F87171]/20 text-[#F87171]';
      case 'pending': return 'bg-[#F59E0B]/20 text-[#F59E0B]';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revenue': return '#4ADE80';
      case 'expense': return '#F87171';
      case 'investment': return '#8B5CF6';
      default: return '#3AB7BF';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pendingItems = forecastItems.filter(item => item.status === 'pending');
  const approvedItems = forecastItems.filter(item => item.status === 'approved');
  const rejectedItems = forecastItems.filter(item => item.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Budget Forecasting</h2>
          <p className="text-gray-600 mt-1">Review and approve budget forecasts for upcoming periods</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Forecast
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className={`p-4 rounded-lg border-l-4 ${
          showSuccessMessage.type === 'approve' 
            ? 'bg-[#4ADE80]/10 border-[#4ADE80] text-[#4ADE80]'
            : 'bg-[#F87171]/10 border-[#F87171] text-[#F87171]'
        }`}>
          <div className="flex items-center">
            {showSuccessMessage.type === 'approve' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <X className="w-5 h-5 mr-2" />
            )}
            <span className="font-medium">
              Forecast item {showSuccessMessage.type === 'approve' ? 'approved' : 'rejected'} successfully!
            </span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">{pendingItems.length}</p>
              <p className="text-sm text-gray-600 mt-1">Items waiting</p>
            </div>
            <Clock className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">{approvedItems.length}</p>
              <p className="text-sm text-gray-600 mt-1">Added to budget</p>
            </div>
            <CheckCircle className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">{rejectedItems.length}</p>
              <p className="text-sm text-gray-600 mt-1">Not included</p>
            </div>
            <X className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget Impact</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">
                {formatCurrency(approvedItems.reduce((sum, item) => sum + item.amount, 0))}
              </p>
              <p className="text-sm text-gray-600 mt-1">Approved amount</p>
            </div>
            <DollarSign className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>
      </div>

      {/* Forecast Items Table */}
      <Card title="Forecast Items Awaiting Approval">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Period</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Confidence</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forecastItems.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: getTypeColor(item.type) }}
                        />
                        <span className="font-medium text-[#1E2A38]">{item.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{item.description}</td>
                    <td className="py-3 px-4 text-right font-bold" style={{ color: getTypeColor(item.type) }}>
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{item.period}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-medium text-gray-700">{item.confidence}%</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.status === 'pending' && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(item)}
                            disabled={processingItems.has(item.id)}
                            className="px-3 py-1 bg-[#4ADE80] text-white rounded text-xs font-medium hover:bg-[#3BC66F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                            aria-label={`Approve ${item.category} forecast`}
                          >
                            {processingItems.has(item.id) ? (
                              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item)}
                            disabled={processingItems.has(item.id)}
                            className="px-3 py-1 bg-[#F87171] text-white rounded text-xs font-medium hover:bg-[#F56565] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                            aria-label={`Reject ${item.category} forecast`}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                      {item.status === 'approved' && (
                        <div className="text-center">
                          <p className="text-xs text-[#4ADE80] font-medium">✓ Approved</p>
                          <p className="text-xs text-gray-500">by {item.approvedBy}</p>
                        </div>
                      )}
                      {item.status === 'rejected' && (
                        <div className="text-center">
                          <p className="text-xs text-[#F87171] font-medium">✗ Rejected</p>
                          <p className="text-xs text-gray-500">by {item.rejectedBy}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                  
                  {/* Expanded Details Row */}
                  <tr>
                    <td colSpan={7} className="py-0">
                      <div className="bg-gray-50 border-l-4 border-[#3AB7BF] p-4 mx-4 mb-2 rounded">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-[#1E2A38] mb-2">Submission Details</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center">
                                <User className="w-3 h-3 text-gray-400 mr-2" />
                                <span className="text-gray-600">Submitted by: {item.submittedBy}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 text-gray-400 mr-2" />
                                <span className="text-gray-600">Date: {item.submittedAt.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <Target className="w-3 h-3 text-gray-400 mr-2" />
                                <span className="text-gray-600">Type: {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-[#1E2A38] mb-2">Forecast Analysis</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Confidence Level:</span>
                                <span className="font-medium text-[#1E2A38]">{item.confidence}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Budget Impact:</span>
                                <span className="font-medium" style={{ color: getTypeColor(item.type) }}>
                                  {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Period:</span>
                                <span className="font-medium text-[#1E2A38]">{item.period}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            {item.status === 'pending' && (
                              <div>
                                <h4 className="font-medium text-[#1E2A38] mb-3">Approval Actions</h4>
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => handleApprove(item)}
                                    disabled={processingItems.has(item.id)}
                                    className="w-full px-4 py-2 bg-[#4ADE80] text-white rounded-lg font-medium hover:bg-[#3BC66F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                                    aria-label={`Approve ${item.category} forecast and add to budget`}
                                  >
                                    {processingItems.has(item.id) ? (
                                      <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Approving...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve & Add to Budget
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleReject(item)}
                                    disabled={processingItems.has(item.id)}
                                    className="w-full px-4 py-2 bg-[#F87171] text-white rounded-lg font-medium hover:bg-[#F56565] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                                    aria-label={`Reject ${item.category} forecast`}
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject Forecast
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {item.status === 'approved' && (
                              <div>
                                <h4 className="font-medium text-[#1E2A38] mb-2">Approval Details</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center">
                                    <CheckCircle className="w-3 h-3 text-[#4ADE80] mr-2" />
                                    <span className="text-gray-600">Approved by: {item.approvedBy}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 text-gray-400 mr-2" />
                                    <span className="text-gray-600">Date: {item.approvedAt?.toLocaleDateString()}</span>
                                  </div>
                                  <div className="p-2 bg-[#4ADE80]/10 rounded text-xs text-[#4ADE80] font-medium">
                                    ✓ Added to {item.period} budget
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {item.status === 'rejected' && (
                              <div>
                                <h4 className="font-medium text-[#1E2A38] mb-2">Rejection Details</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center">
                                    <X className="w-3 h-3 text-[#F87171] mr-2" />
                                    <span className="text-gray-600">Rejected by: {item.rejectedBy}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 text-gray-400 mr-2" />
                                    <span className="text-gray-600">Date: {item.rejectedAt?.toLocaleDateString()}</span>
                                  </div>
                                  {item.rejectionReason && (
                                    <div className="p-2 bg-[#F87171]/10 rounded text-xs text-[#F87171]">
                                      <strong>Reason:</strong> {item.rejectionReason}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Budget Impact Summary */}
      <Card title="Budget Impact Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <TrendingUp className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Revenue Forecasts</h3>
            <p className="text-2xl font-bold text-[#4ADE80]">
              {formatCurrency(approvedItems.filter(i => i.type === 'revenue').reduce((sum, item) => sum + item.amount, 0))}
            </p>
            <p className="text-sm text-gray-600">Approved revenue</p>
          </div>
          
          <div className="text-center p-4 bg-[#F87171]/10 rounded-lg">
            <BarChart3 className="w-8 h-8 text-[#F87171] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Expense Forecasts</h3>
            <p className="text-2xl font-bold text-[#F87171]">
              {formatCurrency(approvedItems.filter(i => i.type === 'expense').reduce((sum, item) => sum + item.amount, 0))}
            </p>
            <p className="text-sm text-gray-600">Approved expenses</p>
          </div>
          
          <div className="text-center p-4 bg-[#8B5CF6]/10 rounded-lg">
            <Target className="w-8 h-8 text-[#8B5CF6] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Investments</h3>
            <p className="text-2xl font-bold text-[#8B5CF6]">
              {formatCurrency(approvedItems.filter(i => i.type === 'investment').reduce((sum, item) => sum + item.amount, 0))}
            </p>
            <p className="text-sm text-gray-600">Approved investments</p>
          </div>
        </div>
      </Card>

      {/* Rejection Modal */}
      {showRejectionModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Reject Forecast</h3>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setSelectedItem(null);
                  setRejectionReason('');
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-[#F87171]/10 rounded-lg border border-[#F87171]/20">
                <h4 className="font-medium text-[#1E2A38] mb-2">Rejecting: {selectedItem.category}</h4>
                <p className="text-sm text-gray-600">Amount: {formatCurrency(selectedItem.amount)}</p>
                <p className="text-sm text-gray-600">Period: {selectedItem.period}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this forecast..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Important</p>
                    <p className="text-sm text-yellow-700">Rejecting this forecast will not add it to the budget. The submitter will be notified of the rejection.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setSelectedItem(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim() || (selectedItem && processingItems.has(selectedItem.id))}
                className="px-4 py-2 bg-[#F87171] text-white rounded-lg hover:bg-[#F56565] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {selectedItem && processingItems.has(selectedItem.id) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Confirm Rejection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecasting;