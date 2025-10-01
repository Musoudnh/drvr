import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../UI/Button';
import { supabase } from '../../lib/supabase';
import { taxCalculationService } from '../../services/taxCalculationService';
import { StateTaxRate, RoleFormData } from '../../types/hiring';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleAdded: () => void;
}

export function AddRoleModal({ isOpen, onClose, onRoleAdded }: AddRoleModalProps) {
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
          user_id: '00000000-0000-0000-0000-000000000000',
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#101010]">Add New Role</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#101010] mb-2">
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
            <label className="block text-sm font-medium text-[#101010] mb-2">
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
              <label className="block text-sm font-medium text-[#101010] mb-2">
                Location (State) *
              </label>
              <select
                required
                value={formData.location_state}
                onChange={(e) => setFormData({ ...formData, location_state: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent"
                disabled={loadingStates}
              >
                <option value="">
                  {loadingStates ? 'Loading states...' : 'Select state'}
                </option>
                {states.map((state) => (
                  <option key={state.state_code} value={state.state_code}>
                    {state.state_name}
                  </option>
                ))}
              </select>
              {loadingStates && (
                <p className="text-xs text-gray-500 mt-1">Loading state data...</p>
              )}
              {!loadingStates && states.length === 0 && (
                <p className="text-xs text-red-600 mt-1">No states available. Check console for errors.</p>
              )}
              {!loadingStates && states.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">{states.length} states loaded</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#101010] mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101010] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#101010] mb-2">
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
                <span className="text-sm">W-2 Employee</span>
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
                <span className="text-sm">1099 Contractor</span>
              </label>
            </div>
            {formData.worker_classification === 'w2' && (
              <p className="text-xs text-gray-500 mt-1">
                Payroll taxes and benefits will be automatically calculated
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#101010] mb-2">
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
                <span className="text-sm">Salary</span>
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
                <span className="text-sm">Hourly</span>
              </label>
            </div>
          </div>

          {formData.employment_type === 'salary' ? (
            <div>
              <label className="block text-sm font-medium text-[#101010] mb-2">
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
                <label className="block text-sm font-medium text-[#101010] mb-2">
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
                <label className="block text-sm font-medium text-[#101010] mb-2">
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

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding Role...' : 'Add Role'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
