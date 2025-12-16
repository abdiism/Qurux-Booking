import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return days;
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const isToday = (d: Date) => isSameDay(d, new Date());

  return (
    <div className="clay-card p-4 rounded-3xl bg-white/60">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-bold text-lg text-stone-800">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={handleNextMonth} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-bold text-stone-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} />;
          
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentDay = isToday(date);
          const isPast = date < new Date(new Date().setHours(0,0,0,0));

          return (
            <button
              key={index}
              disabled={isPast}
              onClick={() => onSelectDate(date)}
              className={`
                h-10 w-full rounded-xl flex items-center justify-center text-sm font-semibold transition-all relative
                ${isSelected 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                  : isPast 
                    ? 'text-stone-300 cursor-not-allowed'
                    : 'text-stone-700 hover:bg-rose-100 hover:text-rose-600'
                }
              `}
            >
              {date.getDate()}
              {isCurrentDay && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};