import React from 'react';

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-4 py-3 text-base min-h-[48px]',
  lg: 'px-6 py-4 text-lg min-h-[56px]',
  icon: 'p-2 min-w-[48px] min-h-[48px]'
};

export const Button = React.memo(({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ariaLabel
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        rounded-lg font-medium transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
