'use client';

import { useMemo } from 'react';

interface DataPoint {
  date: string;
  revenue: number;
  users: number;
  orders: number;
  category: string;
}

interface MetricsCardsProps {
  data: DataPoint[];
}

export default function MetricsCards({ data }: MetricsCardsProps) {
  const metrics = useMemo(() => {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalUsers,
      totalOrders,
      avgOrderValue
    };
  }, [data]);

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'from-green-400 to-green-600',
      change: '+12.5%'
    },
    {
      title: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      icon: '👥',
      color: 'from-blue-400 to-blue-600',
      change: '+8.2%'
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toLocaleString(),
      icon: '📦',
      color: 'from-purple-400 to-purple-600',
      change: '+15.3%'
    },
    {
      title: 'Avg Order Value',
      value: `$${metrics.avgOrderValue.toFixed(2)}`,
      icon: '📊',
      color: 'from-orange-400 to-orange-600',
      change: '+4.7%'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center text-xl`}>
              {card.icon}
            </div>
            <span className="text-green-400 text-sm font-medium">
              {card.change}
            </span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium mb-1">
            {card.title}
          </h3>
          <p className="text-2xl font-bold text-white">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
