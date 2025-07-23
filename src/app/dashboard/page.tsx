'use client';

import { useState, useMemo } from 'react';
import { subDays, format, isWithinInterval } from 'date-fns';
import DateRangePicker from '@/components/DateRangePicker';
import MetricsCards from '@/components/MetricsCards';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import AreaChart from '@/components/charts/AreaChart';
import RadarChart from '@/components/charts/RadarChart';
import { generateMockData } from '@/utils/mockData';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date()
  });

  // Generate mock data
  const allData = useMemo(() => generateMockData(), []);

  // Filter data based on date range
  const filteredData = useMemo(() => {
    return allData.filter(item => 
      isWithinInterval(new Date(item.date), {
        start: dateRange.startDate,
        end: dateRange.endDate
      })
    );
  }, [allData, dateRange]);

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate });
  };

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
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={handleDateRangeChange}
            />
          </div>
        </div>

        {/* Metrics Cards */}
        <MetricsCards data={filteredData} />

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
