"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ScanHistoryItem } from '@/types';

const HISTORY_KEY = 'net-patrol-history';

export const useScanHistory = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      setHistory([]);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  const addScanToHistory = useCallback((scan: ScanHistoryItem) => {
    // We update the state immediately for responsiveness,
    // and then persist to localStorage.
    setHistory(prevHistory => {
      const newHistory = [scan, ...prevHistory].slice(0, 20); // Keep last 20 scans
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error("Failed to clear history from localStorage", error);
    }
  }, []);

  return { history: isLoaded ? history : [], addScanToHistory, clearHistory };
};
