
import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconColor?: string;
  change?: string;
  changeDirection?: 'up' | 'down';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor = 'bg-blue-100',
  change,
  changeDirection,
  className,
}) => {
  return (
    <div className={cn('stat-card animate-fade-in', className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        {icon && (
          <div className={cn('p-2 rounded-lg', iconColor)}>
            {icon}
          </div>
        )}
      </div>
      
      {change && (
        <div className="mt-2">
          <span 
            className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              changeDirection === 'up' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            )}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
