import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import Button from '../UI/Button';
import { supabase } from '../../lib/supabase';
import { taxCalculationService } from '../../services/taxCalculationService';
import { StateTaxRate, RoleFormData } from '../../types/hiring';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleAdded: () => void;
  editRole?: any;
}

export function AddRoleModal({ isOpen, onClose, onRoleAdded, editRole }: AddRoleModalProps) {
  const [states, setStates] = useState<StateTaxRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [formData, setFormData] = useState<RoleFormData>({
    role_name: '',
    description: '',
    location_state: '',
    start_date: '',
    employment_type: 'salary',
    worker_classification: 'w2',
    hourly_rate: 0,
    hours_per_week: 40,
    annual_salary: 0,
  });
  const [endDate, setEndDate] = useState('');
  const [noEndDate, setNoEndDate] = useState(true);
  const [taxBreakdown, setTaxBreakdown] = useState<any>(null);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [startMonthOpen, setStartMonthOpen] = useState(false);
  const [startDayOpen, setStartDayOpen] = useState(false);
  const [startYearOpen, setStartYearOpen] = useState(false);
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const [endDayOpen, setEndDayOpen] = useState(false);
  const [endYearOpen, setEndYearOpen] = useState(false);

  const [startMonth, setStartMonth] = useState('');
  const [startDay, setStartDay] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');
  const [endYear, setEndYear] = useState('');

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const getDaysInMonth = (month: string, year: string) => {
    if (!month || !year) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  useEffect(() => {
    if (isOpen) {
      loadStates();
    }
  }, [isOpen]);

  const loadStates = async () => {
    setLoadingStates(true);
    try {
      const { data, error } = await supabase
        .from('state_tax_rates')
        .select('*')
        .order('state_name');

      console.log('Direct query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      if (data) {
        console.log('States loaded successfully:', data.length);
        setStates(data);
      }
    } catch (error) {
      console.error('Error loading states:', error);
    } finally {
      setLoadingStates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taxCalc = await taxCalculationService.calculateFullyLoadedCost(
        formData.employment_type,
        formData.worker_classification,
        formData.hourly_rate,
        formData.hours_per_week,
        formData.annual_salary,
        formData.location_state
      );

      const { data: role, error: roleError } = await supabase
        .from('hiring_roles')
        .insert({
          role_name: formData.role_name,
          description: formData.description,
          location_state: formData.location_state,
          start_date: formData.start_date,
          employment_type: formData.employment_type,
          worker_classification: formData.worker_classification,
          hourly_rate: formData.hourly_rate,
          hours_per_week: formData.hours_per_week,
          annual_salary: formData.annual_salary,
          base_compensation: taxCalc.baseCompensation,
          total_loaded_cost: taxCalc.totalLoadedCost,
        })
        .select()
        .single();

      if (roleError) throw roleError;

      if (role && formData.worker_classification === 'w2') {
        await taxCalculationService.saveTaxBreakdown(role.id, taxCalc.taxes);
      }

      onRoleAdded();
      handleClose();
    } catch (error) {
      console.error('Error adding role:', error);
      alert('Failed to add role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      role_name: '',
      description: '',
      location_state: '',
      start_date: '',
      employment_type: 'salary',
      worker_classification: 'w2',
      hourly_rate: 0,
      hours_per_week: 40,
      annual_salary: 0,
    });
    setEndDate('');
    setNoEndDate(true);
    setTaxBreakdown(null);
    setStateDropdownOpen(false);
    setStartMonthOpen(false);
    setStartDayOpen(false);
    setStartYearOpen(false);
    setEndMonthOpen(false);
    setEndDayOpen(false);
    setEndYearOpen(false);
    setStartMonth('');
    setStartDay('');
    setStartYear('');
    setEndMonth('');
    setEndDay('');
    setEndYear('');
    onClose();
  };

  useEffect(() => {
    if (formData.worker_classification === 'w2' &&
        formData.location_state &&
        (formData.annual_salary > 0 || formData.hourly_rate > 0)) {
      calculateTaxes();
    } else {
      setTaxBreakdown(null);
    }
  }, [formData.worker_classification, formData.location_state, formData.annual_salary,
      formData.hourly_rate, formData.hours_per_week, formData.employment_type]);

  const calculateTaxes = async () => {
    try {
      const taxCalc = await taxCalculationService.calculateFullyLoadedCost(
        formData.employment_type,
        formData.worker_classification,
        formData.hourly_rate,
        formData.hours_per_week,
        formData.annual_salary,
        formData.location_state
      );
      setTaxBreakdown(taxCalc);
    } catch (error) {
      console.error('Error calculating taxes:', error);
      setTaxBreakdown(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={handleClose} />
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl z-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#101010]">{editRole ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form id="employee-form" onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-medium text-[#101010] mb-2">
              Role Name *
            </label>
            <input
              type="text"
              required
              value={formData.role_name}
              onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#101010] mb-2">
              Job Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent"
              placeholder="Detailed job description and responsibilities"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#101010] mb-2">
                Location (State) *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                  disabled={loadingStates}
                >
                  <span className="text-sm text-gray-900">
                    {formData.location_state
                      ? states.find(s => s.state_code === formData.location_state)?.state_name || 'Select state'
                      : loadingStates ? 'Loading states...' : 'Select state'
                    }
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {stateDropdownOpen && !loadingStates && states.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {states.map((state) => (
                      <button
                        key={state.state_code}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, location_state: state.state_code });
                          setStateDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                      >
                        {state.state_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {!loadingStates && states.length === 0 && (
                <p className="text-xs text-red-600 mt-1">No states available. Check console for errors.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#101010] mb-2">
                Start Date *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Month Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStartMonthOpen(!startMonthOpen)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-900">
                      {startMonth ? months.find(m => m.value === startMonth)?.label : 'Month'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {startMonthOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {months.map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => {
                            setStartMonth(m.value);
                            const date = `${startYear || currentYear}-${m.value}-${startDay || '01'}`;
                            setFormData({ ...formData, start_date: date });
                            setStartMonthOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Day Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStartDayOpen(!startDayOpen)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-900">
                      {startDay || 'Day'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {startDayOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {Array.from({ length: getDaysInMonth(startMonth, startYear) }, (_, i) => i + 1).map(d => {
                        const dayStr = d.toString().padStart(2, '0');
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => {
                              setStartDay(dayStr);
                              const date = `${startYear || currentYear}-${startMonth || '01'}-${dayStr}`;
                              setFormData({ ...formData, start_date: date });
                              setStartDayOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Year Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStartYearOpen(!startYearOpen)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-900">
                      {startYear || 'Year'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {startYearOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {years.map(y => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => {
                            setStartYear(y.toString());
                            const date = `${y}-${startMonth || '01'}-${startDay || '01'}`;
                            setFormData({ ...formData, start_date: date });
                            setStartYearOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#101010] mb-2">
              End Date
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="noEndDate"
                  checked={noEndDate}
                  onChange={(e) => {
                    setNoEndDate(e.target.checked);
                    if (e.target.checked) {
                      setEndDate('');
                      setEndMonth('');
                      setEndDay('');
                      setEndYear('');
                    }
                  }}
                  className="w-4 h-4 text-[#101010] border-gray-300 rounded focus:ring-[#101010]"
                />
                <label htmlFor="noEndDate" className="ml-2 text-sm text-gray-700">
                  No end date
                </label>
              </div>
              {!noEndDate && (
                <div className="grid grid-cols-3 gap-2">
                  {/* End Month Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setEndMonthOpen(!endMonthOpen)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-900">
                        {endMonth ? months.find(m => m.value === endMonth)?.label : 'Month'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    {endMonthOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {months.map((m) => (
                          <button
                            key={m.value}
                            type="button"
                            onClick={() => {
                              setEndMonth(m.value);
                              const date = `${endYear || currentYear}-${m.value}-${endDay || '01'}`;
                              setEndDate(date);
                              setEndMonthOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* End Day Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setEndDayOpen(!endDayOpen)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-900">
                        {endDay || 'Day'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    {endDayOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {Array.from({ length: getDaysInMonth(endMonth, endYear) }, (_, i) => i + 1).map(d => {
                          const dayStr = d.toString().padStart(2, '0');
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setEndDay(dayStr);
                                const date = `${endYear || currentYear}-${endMonth || '01'}-${dayStr}`;
                                setEndDate(date);
                                setEndDayOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* End Year Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setEndYearOpen(!endYearOpen)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-900">
                        {endYear || 'Year'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    {endYearOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {years.map(y => (
                          <button
                            key={y}
                            type="button"
                            onClick={() => {
                              setEndYear(y.toString());
                              const date = `${y}-${endMonth || '01'}-${endDay || '01'}`;
                              setEndDate(date);
                              setEndYearOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#101010] mb-2">
              Worker Classification *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="worker_classification"
                  value="w2"
                  checked={formData.worker_classification === 'w2'}
                  onChange={(e) => setFormData({ ...formData, worker_classification: e.target.value as 'w2' | '1099' })}
                  className="mr-2"
                />
                <span className="text-xs">W-2 Employee</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="worker_classification"
                  value="1099"
                  checked={formData.worker_classification === '1099'}
                  onChange={(e) => setFormData({ ...formData, worker_classification: e.target.value as 'w2' | '1099' })}
                  className="mr-2"
                />
                <span className="text-xs">1099 Contractor</span>
              </label>
            </div>
            {formData.worker_classification === 'w2' && (
              <p className="text-xs text-gray-500 mt-1">
                Payroll taxes and benefits will be automatically calculated
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#101010] mb-2">
              Employment Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="employment_type"
                  value="salary"
                  checked={formData.employment_type === 'salary'}
                  onChange={(e) => setFormData({ ...formData, employment_type: e.target.value as 'hourly' | 'salary' })}
                  className="mr-2"
                />
                <span className="text-xs">Salary</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="employment_type"
                  value="hourly"
                  checked={formData.employment_type === 'hourly'}
                  onChange={(e) => setFormData({ ...formData, employment_type: e.target.value as 'hourly' | 'salary' })}
                  className="mr-2"
                />
                <span className="text-xs">Hourly</span>
              </label>
            </div>
          </div>

          {formData.employment_type === 'salary' ? (
            <div>
              <label className="block text-xs font-medium text-[#101010] mb-2">
                Annual Salary *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={formData.annual_salary || ''}
                  onChange={(e) => setFormData({ ...formData, annual_salary: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#101010] mb-2">
                  Hourly Rate *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    value={formData.hourly_rate || ''}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#101010] mb-2">
                  Hours per Week *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="168"
                  step="0.5"
                  value={formData.hours_per_week || ''}
                  onChange={(e) => setFormData({ ...formData, hours_per_week: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent"
                  placeholder="40"
                />
              </div>
            </div>
          )}

          {formData.worker_classification === 'w2' && taxBreakdown && taxBreakdown.baseCompensation && (
            <div className="rounded-lg p-4" style={{ backgroundColor: '#7B68EE15', border: '1px solid #7B68EE40' }}>
              <h3 className="text-sm font-semibold text-[#101010] mb-3">Tax Calculation (Employer Costs)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-700">Base Compensation:</span>
                  <span className="font-medium text-gray-900">${(taxBreakdown.baseCompensation || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {taxBreakdown.taxes && (
                  <>
                    <div className="pt-2 border-t" style={{ borderColor: '#7B68EE40' }}>
                      <div className="font-medium text-gray-900 mb-2">Federal Taxes:</div>
                      {(taxBreakdown.taxes.socialSecurity || 0) > 0 && (
                        <div className="flex justify-between pl-3">
                          <span className="text-gray-600">Social Security (6.2%):</span>
                          <span className="text-gray-900">${(taxBreakdown.taxes.socialSecurity || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      {(taxBreakdown.taxes.medicare || 0) > 0 && (
                        <div className="flex justify-between pl-3">
                          <span className="text-gray-600">Medicare (1.45%):</span>
                          <span className="text-gray-900">${(taxBreakdown.taxes.medicare || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      {(taxBreakdown.taxes.futa || 0) > 0 && (
                        <div className="flex justify-between pl-3">
                          <span className="text-gray-600">FUTA (0.6%):</span>
                          <span className="text-gray-900">${(taxBreakdown.taxes.futa || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </div>

                    {(taxBreakdown.taxes.sui || 0) > 0 && (
                      <div className="pt-2 border-t" style={{ borderColor: '#7B68EE40' }}>
                        <div className="font-medium text-gray-900 mb-2">State Taxes:</div>
                        <div className="flex justify-between pl-3">
                          <span className="text-gray-600">State Unemployment Insurance:</span>
                          <span className="text-gray-900">${(taxBreakdown.taxes.sui || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t" style={{ borderColor: '#7B68EE60' }}>
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900">Total Employer Taxes:</span>
                        <span style={{ color: '#7B68EE' }}>${(taxBreakdown.taxes.totalTaxes || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-3 border-t-2" style={{ borderColor: '#7B68EE80' }}>
                  <div className="flex justify-between font-bold">
                    <span className="text-[#101010]">Total Impact (Fully Loaded):</span>
                    <span className="text-[#101010] text-base">${(taxBreakdown.totalLoadedCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Includes base compensation + employer taxes</p>
                </div>
              </div>
            </div>
          )}
        </form>
        </div>

        {/* Fixed Footer at Bottom */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              {editRole && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove this employee?')) {
                      handleClose();
                    }
                  }}
                  className="px-6 py-2.5 text-red-600 hover:bg-red-50 border border-red-300 rounded-lg transition-colors font-medium"
                >
                  Remove Employee
                </button>
              )}
              <button
                type="submit"
                form="employee-form"
                disabled={loading}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? (editRole ? 'Updating...' : 'Adding Employee...') : (editRole ? 'Update Employee' : 'Add Employee')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
