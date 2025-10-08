import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  UserPlus,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  DollarSign,
  Building,
  MapPin,
  Calendar,
  TrendingUp,
  BarChart3,
  FileText,
  ChevronDown,
  GripVertical,
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import AddEmployeeModal from '../../components/Payroll/AddEmployeeModal';
import ImportEmployeesModal from '../../components/Payroll/ImportEmployeesModal';
import ColumnManager from '../../components/Payroll/ColumnManager';
import { enterprisePayrollService } from '../../services/enterprisePayrollService';
import type { Employee, EmployeeFilter, PayrollSummary } from '../../types/payroll';

const HeadcountManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<EmployeeFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [empTypeDropdownOpen, setEmpTypeDropdownOpen] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [columnOrder, setColumnOrder] = useState<string[]>([
    'jobTitle',
    'department',
    'location',
    'type',
    'compensation',
    'tax',
    'allIn',
    'status',
  ]);
  const [visibleColumns, setVisibleColumns] = useState({
    jobTitle: true,
    department: true,
    location: true,
    type: true,
    compensation: true,
    tax: true,
    allIn: true,
    status: true,
  });
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const deptDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const empTypeDropdownRef = useRef<HTMLDivElement>(null);
  const columnMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, searchTerm, filters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setDeptDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setLocationDropdownOpen(false);
      }
      if (empTypeDropdownRef.current && !empTypeDropdownRef.current.contains(event.target as Node)) {
        setEmpTypeDropdownOpen(false);
      }
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setShowColumnMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesData, summaryData] = await Promise.all([
        enterprisePayrollService.getEmployees(),
        enterprisePayrollService.getPayrollSummary(),
      ]);
      setEmployees(employeesData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...employees];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.first_name.toLowerCase().includes(search) ||
          emp.last_name.toLowerCase().includes(search) ||
          emp.email?.toLowerCase().includes(search) ||
          emp.employee_number?.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter((emp) => emp.status === filters.status);
    }
    if (filters.department) {
      filtered = filtered.filter((emp) => emp.department_name === filters.department);
    }
    if (filters.location) {
      filtered = filtered.filter((emp) => emp.location === filters.location);
    }
    if (filters.employmentType) {
      filtered = filtered.filter((emp) => emp.employment_type === filters.employmentType);
    }

    setFilteredEmployees(filtered);
  };

  const handleExport = async () => {
    try {
      const csv = await enterprisePayrollService.exportToCSV(filteredEmployees);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await enterprisePayrollService.deleteEmployee(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const uniqueDepartments = Array.from(new Set(employees.map((e) => e.department_name).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(employees.map((e) => e.location).filter(Boolean)));

  // Calculate employer taxes for an employee
  const calculateEmployerTaxes = (employee: Employee) => {
    let annualComp = 0;
    if (employee.employee_type === 'salary') {
      annualComp = employee.annual_salary || 0;
    } else {
      const hourlyRate = employee.hourly_rate || 0;
      const weeklyHours = employee.weekly_hours || 40;
      annualComp = hourlyRate * weeklyHours * 52;
    }

    // Social Security (6.2% up to wage base)
    const socialSecurityWageBase = 168600;
    const socialSecurity = Math.min(annualComp, socialSecurityWageBase) * 0.062;

    // Medicare (1.45%)
    const medicare = annualComp * 0.0145;

    // FUTA (0.6% on first $7,000)
    const futa = Math.min(annualComp, 7000) * 0.006;

    // SUTA (3.4% on first $7,000)
    const suta = Math.min(annualComp, 7000) * 0.034;

    const totalEmployerTax = socialSecurity + medicare + futa + suta;

    return {
      annualComp,
      totalEmployerTax,
      allIn: annualComp + totalEmployerTax,
    };
  };

  const columnConfigs = columnOrder.map(key => {
    const labels: Record<string, string> = {
      jobTitle: 'Job Title',
      department: 'Department',
      location: 'Location',
      type: 'Type',
      compensation: 'Compensation',
      tax: 'Tax',
      allIn: 'All In',
      status: 'Status',
    };
    return { key, label: labels[key] };
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Headcount Management</h1>
          <p className="text-gray-600 mt-1">Enterprise-grade employee and payroll management</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1.5 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <div className="relative" ref={columnMenuRef}>
            <button
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="px-3 py-1.5 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center gap-2"
            >
              <MoreVertical className="w-4 h-4" />
              Customize View
            </button>
            {showColumnMenu && (
              <ColumnManager
                columns={columnConfigs}
                visibleColumns={visibleColumns}
                onToggleColumn={(key, visible) => setVisibleColumns({ ...visibleColumns, [key]: visible })}
                onReorderColumns={(newOrder) => setColumnOrder(newOrder)}
              />
            )}
          </div>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-[#7B68EE] text-white rounded text-sm font-medium shadow-sm transition-colors hover:bg-[#6952d9] flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>


      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or employee number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1.5 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="bg-[#7B68EE] text-white text-xs px-2 py-0.5 rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium shadow-sm border border-gray-300 transition-colors hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{filters.status || 'All'}</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full">
                    <div className="flex flex-col gap-1">
                      {['All', 'Active', 'On Leave', 'Terminated'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setFilters({ ...filters, status: status === 'All' ? undefined : status });
                            setStatusDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                            (status === 'All' && !filters.status) || filters.status === status
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <div className="relative" ref={deptDropdownRef}>
                <button
                  type="button"
                  onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium shadow-sm border border-gray-300 transition-colors hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{filters.department || 'All'}</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {deptDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-60 overflow-y-auto">
                    <div className="flex flex-col gap-1">
                      {['All', ...uniqueDepartments].map((dept) => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => {
                            setFilters({ ...filters, department: dept === 'All' ? undefined : dept });
                            setDeptDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                            (dept === 'All' && !filters.department) || filters.department === dept
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative" ref={locationDropdownRef}>
                <button
                  type="button"
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium shadow-sm border border-gray-300 transition-colors hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{filters.location || 'All'}</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {locationDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-60 overflow-y-auto">
                    <div className="flex flex-col gap-1">
                      {['All', ...uniqueLocations].map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setFilters({ ...filters, location: loc === 'All' ? undefined : loc });
                            setLocationDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                            (loc === 'All' && !filters.location) || filters.location === loc
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <div className="relative" ref={empTypeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setEmpTypeDropdownOpen(!empTypeDropdownOpen)}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium shadow-sm border border-gray-300 transition-colors hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{filters.employmentType || 'All'}</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {empTypeDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full">
                    <div className="flex flex-col gap-1">
                      {['All', 'Full-time', 'Part-time', 'Contract', 'Intern'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setFilters({ ...filters, employmentType: type === 'All' ? undefined : type });
                            setEmpTypeDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                            (type === 'All' && !filters.employmentType) || filters.employmentType === type
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {Object.keys(filters).length > 0 && (
              <div className="col-span-full">
                <Button
                  onClick={() => setFilters({})}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Employee Table */}
      <Card className="flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                {columnOrder.map(key => visibleColumns[key as keyof typeof visibleColumns] && (
                  <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {columnConfigs.find(c => c.key === key)?.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-6 py-12 text-center text-gray-500">
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-6 py-12 text-center text-gray-500">
                    No employees found. Add your first employee to get started.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {employee.first_name[0]}
                          {employee.last_name[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    {columnOrder.map(key => {
                      if (!visibleColumns[key as keyof typeof visibleColumns]) return null;

                      switch(key) {
                        case 'jobTitle':
                          return (
                            <td key={key} className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{employee.job_title || 'Not set'}</div>
                              <div className="text-sm text-gray-500">{employee.employee_number || 'No ID'}</div>
                            </td>
                          );
                        case 'department':
                          return (
                            <td key={key} className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{employee.department_name || 'Unassigned'}</div>
                            </td>
                          );
                        case 'location':
                          return (
                            <td key={key} className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{employee.location || 'Remote'}</div>
                              <div className="text-sm text-gray-500">{employee.state}</div>
                            </td>
                          );
                        case 'type':
                          return (
                            <td key={key} className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs font-medium rounded bg-gray-100 text-gray-700">
                                {employee.employment_type || 'Full-time'}
                              </span>
                            </td>
                          );
                        case 'compensation':
                          return (
                            <td key={key} className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.employee_type === 'salary'
                                  ? `$${(employee.annual_salary || 0).toLocaleString()}/yr`
                                  : `$${employee.hourly_rate}/hr`}
                              </div>
                            </td>
                          );
                        case 'tax':
                          return (
                            <td key={key} className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                ${calculateEmployerTaxes(employee).totalEmployerTax.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </div>
                            </td>
                          );
                        case 'allIn':
                          return (
                            <td key={key} className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                ${calculateEmployerTaxes(employee).allIn.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/yr
                              </div>
                            </td>
                          );
                        case 'status':
                          return (
                            <td key={key} className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs font-medium rounded bg-gray-100 text-gray-700">
                                {employee.status || 'Active'}
                              </span>
                            </td>
                          );
                        default:
                          return null;
                      }
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowAddModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        {filteredEmployees.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredEmployees.length}</span> of{' '}
              <span className="font-medium">{employees.length}</span> employees
            </div>
          </div>
        )}
      </Card>

      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedEmployee(null);
        }}
        onSuccess={loadData}
        employee={selectedEmployee}
      />

      <ImportEmployeesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default HeadcountManagement;
