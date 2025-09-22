import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Plus, 
  X, 
  Calendar, 
  Tag, 
  Upload, 
  Save, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Play,
  Pause,
  Star
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface Scenario {
  id: string;
  name: string;
  description: string;
  category: 'revenue' | 'expense' | 'growth' | 'market' | 'custom';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  tags: string[];
  notes: string;
  attachments: File[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assumptions: {
    revenueGrowth: number;
    marketGrowth: number;
    pricingChange: number;
  };
  results: {
    revenue: number;
    profit: number;
    cashFlow: number;
  };
}

const Forecasting: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'Base Case Forecast',
      description: 'Conservative growth scenario based on current market conditions',
      category: 'revenue',
      priority: 'high',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'active',
      tags: ['baseline', 'conservative', 'q1-2025'],
      notes: 'This scenario assumes steady growth with no major market disruptions.',
      attachments: [],
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15'),
      createdBy: 'Sarah Johnson',
      assumptions: {
        revenueGrowth: 15.4,
        marketGrowth: 8.2,
        pricingChange: 0
      },
      results: {
        revenue: 10200000,
        profit: 2856000,
        cashFlow: 2244000
      }
    },
    {
      id: '2',
      name: 'Aggressive Growth',
      description: 'Optimistic scenario with new product launches and market expansion',
      category: 'growth',
      priority: 'medium',
      startDate: '2025-03-01',
      endDate: '2025-12-31',
      status: 'draft',
      tags: ['optimistic', 'product-launch', 'expansion'],
      notes: 'Assumes successful product launch and 25% market share increase.',
      attachments: [],
      createdAt: new Date('2025-01-12'),
      updatedAt: new Date('2025-01-14'),
      createdBy: 'Michael Chen',
      assumptions: {
        revenueGrowth: 28.7,
        marketGrowth: 12.5,
        pricingChange: 8
      },
      results: {
        revenue: 14800000,
        profit: 4292000,
        cashFlow: 3654000
      }
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'revenue' as const,
    priority: 'medium' as const,
    startDate: '',
    endDate: '',
    status: 'draft' as const,
    tags: [] as string[],
    notes: '',
    attachments: [] as File[]
  });

  const [currentTag, setCurrentTag] = useState('');
  const [isLoading, setSaveLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [preservedFormData, setPreservedFormData] = useState<typeof formData | null>(null);

  // Preserve form data when sidebar closes
  useEffect(() => {
    if (!sidebarOpen && (formData.name || formData.description)) {
      setPreservedFormData(formData);
    }
  }, [sidebarOpen, formData]);

  // Restore form data when sidebar reopens
  useEffect(() => {
    if (sidebarOpen && preservedFormData) {
      setFormData(preservedFormData);
      setPreservedFormData(null);
    }
  }, [sidebarOpen, preservedFormData]);

  const openSidebar = () => {
    setSidebarOpen(true);
    setFormErrors({});
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(files)]
      }));
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(file => file !== fileToRemove)
    }));
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Scenario name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = 'End date must be after start date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaveLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newScenario: Scenario = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Current User',
      assumptions: {
        revenueGrowth: 15.4,
        marketGrowth: 8.2,
        pricingChange: 0
      },
      results: {
        revenue: 10200000,
        profit: 2856000,
        cashFlow: 2244000
      }
    };

    setScenarios(prev => [...prev, newScenario]);
    setSaveLoading(false);
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: 'revenue',
      priority: 'medium',
      startDate: '',
      endDate: '',
      status: 'draft',
      tags: [],
      notes: '',
      attachments: []
    });

    setTimeout(() => {
      setShowSuccess(false);
      closeSidebar();
    }, 1500);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      category: 'revenue',
      priority: 'medium',
      startDate: '',
      endDate: '',
      status: 'draft',
      tags: [],
      notes: '',
      attachments: []
    });
    setFormErrors({});
    closeSidebar();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#4ADE80]/20 text-[#4ADE80]';
      case 'draft': return 'bg-[#F59E0B]/20 text-[#F59E0B]';
      case 'completed': return 'bg-[#3AB7BF]/20 text-[#3AB7BF]';
      case 'archived': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-[#F87171]';
      case 'medium': return 'text-[#F59E0B]';
      case 'low': return 'text-[#4ADE80]';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return TrendingUp;
      case 'expense': return BarChart3;
      case 'growth': return Target;
      case 'market': return Eye;
      default: return Settings;
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Financial Forecasting</h2>
          <p className="text-gray-600 mt-1">Create and manage financial scenarios and projections</p>
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
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Scenarios</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">{scenarios.filter(s => s.status === 'active').length}</p>
              <p className="text-sm text-gray-600 mt-1">Running models</p>
            </div>
            <Target className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Draft Scenarios</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">{scenarios.filter(s => s.status === 'draft').length}</p>
              <p className="text-sm text-gray-600 mt-1">In development</p>
            </div>
            <Edit3 className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">87%</p>
              <p className="text-sm text-gray-600 mt-1">Model performance</p>
            </div>
            <CheckCircle className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">2h</p>
              <p className="text-sm text-gray-600 mt-1">Ago</p>
            </div>
            <RefreshCw className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="flex items-end">
          <button
            onClick={openSidebar}
            className="font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-[#3AB7BF] text-[#3AB7BF] hover:bg-[#3AB7BF] hover:text-white focus:ring-[#3AB7BF] px-4 py-2 text-sm w-full"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Scenarios
          </button>
        </div>
      </div>

      {/* Scenarios List */}
      <Card title="Scenario Management">
        <div className="space-y-4">
          {scenarios.map(scenario => {
            const CategoryIcon = getCategoryIcon(scenario.category);
            return (
              <div key={scenario.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#3AB7BF] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-[#3AB7BF]/10 rounded-lg flex items-center justify-center mr-4">
                      <CategoryIcon className="w-5 h-5 text-[#3AB7BF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1E2A38]">{scenario.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scenario.status)}`}>
                          {scenario.status}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(scenario.priority)}`}>
                          {scenario.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-bold text-[#4ADE80]">${(scenario.results.revenue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Profit</p>
                    <p className="font-bold text-[#3AB7BF]">${(scenario.results.profit / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cash Flow</p>
                    <p className="font-bold text-[#F59E0B]">${(scenario.results.cashFlow / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
                
                {scenario.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {scenario.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-[#3AB7BF]/10 text-[#3AB7BF] rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`fixed top-0 left-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80]">
            <div>
              <h3 className="text-xl font-semibold text-white">Add New Scenario</h3>
              <p className="text-blue-100 text-sm">Create a financial forecasting scenario</p>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mx-6 mt-4 p-4 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-[#4ADE80] mr-3" />
              <span className="text-sm font-medium text-[#4ADE80]">Scenario saved successfully!</span>
            </div>
          )}

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Scenario Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Scenario Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent transition-colors ${
                  formErrors.name ? 'border-[#F87171]' : 'border-gray-300'
                }`}
                placeholder="Enter scenario name"
              />
              {formErrors.name && (
                <p className="text-sm text-[#F87171] mt-1 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent transition-colors resize-none ${
                  formErrors.description ? 'border-[#F87171]' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Describe the scenario assumptions and context"
              />
              {formErrors.description && (
                <p className="text-sm text-[#F87171] mt-1 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                  <option value="growth">Growth</option>
                  <option value="market">Market</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="space-y-2">
                  {['high', 'medium', 'low'].map(priority => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={formData.priority === priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-4 h-4 text-[#3AB7BF] border-gray-300 focus:ring-[#3AB7BF] mr-3"
                      />
                      <span className={`text-sm font-medium capitalize ${getPriorityColor(priority)}`}>
                        {priority}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent transition-colors ${
                      formErrors.startDate ? 'border-[#F87171]' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.startDate && (
                  <p className="text-sm text-[#F87171] mt-1 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent transition-colors ${
                      formErrors.endDate ? 'border-[#F87171]' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.endDate && (
                  <p className="text-sm text-[#F87171] mt-1 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {formErrors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                      placeholder="Add tag"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleAddTag}
                    disabled={!currentTag.trim()}
                  >
                    Add
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-[#3AB7BF]/10 text-[#3AB7BF] rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-[#F87171] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent resize-none"
                rows={4}
                placeholder="Add any additional notes or assumptions"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attachments
              </label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#3AB7BF] transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload files</p>
                    <p className="text-xs text-gray-500">PDF, DOC, XLS, CSV up to 10MB</p>
                  </label>
                </div>
                
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-[#1E2A38]">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(file)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-[#3AB7BF] hover:bg-[#2A9BA3] focus:ring-[#3AB7BF]"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Scenario
                  </>
                )}
              </Button>
            </div>
            
            {/* Form Status */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                {Object.keys(formErrors).length > 0 
                  ? `${Object.keys(formErrors).length} field(s) need attention`
                  : 'All fields are valid'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Overlay Effect */}
      <style jsx>{`
        .main-content {
          transition: transform 0.3s ease-in-out, filter 0.3s ease-in-out;
        }
        .main-content.sidebar-open {
          transform: translateX(20px);
          filter: brightness(0.7);
        }
      `}</style>
    </div>
  );
};

export default Forecasting;