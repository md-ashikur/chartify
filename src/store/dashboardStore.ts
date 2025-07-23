import { create } from 'zustand';
import { subDays } from 'date-fns';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DashboardState {
  dateRange: DateRange;
  setDateRange: (startDate: Date, endDate: Date) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dateRange: {
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  },
  setDateRange: (startDate: Date, endDate: Date) =>
    set({ dateRange: { startDate, endDate } }),
  selectedCategories: [],
  setSelectedCategories: (categories: string[]) =>
    set({ selectedCategories: categories }),
  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}));
