import React, { useState } from 'react';
import { DollarSign, Clock, Calculator, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  EmployeeData,
  PayrollResult,
  calculatePayroll,
  validateEmployeeData,
  getAvailableStates
} from '../../services/payrollService';

interface PayrollCalculatorProps {
  onCalculate?: (result: PayrollResult, employee: EmployeeData) => void;
  initialData?: Partial<EmployeeData>;
}

export default function PayrollCalculator({ onCalculate, initialData }: PayrollCalculatorProps) {
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    employeeType: initialData?.employeeType || 'hourly',
    annualSalary: initialData?.annualSalary || 0,
    hourlyRate: initialData?.hourlyRate || 0,
    weeklyHours: initialData?.weeklyHours || 40,
    state: initialData?.state || 'CA',
    filingStatus: initialData?.filingStatus || 'single',
    allowances: initialData?.allowances || 0,
    additionalWithholding: initialData?.additionalWithholding || 0
  });

  const [payPeriodType, setPayPeriodType] = useState<string>('biweekly');
  const [calculateTaxes, setCalculateTaxes] = useState<boolean>(true);
  const [result, setResult] = useState<PayrollResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleInputChange = (field: keyof EmployeeData, value: string | number) => {
    setEmployeeData(prev => ({
      ...prev,
      [field]: value
    }));
    setResult(null);
    setErrors([]);
  };

  const handleCalculate = () => {
    const validationErrors = validateEmployeeData(employeeData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }

    const calculatedResult = calculatePayroll(
      employeeData,
      payPeriodType,
      calculateTaxes
    );

    setResult(calculatedResult);
    setErrors([]);

    if (onCalculate) {
      onCalculate(calculatedResult, employeeData);
    }
  };

  const handleReset = () => {
    setEmployeeData({
      employeeType: 'hourly',
      annualSalary: 0,
      hourlyRate: 0,
      weeklyHours: 40,
      state: 'CA',
      filingStatus: 'single',
      allowances: 0,
      additionalWithholding: 0
    });
    setResult(null);
    setErrors([]);
  };

  const states = getAvailableStates();

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="p-4 bg-white border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 mb-1">Validation Errors</h4>
              <ul className="text-xs text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-3">
            Employee Classification
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                handleInputChange('employeeType', 'salary');
                setResult(null);
              }}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                employeeData.employeeType === 'salary'
                  ? 'border-[#9333EA] bg-[#9333EA]/5 text-[#9333EA]'
                  : 'border-gray-300 hover:border-[#9333EA]/40 text-gray-700'
              }`}
            >
              <DollarSign className="w-5 h-5 mb-2" />
              <div className="font-medium text-xs">Salaried Employee</div>
              <div className="text-xs mt-1 opacity-80">Annual salary amount</div>
            </button>

            <button
              type="button"
              onClick={() => {
                handleInputChange('employeeType', 'hourly');
                setResult(null);
              }}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                employeeData.employeeType === 'hourly'
                  ? 'border-[#9333EA] bg-[#9333EA]/5 text-[#9333EA]'
                  : 'border-gray-300 hover:border-[#9333EA]/40 text-gray-700'
              }`}
            >
              <Clock className="w-5 h-5 mb-2" />
              <div className="font-medium text-xs">Hourly Employee</div>
              <div className="text-xs mt-1 opacity-80">Hourly rate & hours</div>
            </button>
          </div>
        </div>

        {employeeData.employeeType === 'salary' ? (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Annual Salary
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={employeeData.annualSalary || ''}
                onChange={(e) => handleInputChange('annualSalary', parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                placeholder="75000"
                step="1000"
                min="0"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Hourly Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={employeeData.hourlyRate || ''}
                  onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                  placeholder="25.00"
                  step="0.50"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Weekly Hours
              </label>
              <input
                type="number"
                value={employeeData.weeklyHours || ''}
                onChange={(e) => handleInputChange('weeklyHours', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                placeholder="40"
                step="0.5"
                min="0"
                max="168"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Pay Period
          </label>
          <select
            value={payPeriodType}
            onChange={(e) => {
              setPayPeriodType(e.target.value);
              setResult(null);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
          >
            <option value="weekly">Weekly (52 per year)</option>
            <option value="biweekly">Bi-Weekly (26 per year)</option>
            <option value="semimonthly">Semi-Monthly (24 per year)</option>
            <option value="monthly">Monthly (12 per year)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <div className="font-medium text-gray-900">Calculate Payroll Taxes</div>
            <div className="text-xs text-gray-600 mt-0.5">
              Include federal, state, and FICA taxes
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setCalculateTaxes(!calculateTaxes);
              setResult(null);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              calculateTaxes ? 'bg-[#9333EA]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                calculateTaxes ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {calculateTaxes && (
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-medium text-[#9333EA] hover:text-[#7C3AED] transition-colors mb-3"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Tax Settings
            </button>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select
                      value={employeeData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                    >
                      {states.map(state => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Filing Status
                    </label>
                    <select
                      value={employeeData.filingStatus}
                      onChange={(e) => handleInputChange('filingStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="head_of_household">Head of Household</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Allowances
                    </label>
                    <input
                      type="number"
                      value={employeeData.allowances || 0}
                      onChange={(e) => handleInputChange('allowances', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                      min="0"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Additional Withholding
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={employeeData.additionalWithholding || 0}
                        onChange={(e) => handleInputChange('additionalWithholding', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                        step="10"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCalculate}
          className="flex-1 px-4 py-3 bg-[#9333EA] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          Calculate Payroll
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>

      {result && (
        <div className="space-y-4 p-6 bg-gradient-to-br from-[#9333EA]/5 to-[#7C3AED]/5 rounded-lg border-2 border-[#9333EA]">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-[#9333EA]" />
            <h3 className="text-lg font-semibold text-gray-900">Payroll Calculation Results</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Gross Pay</span>
              <span className="text-xl font-bold text-gray-900">
                ${result.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {calculateTaxes && (
              <div className="space-y-2 p-4 bg-white rounded-lg">
                <div className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tax Deductions
                </div>

                <div className="space-y-2 pl-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Federal Income Tax</span>
                    <span className="font-medium text-red-600">
                      -${result.taxes.federalTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {result.taxes.stateTax > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">State Income Tax</span>
                      <span className="font-medium text-red-600">
                        -${result.taxes.stateTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Social Security (6.2%)</span>
                    <span className="font-medium text-red-600">
                      -${result.taxes.socialSecurityTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Medicare (1.45%)</span>
                    <span className="font-medium text-red-600">
                      -${result.taxes.medicareTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {result.otherDeductions > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Additional Withholding</span>
                      <span className="font-medium text-red-600">
                        -${result.otherDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Total Deductions</span>
                    <span className="font-bold text-red-600">
                      -${result.taxes.totalTaxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-[#9333EA] text-white rounded-lg">
              <span className="text-lg font-semibold">Net Pay</span>
              <span className="text-2xl font-bold">
                ${result.netPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="text-xs text-gray-600 text-center pt-2">
              Take-home pay: {((result.netPay / result.grossPay) * 100).toFixed(1)}% of gross
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
