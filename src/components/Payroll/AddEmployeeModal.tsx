import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { enterprisePayrollService } from '../../services/enterprisePayrollService';
import type { Employee } from '../../types/payroll';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: Employee | null;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSuccess, employee }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    employee_number: '',
    job_title: '',
    department_name: '',
    employee_type: 'salary' as 'salary' | 'hourly',
    employment_type: 'Full-time',
    classification: 'W2',
    location: '',
    state: 'CA',
    start_date: new Date().toISOString().split('T')[0],
    status: 'Active',
    manager_name: '',
    cost_center: '',
    annual_salary: '',
    hourly_rate: '',
    weekly_hours: '40',
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [empTypeDropdownOpen, setEmpTypeDropdownOpen] = useState(false);
  const [classificationDropdownOpen, setClassificationDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [employmentTypeDropdownOpen, setEmploymentTypeDropdownOpen] = useState(false);

  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const empTypeDropdownRef = useRef<HTMLDivElement>(null);
  const classificationDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const employmentTypeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email || '',
        phone: employee.phone || '',
        employee_number: employee.employee_number || '',
        job_title: employee.job_title || '',
        department_name: employee.department_name || '',
        employee_type: employee.employee_type,
        employment_type: employee.employment_type || 'Full-time',
        classification: employee.classification || 'W2',
        location: employee.location || '',
        state: employee.state,
        start_date: employee.start_date || new Date().toISOString().split('T')[0],
        status: employee.status || 'Active',
        manager_name: employee.manager_name || '',
        cost_center: employee.cost_center || '',
        annual_salary: employee.annual_salary?.toString() || '',
        hourly_rate: employee.hourly_rate?.toString() || '',
        weekly_hours: employee.weekly_hours?.toString() || '40',
        notes: employee.notes || '',
      });
    }
  }, [employee]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setStateDropdownOpen(false);
      }
      if (empTypeDropdownRef.current && !empTypeDropdownRef.current.contains(event.target as Node)) {
        setEmpTypeDropdownOpen(false);
      }
      if (classificationDropdownRef.current && !classificationDropdownRef.current.contains(event.target as Node)) {
        setClassificationDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
      if (employmentTypeDropdownRef.current && !employmentTypeDropdownRef.current.contains(event.target as Node)) {
        setEmploymentTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate employer taxes
  const calculateEmployerTaxes = () => {
    let annualComp = 0;
    if (formData.employee_type === 'salary') {
      annualComp = parseFloat(formData.annual_salary) || 0;
    } else {
      const hourlyRate = parseFloat(formData.hourly_rate) || 0;
      const weeklyHours = parseFloat(formData.weekly_hours) || 40;
      annualComp = hourlyRate * weeklyHours * 52;
    }

    // Social Security (6.2% up to wage base)
    const socialSecurityWageBase = 168600; // 2024 limit
    const socialSecurity = Math.min(annualComp, socialSecurityWageBase) * 0.062;

    // Medicare (1.45% - no wage base limit)
    const medicare = annualComp * 0.0145;

    // FUTA (0.6% on first $7,000)
    const futa = Math.min(annualComp, 7000) * 0.006;

    // SUTA (example rate 3.4% on first $7,000 - varies by state)
    const suta = Math.min(annualComp, 7000) * 0.034;

    const totalEmployerTax = socialSecurity + medicare + futa + suta;

    return {
      annualComp,
      socialSecurity,
      medicare,
      futa,
      suta,
      totalEmployerTax,
    };
  };

  const taxes = calculateEmployerTaxes();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const employeeData: Partial<Employee> = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        employee_number: formData.employee_number || undefined,
        job_title: formData.job_title || undefined,
        department_name: formData.department_name || undefined,
        employee_type: formData.employee_type,
        employment_type: formData.employment_type,
        classification: formData.classification,
        location: formData.location || undefined,
        state: formData.state,
        start_date: formData.start_date,
        status: formData.status,
        manager_name: formData.manager_name || undefined,
        cost_center: formData.cost_center || undefined,
        annual_salary: formData.annual_salary ? parseFloat(formData.annual_salary) : undefined,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
        weekly_hours: formData.weekly_hours ? parseFloat(formData.weekly_hours) : undefined,
        notes: formData.notes || undefined,
      };

      if (employee) {
        await enterprisePayrollService.updateEmployee(employee.id, employeeData);
      } else {
        await enterprisePayrollService.createEmployee(employeeData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const CustomDropdown = ({
    label,
    value,
    options,
    isOpen,
    setIsOpen,
    dropdownRef,
    onChange,
  }: {
    label: string;
    value: string;
    options: string[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
    onChange: (value: string) => void;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium shadow-sm border border-gray-300 transition-colors hover:bg-gray-50 flex items-center justify-between"
        >
          <span>{value}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>
        {isOpen && (
          <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-60 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                    value === option
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {employee ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee Number</label>
              <input
                type="text"
                value={formData.employee_number}
                onChange={(e) => setFormData({ ...formData, employee_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department_name}
                onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <CustomDropdown
              label="Employee Type"
              value={formData.employee_type === 'salary' ? 'Salary' : 'Hourly'}
              options={['Salary', 'Hourly']}
              isOpen={empTypeDropdownOpen}
              setIsOpen={setEmpTypeDropdownOpen}
              dropdownRef={empTypeDropdownRef}
              onChange={(value) =>
                setFormData({ ...formData, employee_type: value === 'Salary' ? 'salary' : 'hourly' })
              }
            />

            <CustomDropdown
              label="Employment Type"
              value={formData.employment_type}
              options={['Full-time', 'Part-time', 'Contract', 'Intern']}
              isOpen={employmentTypeDropdownOpen}
              setIsOpen={setEmploymentTypeDropdownOpen}
              dropdownRef={employmentTypeDropdownRef}
              onChange={(value) => setFormData({ ...formData, employment_type: value })}
            />

            <CustomDropdown
              label="Classification"
              value={formData.classification}
              options={['W2', '1099', 'Exempt', 'Non-exempt']}
              isOpen={classificationDropdownOpen}
              setIsOpen={setClassificationDropdownOpen}
              dropdownRef={classificationDropdownRef}
              onChange={(value) => setFormData({ ...formData, classification: value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <CustomDropdown
              label="State"
              value={formData.state}
              options={US_STATES}
              isOpen={stateDropdownOpen}
              setIsOpen={setStateDropdownOpen}
              dropdownRef={stateDropdownRef}
              onChange={(value) => setFormData({ ...formData, state: value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <CustomDropdown
              label="Status"
              value={formData.status}
              options={['Active', 'On Leave', 'Terminated']}
              isOpen={statusDropdownOpen}
              setIsOpen={setStatusDropdownOpen}
              dropdownRef={statusDropdownRef}
              onChange={(value) => setFormData({ ...formData, status: value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
              <input
                type="text"
                value={formData.manager_name}
                onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
              <input
                type="text"
                value={formData.cost_center}
                onChange={(e) => setFormData({ ...formData, cost_center: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {formData.employee_type === 'salary' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary</label>
                <input
                  type="number"
                  value={formData.annual_salary}
                  onChange={(e) => setFormData({ ...formData, annual_salary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                  <input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Hours</label>
                  <input
                    type="number"
                    value={formData.weekly_hours}
                    onChange={(e) => setFormData({ ...formData, weekly_hours: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="40"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Employer Tax Calculation Section */}
          {(formData.annual_salary || formData.hourly_rate) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employer Tax Burden</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Annual Compensation</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${taxes.annualComp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Employer Taxes (Annual)</p>
                  <p className="text-2xl font-bold text-[#7B68EE]">
                    ${taxes.totalEmployerTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Social Security (6.2%)</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${taxes.socialSecurity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Medicare (1.45%)</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${taxes.medicare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">FUTA (0.6%)</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${taxes.futa.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">SUTA (3.4%)</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${taxes.suta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                <p>* Social Security limited to wage base of $168,600 (2024)</p>
                <p>* FUTA and SUTA calculated on first $7,000 of wages</p>
                <p>* SUTA rate varies by state; 3.4% used as example</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              style={{
                backgroundColor: '#212B36',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#1a2028';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#212B36';
                }
              }}
            >
              {saving ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
