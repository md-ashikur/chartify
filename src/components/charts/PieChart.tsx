'use client';

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DataPoint {
  id: number;
  date: string;
  revenue: number;
  users: number;
  orders: number;
  category: string;
}

interface PieChartProps {
  data: DataPoint[];
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function PieChart({ data }: PieChartProps) {
  // Aggregate data by category
  const categoryData = data.reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.category);
    if (existing) {
      existing.value += item.revenue;
    } else {
      acc.push({ name: item.category, value: item.revenue });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
          />
          <Legend 
            wrapperStyle={{ color: '#e2e8f0', fontSize: '12px' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
