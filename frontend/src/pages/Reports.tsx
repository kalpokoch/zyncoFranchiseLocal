
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Business Reports</h2>
        <p className="text-gray-500 mb-6 text-center">
          This page would provide detailed business analytics, financial reports, 
          sales trends, and inventory statistics.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Go back to Dashboard
        </button>
      </div>
    </MainLayout>
  );
};

export default Reports;
