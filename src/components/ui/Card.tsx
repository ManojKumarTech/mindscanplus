import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string | React.ReactNode;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', ...rest }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-soft ${className}`}
      {...rest}
    >
      {title && <h3 className="font-semibold text-gray-700 mb-4">{title}</h3>}
      {children}
    </div>
  );
};
