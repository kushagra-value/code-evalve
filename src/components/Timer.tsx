import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  formattedTime: string;
  warningLevel: 'normal' | 'warning' | 'danger';
}

export const Timer: React.FC<TimerProps> = ({ formattedTime, warningLevel }) => {
  const getTimerStyles = () => {
    switch (warningLevel) {
      case 'danger':
        return 'bg-red-600 text-white animate-pulse';
      case 'warning':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  return (
    <div className={`flex items-center justify-center py-4 px-8 rounded-lg font-mono text-2xl font-bold transition-all duration-300 ${getTimerStyles()}`}>
      <Clock className="mr-3" size={28} />
      <span>{formattedTime}</span>
      {warningLevel !== 'normal' && (
        <AlertTriangle className="ml-3 animate-bounce" size={28} />
      )}
    </div>
  );
};