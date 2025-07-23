'use client';

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface DataPoint {
  date: string;
  revenue: number;
  users: number;
  orders: number;
  category: string;
}

interface AreaChartProps {
  data: DataPoint[];
}

export default function AreaChart({ data }: AreaChartProps) {
  const chartData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd')
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={chartData}>
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
          <Area 
            type="monotone" 
            dataKey="users" 
            stroke="#3b82f6" 
            fill="url(#colorUsers)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
