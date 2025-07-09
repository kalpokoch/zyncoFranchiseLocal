import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import ActionButton from '@/components/dashboard/ActionButton';
import SalesChart from '@/components/dashboard/SalesChart';
import OrdersTable from '@/components/dashboard/OrdersTable';
import StockAlert from '@/components/dashboard/StockAlert';
import PopularProducts from '@/components/dashboard/PopularProducts';
import { ShoppingCart, Package, Activity, AlertTriangle, BarChart3, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample data for the sake of frontend
const salesData = {
  Day: [
    { name: '12 AM', value: 1000, amount: 1000, day: 'Today' },
    { name: '1 AM', value: 2000, amount: 2000, day: 'Today' },
  ],
  Week: [
    { name: 'Mon', value: 10000, amount: 10000, day: 'Monday' },
    { name: 'Tue', value: 25000, amount: 25000, day: 'Tuesday' },
    { name: 'Wed', value: 32000, amount: 32000, day: 'Wednesday' },
    { name: 'Thu', value: 48000, amount: 48000, day: 'Thursday' },
    { name: 'Fri', value: 41000, amount: 41000, day: 'Friday' },
    { name: 'Sat', value: 38000, amount: 38000, day: 'Saturday' },
    { name: 'Sun', value: 25000, amount: 25000, day: 'Sunday' },
  ],
  Month: [
    { name: '1', value: 7000, amount: 7000, day: '1st' },
    { name: '2', value: 8000, amount: 8000, day: '2nd' },
    { name: '3', value: 2000, amount: 2000, day: '3rd' },
    { name: '4', value: 3000, amount: 3000, day: '4th' },
    { name: '5', value: 4000, amount: 4000, day: '5th' },
    { name: '31', value: 9000, amount: 9000, day: '31st' },
  ],
  Year: [
    { name: 'Jan', value: 300000, amount: 300000, day: 'January' },
    { name: 'Feb', value: 280000, amount: 280000, day: 'February' },
    { name: 'Mar', value: 320000, amount: 320000, day: 'March' },
    { name: 'Apr', value: 310000, amount: 310000, day: 'April' },
    { name: 'May', value: 330000, amount: 330000, day: 'May' },
    { name: 'Jun', value: 340000, amount: 340000, day: 'June' },
    { name: 'Jul', value: 350000, amount: 350000, day: 'July' },
    { name: 'Aug', value: 360000, amount: 360000, day: 'August' },
    { name: 'Sep', value: 370000, amount: 370000, day: 'September' },
    { name: 'Oct', value: 380000, amount: 380000, day: 'October' },
    { name: 'Nov', value: 390000, amount: 390000, day: 'November' },
    { name: 'Dec', value: 400000, amount: 400000, day: 'December' },
  ],
};

// Fixed the status type to match "Pending" | "Packed" | "Delivered"
const recentOrders = [
  { id: '103', customer: 'Raj Sharma', paymentMethod: 'Cash', time: '01:01 PM', date: 'January 20, 2025', amount: '1,200', status: 'Pending' as const },
  { id: '102', customer: 'Amit Ghosh', paymentMethod: 'Cash', time: '12:14 PM', date: 'January 20, 2025', amount: '100', status: 'Packed' as const },
  { id: '101', customer: 'Deepak Store', paymentMethod: 'Credit', time: '10:54 AM', date: 'January 20, 2025', amount: '1,000', status: 'Delivered' as const },
];

const lowStockItems = [
  { code: 'I293DSA39', name: 'Basmati Rice', stock: 4, unit: 'Packet' },
  { code: 'U2349SD12', name: 'Dal', stock: 1, unit: 'Packet' },
  { code: 'F2349SU38', name: 'Chips', stock: 90, unit: 'Packet' },
];

// Fixed the changeDirection type to match "up" | "down"
const popularProducts = [
  { name: 'Basmati Rice', sales: '200 packets', change: '+25%', changeDirection: 'up' as const },
  { name: 'Dal', sales: '170 packets', change: '+18%', changeDirection: 'up' as const },
  { name: 'Chips', sales: '150 Packets', change: '+15%', changeDirection: 'up' as const },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Week');

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="flex mt-4 md:mt-0 gap-3">
          <ActionButton 
            icon={<ShoppingCart size={18} />} 
            label="Add Sales" 
            onClick={() => {
  const franchiseId = localStorage.getItem('franchiseId');
  if (franchiseId) {
    navigate(`/${franchiseId}/sales/add`);
  } else {
    alert('Franchise ID not found. Please select a franchise.');
  }
}} 
          />
          <ActionButton 
            icon={<Plus size={18} />} 
            label="Add Purchase" 
            onClick={() => navigate('/purchase/add')} 
            variant="secondary" 
          />
          <ActionButton 
            icon={<Plus size={18} />} 
            label="Add a new Product" 
            onClick={() => navigate('/inventory/add')} 
            variant="accent" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Orders Today" 
          value="65" 
          icon={<ShoppingCart size={18} className="text-yellow-600" />}
          iconColor="bg-yellow-100"
        />
        <StatCard 
          title="Delivered Orders" 
          value="5" 
          icon={<Activity size={18} className="text-blue-600" />}
          iconColor="bg-blue-100"
        />
        <StatCard 
          title="Amount Receivable Today" 
          value="₹5,42,000" 
          change="+2.5% vs Last month"
          changeDirection='up'
          
          icon={<TrendingUp size={18} className="text-blue-600" />}
          iconColor="bg-blue-100"
        />
        <StatCard 
          title="Amount Payable Today" 
          value="₹5,42,000" 
          change="+2.5% vs Last month"
          changeDirection='up'
          icon={<Activity size={18} className="text-blue-600" />}
          iconColor="bg-blue-100"
        />
        
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Total Revenue Today" 
          value="₹15,850" 
          icon={<BarChart3 size={18} className="text-green-600" />}
          iconColor="bg-green-100"
        />
        <StatCard 
          title="Total Revenue This Month" 
          value="₹5,42,000" 
          change="+2.5% vs Last month" 
          changeDirection="up"
          icon={<BarChart3 size={18} className="text-green-600" />}
          iconColor="bg-green-100"
        />
        <StatCard 
          title="Total Revenue Till Date" 
          value="₹5,42,000" 
          change="+2.5% vs Last month" 
          changeDirection="up"
          icon={<BarChart3 size={18} className="text-green-600" />}
          iconColor="bg-green-100"
        />
      </div>
      
      <div className="mb-6">
        <SalesChart 
          data={salesData}
          period={chartPeriod}
          setPeriod={setChartPeriod}
          title="Total Sales"
          value="₹45,850"
          change="+3.4% from last week"
          changeDirection="up"
        />
      </div>
      
      {/* <div className="mb-6">
        <OrdersTable 
          orders={recentOrders}
          title="Recent Orders"
          subtitle="+1 new order"
          linkText="Go to Orders Page"
          onLinkClick={() => navigate('/sales')}
        />
      </div> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StockAlert items={lowStockItems} />
        <PopularProducts products={popularProducts} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
