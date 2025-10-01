import React, { useRef, useEffect } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface TrendCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  description?: string;
  onClick?: () => void;
  isNew?: boolean;
}

const TrendCard: React.FC<TrendCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  onClick,
  isNew = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Focus management for new cards
  useEffect(() => {
    if (isNew && cardRef.current) {
      cardRef.current.focus();
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `New trend card added: ${title} with value ${value}`;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [isNew, title, value]);

  const trendColor = trend === 'up' ? '#4ADE80' : trend === 'down' ? '#F87171' : '#F59E0B';
  const bgColor = trend === 'up' ? '#4ADE80' : trend === 'down' ? '#F87171' : '#F59E0B';

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#3AB7BF] focus:ring-offset-2 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : 'article'}
      aria-label={`${title}: ${value}, ${change} change`}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-lg font-bold text-[#101010] mb-0.5">{value}</p>
          <div className="flex items-center">
            <span 
              className="text-xs font-medium"
              style={{ color: trendColor }}
              aria-label={`${trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'Changed'} by ${change}`}
            >
              {change}
            </span>
            {description && (
              <span className="text-xs text-gray-500 ml-2">{description}</span>
            )}
          </div>
        </div>
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${bgColor}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: bgColor }} />
        </div>
      </div>
    </div>
  );
};

export default TrendCard;