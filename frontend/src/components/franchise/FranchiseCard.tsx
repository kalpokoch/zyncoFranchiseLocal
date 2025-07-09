
import React from 'react';

interface FranchiseProps {
  franchise: {
    id: string;
    name: string;
    owner: string;
    address: string;
  };
  onClick: () => void;
}

const FranchiseCard: React.FC<FranchiseProps> = ({ franchise, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div className="text-sm text-gray-500 mb-2">Franchise Id : {franchise.id}</div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Franchise Name : {franchise.name}</h3>
        <p className="text-gray-700">Owner : {franchise.owner}</p>
        <p className="text-gray-700">Address : {franchise.address}</p>
      </div>
    </div>
  );
};

export default FranchiseCard;