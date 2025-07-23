'use client';

import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface DataPoint {
  id: number;
  date: string;
  revenue: number;
  users: number;
  orders: number;
  category: string;
}

interface RadarChartProps {
  data: DataPoint[];
}

export default function RadarChart({ data }: RadarChartProps) {
  // Calculate performance metrics
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  
  // Normalize values to 0-100 scale for better visualization
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxUsers = Math.max(...data.map(d => d.users));
  const maxOrders = Math.max(...data.map(d => d.orders));

  const radarData = [
    {
      subject: 'Revenue',
      A: Math.round((totalRevenue / (maxRevenue * data.length)) * 100),
      fullMark: 100,
    },
    {
      subject: 'Users',
      A: Math.round((totalUsers / (maxUsers * data.length)) * 100),
      fullMark: 100,
    },
    {
      subject: 'Orders',
      A: Math.round((totalOrders / (maxOrders * data.length)) * 100),
      fullMark: 100,
    },
    {
      subject: 'Conversion',
      A: totalUsers > 0 ? Math.round((totalOrders / totalUsers) * 100) : 0,
      fullMark: 100,
    },
    {
      subject: 'Efficiency',
      A: Math.round(Math.random() * 30 + 70), // Mock efficiency score
      fullMark: 100,
    },
    {
      subject: 'Growth',
      A: Math.round(Math.random() * 20 + 80), // Mock growth score
      fullMark: 100,
    },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.2)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#e2e8f0', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            tick={{ fill: '#e2e8f0', fontSize: 10 }}
            tickCount={5}
            angle={90}
            domain={[0, 100]}
          />
          <Radar
            name="Performance"
            dataKey="A"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend 
            wrapperStyle={{ color: '#e2e8f0', fontSize: '12px' }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
