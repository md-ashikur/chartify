'use client';

import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, subMonths, addMonths, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval } from 'date-fns';

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
  };

  const handleDateClick = (date: Date) => {
    if (selectingStart) {
      setTempStartDate(date);
      setSelectingStart(false);
    } else {
      if (tempStartDate && date >= tempStartDate) {
        onChange(tempStartDate, date);
        setIsOpen(false);
        setSelectingStart(true);
        setTempStartDate(null);
      } else if (tempStartDate && date < tempStartDate) {
        onChange(date, tempStartDate);
        setIsOpen(false);
        setSelectingStart(true);
        setTempStartDate(null);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (tempStartDate && !selectingStart) {
      const start = tempStartDate;
      const end = date;
      return isWithinInterval(date, { start: start < end ? start : end, end: start < end ? end : start });
    }
    return isWithinInterval(date, { start: startDate, end: endDate });
  };

  const isDateSelected = (date: Date) => {
    return isSameDay(date, startDate) || isSameDay(date, endDate) || (tempStartDate && isSameDay(date, tempStartDate));
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  const resetCalendarSelection = () => {
    setSelectingStart(true);
    setTempStartDate(null);
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
          <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl z-20">
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
                Calendar
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
                    <h3 className="text-white font-semibold">
                      {format(currentMonth, 'MMMM yyyy')}
                    </h3>
                    <button
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-1 text-slate-300 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="text-center text-xs text-slate-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
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

                  {/* Calendar Instructions */}
                  <div className="mt-4 text-xs text-slate-400 text-center">
                    {selectingStart ? 'Select start date' : 'Select end date'}
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
