'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface DataPoint {
  id: number;
  date: string;
  revenue: number;
  users: number;
  orders: number;
  category: string;
}

interface BarChartProps {
  data: DataPoint[];
}

export default function BarChart({ data }: BarChartProps) {
  const chartData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd')
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fill: '#e2e8f0', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis 
            tick={{ fill: '#e2e8f0', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar 
            dataKey="orders" 
            fill="url(#colorOrders)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
