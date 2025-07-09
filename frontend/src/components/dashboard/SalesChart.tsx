import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { cn } from '@/lib/utils';

interface SalesData {
  name: string;
  value: number;
  amount?: number;
  day?: string;
}

interface SalesChartProps {
  data: {
    Day: SalesData[];
    Week: SalesData[];
    Month: SalesData[];
    Year: SalesData[];
  };
  period: 'Day' | 'Week' | 'Month' | 'Year';
  setPeriod: (period: 'Day' | 'Week' | 'Month' | 'Year') => void;
  title: string;
  value: string;
  change?: string;
  changeDirection?: 'up' | 'down';
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-100">
        <p className="text-xs text-gray-500">Sales</p>
        <p className="text-sm font-semibold text-blue-500">₹{payload[0].payload.amount}</p>
        <p className="text-xs mt-1 text-gray-600">{payload[0].payload.day}, {label}</p>
      </div>
    );
  }

  return null;
};

const SalesChart: React.FC<SalesChartProps> = ({ 
  data, 
  period, 
  setPeriod, 
  title, 
  value, 
  change,
  changeDirection
}) => {
  const periods: ('Day' | 'Week' | 'Month' | 'Year')[] = ['Day', 'Week', 'Month', 'Year'];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold">{value}</p>
            {change && (
              <span 
                className={cn(
                  'ml-2 text-xs font-medium px-2 py-1 rounded-full',
                  changeDirection === 'up' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                )}
              >
                {change}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex mt-4 sm:mt-0 bg-gray-100 rounded-md p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1 text-sm font-medium rounded-md transition-all',
                period === p 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data[period]}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#6366F1', stroke: 'white', strokeWidth: 2 }}
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
