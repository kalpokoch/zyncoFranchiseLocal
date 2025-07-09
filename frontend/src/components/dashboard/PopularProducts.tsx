
import React from 'react';
import { cn } from '@/lib/utils';

interface Product {
  name: string;
  sales: string;
  change: string;
  changeDirection: 'up' | 'down';
}

interface PopularProductsProps {
  products: Product[];
}

const PopularProducts: React.FC<PopularProductsProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm animate-fade-in">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Popular Products</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Product Name</th>
              <th className="px-6 py-3 text-left">Sales</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{product.sales}</span>
                    <span 
                      className={cn(
                        'text-xs font-medium px-2 py-1 rounded-full',
                        product.changeDirection === 'up' 
                          ? 'text-green-700 bg-green-100' 
                          : 'text-red-700 bg-red-100'
                      )}
                    >
                      {product.change}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PopularProducts;
