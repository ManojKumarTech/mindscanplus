import React from 'react';

export const Loader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex justify-center items-center ${className}`}> 
    <div className="w-8 h-8 border-4 border-mint-300 border-t-transparent rounded-full animate-spin" />
  </div>
);
