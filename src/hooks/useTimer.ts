import { useState, useEffect, useCallback } from 'react';
import { TimerState } from '../types';

const TIMER_KEY = 'assessment_timer';
const INITIAL_TIME = 60 * 60; // 60 minutes in seconds

export const useTimer = (onTimeUp: () => void) => {
  const [timer, setTimer] = useState<TimerState>(() => {
    const saved = localStorage.getItem(TIMER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
      const remaining = Math.max(0, parsed.timeLeft - elapsed);
      return {
        timeLeft: remaining,
        isActive: remaining > 0,
        startTime: parsed.startTime,
      };
    }
    return {
      timeLeft: INITIAL_TIME,
      isActive: true,
      startTime: Date.now(),
    };
  });

  const saveTimer = useCallback((newTimer: TimerState) => {
    localStorage.setItem(TIMER_KEY, JSON.stringify(newTimer));
  }, []);

  useEffect(() => {
    if (!timer.isActive) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        const newTimer = { ...prev, timeLeft: newTimeLeft };
        
        if (newTimeLeft <= 0) {
          newTimer.isActive = false;
          localStorage.removeItem(TIMER_KEY);
          onTimeUp();
        } else {
          saveTimer(newTimer);
        }
        
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isActive, onTimeUp, saveTimer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWarningLevel = (): 'normal' | 'warning' | 'danger' => {
    if (timer.timeLeft <= 300) return 'danger'; // 5 minutes
    if (timer.timeLeft <= 600) return 'warning'; // 10 minutes
    return 'normal';
  };

  return {
    timeLeft: timer.timeLeft,
    formattedTime: formatTime(timer.timeLeft),
    warningLevel: getWarningLevel(),
    isActive: timer.isActive,
  };
};