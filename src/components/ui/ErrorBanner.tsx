import React from 'react';

export const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
    {message}
  </div>
);
