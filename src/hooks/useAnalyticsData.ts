import { useMemo } from 'react';
import { isWithinInterval } from 'date-fns';
import { useGetAnalyticsQuery } from '@/store/analyticsApi';
import { useDashboardStore } from '@/store/dashboardStore';

export function useAnalyticsData() {
  const { dateRange, selectedCategories } = useDashboardStore();
  const { data: allData = [], isLoading, error } = useGetAnalyticsQuery();

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = Array.from(new Set(allData.map(item => item.category)));
    return categories.sort();
  }, [allData]);

  // Filter data based on date range and categories
  const filteredData = useMemo(() => {
    return allData.filter(item => {
      const dateInRange = isWithinInterval(new Date(item.date), {
        start: dateRange.startDate,
        end: dateRange.endDate
      });
      
      const categoryMatch = selectedCategories.length === 0 || 
                           selectedCategories.includes(item.category);
      
      return dateInRange && categoryMatch;
    });
  }, [allData, dateRange, selectedCategories]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    const totalUsers = filteredData.reduce((sum, item) => sum + item.users, 0);
    const totalOrders = filteredData.reduce((sum, item) => sum + item.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate growth percentages (mock calculation)
    const revenueGrowth = 12.5;
    const userGrowth = 8.2;
    const orderGrowth = 15.3;
    const aovGrowth = 4.7;

    return {
      totalRevenue,
      totalUsers,
      totalOrders,
      avgOrderValue,
      revenueGrowth,
      userGrowth,
      orderGrowth,
      aovGrowth
    };
  }, [filteredData]);

  // Aggregate data by category
  const categoryData = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const existing = acc.find(a => a.name === item.category);
      if (existing) {
        existing.value += item.revenue;
        existing.orders += item.orders;
        existing.users += item.users;
      } else {
        acc.push({ 
          name: item.category, 
          value: item.revenue,
          orders: item.orders,
          users: item.users
        });
      }
      return acc;
    }, [] as { name: string; value: number; orders: number; users: number }[]);
  }, [filteredData]);

  return {
    allData,
    filteredData,
    metrics,
    categoryData,
    allCategories,
    isLoading,
    error,
    dateRange
  };
}
