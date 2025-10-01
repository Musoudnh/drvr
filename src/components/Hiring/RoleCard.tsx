import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, MapPin, Briefcase, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { HiringRole, TaxBreakdown } from '../../types/hiring';
import { taxCalculationService } from '../../services/taxCalculationService';
import Button from '../UI/Button';

interface RoleCardProps {
  role: HiringRole;
  onDelete: (id: string) => void;
}

export function RoleCard({ role, onDelete }: RoleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdown[]>([]);

  useEffect(() => {
    if (expanded && role.worker_classification === 'w2') {
      loadTaxBreakdown();
    }
  }, [expanded, role.id, role.worker_classification]);

  const loadTaxBreakdown = async () => {
    const breakdown = await taxCalculationService.getTaxBreakdown(role.id);
    setTaxBreakdown(breakdown);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#101010] mb-1">{role.role_name}</h3>
            {role.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{role.description}</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(role.id)}
            className="ml-4"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {role.location_state}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {formatDate(role.start_date)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
            {role.worker_classification === 'w2' ? 'W-2 Employee' : '1099 Contractor'}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
            {role.employment_type === 'salary' ? 'Salary' : `${role.hours_per_week}h/week`}
          </div>
        </div>

        <div className="bg-[#f8f9fb] rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Base Compensation</span>
            <span className="text-base font-semibold text-[#101010]">
              {formatCurrency(role.base_compensation)}
            </span>
          </div>
          {role.worker_classification === 'w2' && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>+ Taxes & Benefits</span>
              <span className="font-medium">
                {formatCurrency(role.total_loaded_cost - role.base_compensation)}
              </span>
            </div>
          )}
          <div className="pt-2 mt-2 border-t border-gray-300 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#101010]">Total Loaded Cost</span>
            <span className="text-lg font-bold text-[#101010]">
              {formatCurrency(role.total_loaded_cost)}
            </span>
          </div>
        </div>

        {role.worker_classification === 'w2' && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-[#101010] hover:text-gray-700 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Tax Breakdown
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View Tax Breakdown
              </>
            )}
          </button>
        )}
      </div>

      {expanded && role.worker_classification === 'w2' && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <h4 className="text-sm font-semibold text-[#101010] mb-3">Tax & Benefit Breakdown</h4>
          <div className="space-y-2">
            {taxBreakdown.map((tax) => (
              <div key={tax.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">{tax.tax_type}</span>
                  <span className="text-gray-500">
                    ({(tax.tax_rate * 100).toFixed(2)}%)
                  </span>
                </div>
                <span className="font-medium text-[#101010]">
                  {formatCurrency(tax.tax_amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
