
import React from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'primary',
  className,
  disabled = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'secondary':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'accent':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      default:
        return 'bg-green-500 text-white hover:bg-green-600';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
        getVariantStyles(),
        className,
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;
