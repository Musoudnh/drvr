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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              <input
                type="text"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent"
                placeholder="YYYY-MM-DD"
              />
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
                    if (e.target.checked) setEndDate('');
                  }}
                  className="w-4 h-4 text-[#101010] border-gray-300 rounded focus:ring-[#101010]"
                />
                <label htmlFor="noEndDate" className="ml-2 text-sm text-gray-700">
                  No end date
                </label>
              </div>
              {!noEndDate && (
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent"
                  placeholder="YYYY-MM-DD"
                />
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

          {editRole && (
            <div className="pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (window.confirm('Are you sure you want to remove this employee?')) {
                    handleClose();
                  }
                }}
                className="w-full text-red-600 hover:bg-red-50 border-red-300"
              >
                Remove Employee
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (editRole ? 'Updating...' : 'Adding Employee...') : (editRole ? 'Update Employee' : 'Add Employee')}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}
