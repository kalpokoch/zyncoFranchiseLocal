
import React from 'react';

interface StockItem {
  code: string;
  name: string;
  stock: number;
  unit: string;
}

interface StockAlertProps {
  items: StockItem[];
}

const StockAlert: React.FC<StockAlertProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm animate-fade-in">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Low Stock Alert</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Product Code</th>
              <th className="px-6 py-3 text-left">Item</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Unit</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.code} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-gray-500">{item.code}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.stock}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.unit}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center text-sm text-red-600">
                    <span className="mr-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    Low Stock
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAlert;
