import { useState, useCallback } from 'react';
import { QuestionStatus } from '../types';

const STORAGE_KEY = 'question_status';

export const useQuestionStatus = (totalQuestions: number) => {
  const [questionStatus, setQuestionStatus] = useState<Record<number, QuestionStatus>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Initialize with default status
    const initial: Record<number, QuestionStatus> = {};
    for (let i = 0; i < totalQuestions; i++) {
      initial[i] = {
        status: 'not-attempted',
        code: '',
        languageId: 71, // Default to Python
      };
    }
    return initial;
  });

  const saveToStorage = useCallback((status: Record<number, QuestionStatus>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
  }, []);

  const updateQuestionStatus = useCallback((
    questionIndex: number,
    updates: Partial<QuestionStatus>
  ) => {
    setQuestionStatus(prev => {
      const newStatus = {
        ...prev,
        [questionIndex]: { ...prev[questionIndex], ...updates }
      };
      saveToStorage(newStatus);
      return newStatus;
    });
  }, [saveToStorage]);

  const getQuestionStatus = useCallback((questionIndex: number) => {
    return questionStatus[questionIndex] || {
      status: 'not-attempted',
      code: '',
      languageId: 71,
    };
  }, [questionStatus]);

  return {
    questionStatus,
    updateQuestionStatus,
    getQuestionStatus,
  };
};