import { subDays, format } from 'date-fns';

export interface DataPoint {
  date: string;
  revenue: number;
  users: number;
  orders: number;
  category: string;
}

const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];

export function generateMockData(): DataPoint[] {
  const data: DataPoint[] = [];
  const endDate = new Date();
  
  // Generate data for the last 90 days
  for (let i = 89; i >= 0; i--) {
    const date = subDays(endDate, i);
    
    // Generate realistic data with some trends and seasonality
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Base values with weekend adjustments
    const baseRevenue = 1000 + Math.random() * 1000;
    const baseUsers = 50 + Math.random() * 100;
    const baseOrders = 10 + Math.random() * 30;
    
    // Weekend boost for some categories
    const weekendMultiplier = isWeekend ? 1.3 : 1.0;
    
    // Add some trend (gradual increase over time)
    const trendMultiplier = 1 + (89 - i) * 0.005;
    
    // Add some noise
    const noise = 0.8 + Math.random() * 0.4;
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      revenue: Math.round(baseRevenue * weekendMultiplier * trendMultiplier * noise),
      users: Math.round(baseUsers * weekendMultiplier * trendMultiplier * noise),
      orders: Math.round(baseOrders * weekendMultiplier * trendMultiplier * noise),
      category: categories[Math.floor(Math.random() * categories.length)]
    });
  }
  
  return data;
}
