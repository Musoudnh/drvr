import React, { useState, useEffect } from 'react';
import { X, Plus, Calculator, TrendingUp, Users, Target, Calendar, FileText, Zap, Tag } from 'lucide-react';
import {
  DriverTemplate,
  DriverInstance,
  DriverType,
  InputField,
  DriverInputs,
} from '../../types/driverLibrary';
import {
  getDriverTemplates,
  createDriverInstance,
  getDriverInstances,
  updateDriverInstance,
  deleteDriverInstance,
  calculateAndStoreResults,
  DEFAULT_DRIVER_TEMPLATES,
  createDriverTemplate,
} from '../../services/driverLibraryService';

interface DriverLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  forecastVersionId?: string;
  onDriverApplied?: (instanceId: string) => void;
}

const DRIVER_ICONS: Record<DriverType, React.ReactNode> = {
  volume_price: <TrendingUp className="w-5 h-5" />,
  cac: <Users className="w-5 h-5" />,
  retention: <Target className="w-5 h-5" />,
  funnel: <Calculator className="w-5 h-5" />,
  seasonality: <Calendar className="w-5 h-5" />,
  contract_terms: <FileText className="w-5 h-5" />,
  sales_productivity: <Zap className="w-5 h-5" />,
  discounting: <Tag className="w-5 h-5" />,
};

const DriverLibraryModal: React.FC<DriverLibraryModalProps> = ({
  isOpen,
  onClose,
  forecastVersionId,
  onDriverApplied,
}) => {
  const [templates, setTemplates] = useState<DriverTemplate[]>([]);
  const [instances, setInstances] = useState<DriverInstance[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DriverTemplate | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formInputs, setFormInputs] = useState<DriverInputs>({});
  const [instanceName, setInstanceName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'instances'>('library');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, forecastVersionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [templatesData, instancesData] = await Promise.all([
        getDriverTemplates(),
        getDriverInstances(forecastVersionId),
      ]);

      if (templatesData.length === 0) {
        await initializeDefaultTemplates();
      } else {
        setTemplates(templatesData);
      }

      setInstances(instancesData);
    } catch (error) {
      console.error('Failed to load driver data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultTemplates = async () => {
    try {
      const createdTemplates = await Promise.all(
        DEFAULT_DRIVER_TEMPLATES.map(template => createDriverTemplate(template))
      );
      setTemplates(createdTemplates);
    } catch (error) {
      console.error('Failed to initialize templates:', error);
    }
  };

  const handleSelectTemplate = (template: DriverTemplate) => {
    setSelectedTemplate(template);
    setShowCreateForm(true);

    const defaultInputs: DriverInputs = {};
    template.input_schema.forEach(field => {
      defaultInputs[field.name] = field.defaultValue || 0;
    });
    setFormInputs(defaultInputs);
    setInstanceName(`${template.name} - ${new Date().toLocaleDateString()}`);

    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(nextYear.toISOString().split('T')[0]);
  };

  const handleInputChange = (fieldName: string, value: string | number) => {
    setFormInputs(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleCreateInstance = async () => {
    if (!selectedTemplate || !instanceName || !startDate || !endDate) return;

    try {
      setLoading(true);

      const instance = await createDriverInstance({
        template_id: selectedTemplate.id,
        forecast_version_id: forecastVersionId,
        name: instanceName,
        inputs: formInputs,
        configuration: {
          period_start: startDate,
          period_end: endDate,
          period_type: 'month',
        },
      });

      await calculateAndStoreResults(
        instance.id,
        new Date(startDate),
        new Date(endDate),
        'month'
      );

      if (onDriverApplied) {
        onDriverApplied(instance.id);
      }

      await loadData();
      setShowCreateForm(false);
      setSelectedTemplate(null);
      setActiveTab('instances');
    } catch (error) {
      console.error('Failed to create driver instance:', error);
      alert('Failed to create driver instance');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstance = async (instanceId: string) => {
    if (!confirm('Are you sure you want to delete this driver instance?')) return;

    try {
      setLoading(true);
      await deleteDriverInstance(instanceId);
      await loadData();
    } catch (error) {
      console.error('Failed to delete instance:', error);
      alert('Failed to delete driver instance');
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (field: InputField) => {
    const value = formInputs[field.name] || '';

    if (field.type === 'array') {
      return (
        <div key={field.name} className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <p className="text-xs text-gray-500">{field.description}</p>
          <input
            type="text"
            value={Array.isArray(value) ? value.join(', ') : value}
            onChange={(e) => {
              const values = e.target.value.split(',').map(v => parseFloat(v.trim()) || 0);
              handleInputChange(field.name, values);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter comma-separated values"
          />
        </div>
      );
    }

    return (
      <div key={field.name} className="space-y-2">
        <label className="block text-xs font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}
        <div className="relative">
          {(field.type === 'currency' || field.type === 'percentage') && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {field.type === 'currency' ? '$' : '%'}
            </span>
          )}
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || 0)}
            min={field.min}
            max={field.max}
            step={field.type === 'percentage' ? 0.1 : field.type === 'currency' ? 1 : 'any'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              field.type === 'currency' || field.type === 'percentage' ? 'pl-8' : ''
            }`}
          />
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 z-50 w-[800px] max-w-[90vw] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Sales Driver Library</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {showCreateForm ? (
          <div className="p-6 overflow-y-auto flex-1">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setSelectedTemplate(null);
              }}
              className="mb-4 text-purple-600 hover:text-purple-700 text-xs font-medium"
            >
              ← Back to Library
            </button>

            {selectedTemplate && (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="text-purple-600 mt-1">
                      {DRIVER_ICONS[selectedTemplate.type as DriverType]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedTemplate.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {selectedTemplate.description}
                      </p>
                      <div className="mt-2 p-2 bg-white rounded border border-purple-200">
                        <p className="text-xs text-gray-500 font-mono">
                          {selectedTemplate.formula}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Instance Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={instanceName}
                    onChange={(e) => setInstanceName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter a name for this driver instance"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Input Parameters</h4>
                  {selectedTemplate.input_schema.map(renderInputField)}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setSelectedTemplate(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateInstance}
                    disabled={loading || !instanceName || !startDate || !endDate}
                    className="px-6 py-2 bg-[#9333EA] text-white rounded-lg hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create & Calculate'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="border-b border-gray-200">
              <div className="flex gap-4 px-6">
                <button
                  onClick={() => setActiveTab('library')}
                  className={`py-3 px-1 border-b-2 font-medium text-xs transition-colors ${
                    activeTab === 'library'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Driver Library ({templates.length})
                </button>
                <button
                  onClick={() => setActiveTab('instances')}
                  className={`py-3 px-1 border-b-2 font-medium text-xs transition-colors ${
                    activeTab === 'instances'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Active Drivers ({instances.length})
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'library' ? (
                <div className="grid grid-cols-2 gap-4">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-gray-400 group-hover:text-purple-600 transition-colors">
                          {DRIVER_ICONS[template.type as DriverType]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {template.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {template.input_schema.length} inputs
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {instances.length === 0 ? (
                    <div className="text-center py-12">
                      <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No active drivers yet</p>
                      <button
                        onClick={() => setActiveTab('library')}
                        className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Browse Driver Library
                      </button>
                    </div>
                  ) : (
                    instances.map(instance => (
                      <div
                        key={instance.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{instance.name}</h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {instance.template?.name}
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                Period: {instance.configuration.period_start} to{' '}
                                {instance.configuration.period_end}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteInstance(instance.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DriverLibraryModal;
