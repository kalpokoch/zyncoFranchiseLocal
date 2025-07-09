
import React from 'react';
import { Circle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import dropRightButton from '@/assets/icons/material-symbols_arrow-drop-down-circle-outline-rounded.png';
interface Order {
  id: string;
  customer: string;
  paymentMethod: string;
  time: string;
  date: string;
  amount: string;
  status: 'Pending' | 'Packed' | 'Delivered';
}

interface OrdersTableProps {
  orders: Order[];
  title: string;
  subtitle?: string;
  linkText?: string;
  onLinkClick?: () => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  title,
  subtitle,
  linkText,
  onLinkClick,
}) => {
  const getStatusStyles = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Packed':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm animate-fade-in">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {linkText && (
            <button 
              onClick={onLinkClick}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              {linkText}
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Order Id</th>
              <th className="px-6 py-3 text-left">Customer Name</th>
              <th className="px-6 py-3 text-left">Payment Method</th>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Order Date</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.paymentMethod}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.time}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'px-3 py-1 text-xs font-medium rounded-full',
                    getStatusStyles(order.status)
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <img src= {dropRightButton} alt="View" width={18} height={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
