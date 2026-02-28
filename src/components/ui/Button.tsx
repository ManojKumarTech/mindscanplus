import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...rest
}) => {
  let base =
    'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none';
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses =
        'bg-gradient-to-r from-mint-500 to-sky-500 text-white hover:shadow-softLg';
      break;
    case 'secondary':
      variantClasses = 'bg-white text-mint-600 hover:bg-gray-50';
      break;
    case 'ghost':
      variantClasses = 'bg-transparent text-gray-600 hover:text-gray-800';
      break;
  }

  return (
    <button className={`${base} ${variantClasses} ${className}`} {...rest}>
      {children}
    </button>
  );
};
