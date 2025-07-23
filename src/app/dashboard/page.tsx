'use client';

import { format } from 'date-fns';
import ImprovedDateRangePicker from '@/components/ImprovedDateRangePicker';
import CategoryFilter from '@/components/CategoryFilter';
import FilterStatus from '@/components/FilterStatus';
import MetricsCards from '@/components/MetricsCards';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import AreaChart from '@/components/charts/AreaChart';
import RadarChart from '@/components/charts/RadarChart';
import { useDashboardStore } from '@/store/dashboardStore';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

export default function Dashboard() {
  const { dateRange, setDateRange, selectedCategories, setSelectedCategories } = useDashboardStore();
  const { allData, filteredData, metrics, allCategories, isLoading, error } = useAnalyticsData();

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange(startDate, endDate);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading data</div>
          <div className="text-slate-300">Please try refreshing the page</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="lg:max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-slate-300">
              {format(dateRange.startDate, 'MMM dd, yyyy')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
              {selectedCategories.length > 0 && (
                <span className="ml-2 text-blue-400">
                  • {selectedCategories.length === allCategories.length ? 'All Categories' : `${selectedCategories.length} Categories`}
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <CategoryFilter
              categories={allCategories}
              selectedCategories={selectedCategories}
              onChange={handleCategoryChange}
            />
            <ImprovedDateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={handleDateRangeChange}
            />
          </div>
        </div>

        {/* Filter Status */}
        <FilterStatus
          dateRange={dateRange}
          selectedCategories={selectedCategories}
          allCategories={allCategories}
          totalItems={allData.length}
          filteredItems={filteredData.length}
        />

        {/* Metrics Cards */}
        <MetricsCards metrics={metrics} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Revenue Trend</h3>
            <LineChart data={filteredData} />
          </div>

          {/* Bar Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Monthly Sales</h3>
            <BarChart data={filteredData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Category Distribution</h3>
            <PieChart data={filteredData} />
          </div>

          {/* Area Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">User Growth</h3>
            <AreaChart data={filteredData} />
          </div>

          {/* Radar Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
            <RadarChart data={filteredData} />
          </div>
        </div>
      </div>
    </div>
  );
}
