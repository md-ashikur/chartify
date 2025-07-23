'use client';

interface Metrics {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  avgOrderValue: number;
  revenueGrowth: number;
  userGrowth: number;
  orderGrowth: number;
  aovGrowth: number;
}

interface MetricsCardsProps {
  metrics: Metrics;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'from-green-400 to-green-600',
      change: `+${metrics.revenueGrowth}%`
    },
    {
      title: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      icon: '👥',
      color: 'from-blue-400 to-blue-600',
      change: `+${metrics.userGrowth}%`
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toLocaleString(),
      icon: '📦',
      color: 'from-purple-400 to-purple-600',
      change: `+${metrics.orderGrowth}%`
    },
    {
      title: 'Avg Order Value',
      value: `$${metrics.avgOrderValue.toFixed(2)}`,
      icon: '📊',
      color: 'from-orange-400 to-orange-600',
      change: `+${metrics.aovGrowth}%`
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
