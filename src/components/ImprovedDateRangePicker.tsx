'use client';

import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, subMonths, addMonths, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, getYear, setYear } from 'date-fns';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (startDate: Date, endDate: Date) => void;
}

export default function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'calendar'>('presets');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const presets = [
    {
      label: 'Last 7 days',
      value: () => ({
        start: subDays(new Date(), 7),
        end: new Date()
      })
    },
    {
      label: 'Last 30 days',
      value: () => ({
        start: subDays(new Date(), 30),
        end: new Date()
      })
    },
    {
      label: 'This month',
      value: () => ({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      })
    },
    {
      label: 'Last month',
      value: () => ({
        start: startOfMonth(subMonths(new Date(), 1)),
        end: endOfMonth(subMonths(new Date(), 1))
      })
    },
    {
      label: 'Last 90 days',
      value: () => ({
        start: subDays(new Date(), 90),
        end: new Date()
      })
    }
  ];

  const handlePresetSelect = (preset: typeof presets[0]) => {
    const range = preset.value();
    onChange(range.start, range.end);
    setIsOpen(false);
    resetCalendarSelection();
  };

  const handleDateClick = (date: Date) => {
    if (selectingStart) {
      setTempStartDate(date);
      setTempEndDate(null);
      setSelectingStart(false);
    } else {
      if (tempStartDate && date >= tempStartDate) {
        setTempEndDate(date);
      } else if (tempStartDate && date < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      }
    }
  };

  const handleApplyDates = () => {
    if (tempStartDate && tempEndDate) {
      onChange(tempStartDate, tempEndDate);
      setIsOpen(false);
      resetCalendarSelection();
    }
  };

  const isDateInRange = (date: Date) => {
    if (tempStartDate && tempEndDate) {
      return isWithinInterval(date, { start: tempStartDate, end: tempEndDate });
    }
    if (tempStartDate && !selectingStart) {
      // Show potential range
      const currentDate = new Date();
      const start = tempStartDate < currentDate ? tempStartDate : currentDate;
      const end = tempStartDate < currentDate ? currentDate : tempStartDate;
      return isWithinInterval(date, { start, end });
    }
    return false;
  };

  const isDateSelected = (date: Date) => {
    return (tempStartDate && isSameDay(date, tempStartDate)) || 
           (tempEndDate && isSameDay(date, tempEndDate)) ||
           (!tempStartDate && !tempEndDate && (isSameDay(date, startDate) || isSameDay(date, endDate)));
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  const resetCalendarSelection = () => {
    setSelectingStart(true);
    setTempStartDate(null);
    setTempEndDate(null);
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(setYear(currentMonth, year));
    setShowYearPicker(false);
  };

  const currentYear = getYear(currentMonth);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const getInstructionText = () => {
    if (!tempStartDate) return 'Select start date';
    if (!tempEndDate) return 'Select end date';
    return `${format(tempStartDate, 'MMM dd')} - ${format(tempEndDate, 'MMM dd')}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd')}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              resetCalendarSelection();
            }}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl z-20">
            {/* Tab Navigation */}
            <div className="flex border-b border-white/20">
              <button
                onClick={() => {
                  setActiveTab('presets');
                  resetCalendarSelection();
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'presets'
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Quick Select
              </button>
              <button
                onClick={() => {
                  setActiveTab('calendar');
                  resetCalendarSelection();
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'calendar'
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Custom Range
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'presets' ? (
                <div className="space-y-2">
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetSelect(preset)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-1 text-slate-300 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowYearPicker(!showYearPicker)}
                        className="text-white font-semibold hover:bg-white/10 px-2 py-1 rounded transition-colors"
                      >
                        {format(currentMonth, 'MMMM yyyy')}
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-1 text-slate-300 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Year Picker */}
                  {showYearPicker && (
                    <div className="grid grid-cols-5 gap-2 mb-4 p-3 bg-white/5 rounded-lg">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => handleYearSelect(year)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            year === currentYear
                              ? 'bg-blue-500 text-white'
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="text-center text-xs text-slate-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {getDaysInMonth().map((date) => {
                      const isCurrentMonth = isSameMonth(date, currentMonth);
                      const isSelected = isDateSelected(date);
                      const isInRange = isDateInRange(date);

                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => handleDateClick(date)}
                          disabled={!isCurrentMonth}
                          className={`
                            w-8 h-8 text-xs rounded transition-colors
                            ${!isCurrentMonth 
                              ? 'text-slate-600 cursor-not-allowed' 
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                            }
                            ${isSelected ? 'bg-blue-500 text-white' : ''}
                            ${isInRange && !isSelected ? 'bg-blue-500/30' : ''}
                          `}
                        >
                          {format(date, 'd')}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar Instructions & Actions */}
                  <div className="border-t border-white/20 pt-4">
                    <div className="text-xs text-slate-400 text-center mb-3">
                      {getInstructionText()}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={resetCalendarSelection}
                        className="flex-1 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleApplyDates}
                        disabled={!tempStartDate || !tempEndDate}
                        className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed rounded transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
