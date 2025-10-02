import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-[#212B36] hover:bg-[#101010] text-white focus:ring-[#212B36]',
    secondary: 'bg-[#101010] hover:bg-[#2A3441] text-white focus:ring-[#1E2A38]',
    success: 'bg-[#4ADE80] hover:bg-[#3BC66F] text-white focus:ring-[#4ADE80]',
    danger: 'bg-[#F87171] hover:bg-[#F56565] text-white focus:ring-[#F87171]',
    outline: 'border-2 border-[#101010] text-[#101010] hover:bg-[#101010] hover:text-white focus:ring-[#101010]'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;