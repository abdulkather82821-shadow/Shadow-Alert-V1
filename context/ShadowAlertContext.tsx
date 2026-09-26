import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Appearance, Platform } from 'react-native';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type AppCategory = 'Social' | 'Entertainment' | 'News' | 'Games' | 'Focus';
export interface MonitoredApp {
  id: string;
  name: string;
  category: AppCategory;
  icon: string;
  color: string;
  limitMinutes: number;
  usageMinutes: number;
  paused: boolean;
  history: number[];
}
export interface UsageSession {
  id: string;
  appId: string;
  minutes: number;
  createdAt: string;
}
export interface BlockEvent {
  id: string;
  appId: string;
  at: string;
  minutes: number;
}
export interface AlertSettings {
  alerts: boolean;
  monitoring: boolean;
  darkMode: boolean;
  intention: string;
}
interface StoreShape {
  apps: MonitoredApp[];
  sessions: UsageSession[];
  blocks: BlockEvent[];
  settings: AlertSettings;
}

const STORAGE_KEY = '@shadow-alert/store-v1';
const seed: StoreShape = {
  apps: [
    { id: 'instagram', name: 'Instagram', category: 'Social', icon: 'camera', color: '#C96D5B', limitMinutes: 35, usageMinutes: 22, paused: false, history: [31, 28, 44, 18, 35, 27, 22] },
    { id: 'youtube', name: 'YouTube', category: 'Entertainment', icon: 'play', color: '#B95C57', limitMinutes: 45, usageMinutes: 38, paused: false, history: [52, 40, 47, 31, 63, 29, 38] },
    { id: 'reddit', name: 'Reddit', category: 'Social', icon: 'message-circle', color: '#C77B4A', limitMinutes: 25, usageMinutes: 9, paused: false, history: [16, 21, 34, 12, 18, 11, 9] },
    { id: 'netflix', name: 'Netflix', category: 'Entertainment', icon: 'tv', color: '#8C5A68', limitMinutes: 60, usageMinutes: 0, paused: false, history: [42, 0, 68, 55, 0, 74, 0] },
    { id: 'forest', name: 'Forest', category: 'Focus', icon: 'feather', color: '#6E806B', limitMinutes: 90, usageMinutes: 48, paused: false, history: [52, 64, 38, 71, 45, 59, 48] },
  ],
  sessions: [],
  blocks: [],
  settings: { alerts: true, monitoring: true, darkMode: false, intention: 'Use what helps. Leave what pulls.' },
};

type ContextValue = StoreShape & {
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
  updateLimit: (id: string, minutes: number) => void;
  simulateUsage: (id: string, minutes: number) => void;
  togglePaused: (id: string) => void;
  recoverFromBlock: (id: string) => void;
  deleteApp: (id: string) => void;
  addApp: (app: Omit<MonitoredApp, 'history' | 'usageMinutes' | 'paused'>) => void;
  toggleSetting: (key: keyof Pick<AlertSettings, 'alerts' | 'monitoring' | 'darkMode'>) => void;
  clearHistory: () => void;
  resetLimits: () => void;
};
const ShadowAlertContext = createContext<ContextValue | null>(null);

export function ShadowAlertProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreShape>(seed);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!mounted) return;
      if (raw) {
        try { setStore(JSON.parse(raw) as StoreShape); } catch { setHasError(true); }
      }
      setIsLoading(false);
    }).catch(() => { if (mounted) { setHasError(true); setIsLoading(false); } });
    return () => { mounted = false; };
  }, [reloadKey]);

  useEffect(() => {
    if (!isLoading && !hasError) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store)).catch(() => undefined);
  }, [store, isLoading, hasError]);

  useEffect(() => {
    if (Platform.OS !== 'web' && typeof Appearance.setColorScheme === 'function') {
      Appearance.setColorScheme(store.settings.darkMode ? 'dark' : 'light');
    }
  }, [store.settings.darkMode]);

  const update = (fn: (prev: StoreShape) => StoreShape) => setStore((prev) => fn(prev));
  const updateLimit = (id: string, minutes: number) => update((prev) => ({ ...prev, apps: prev.apps.map((app) => app.id === id ? { ...app, limitMinutes: minutes } : app) }));
  const simulateUsage = (id: string, minutes: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    update((prev) => {
      const app = prev.apps.find((item) => item.id === id);
      if (!app || app.paused || !prev.settings.monitoring) return prev;
      const nextUsage = app.usageMinutes + minutes;
      const crossed = app.usageMinutes < app.limitMinutes && nextUsage >= app.limitMinutes;
      return {
        ...prev,
        apps: prev.apps.map((item) => item.id === id ? { ...item, usageMinutes: nextUsage, history: [...item.history.slice(-6), nextUsage] } : item),
        sessions: [...prev.sessions, { id: `${Date.now()}`, appId: id, minutes, createdAt: new Date().toISOString() }],
        blocks: crossed ? [...prev.blocks, { id: `${Date.now()}-block`, appId: id, at: new Date().toISOString(), minutes: nextUsage }] : prev.blocks,
      };
    });
  };
  const togglePaused = (id: string) => update((prev) => ({ ...prev, apps: prev.apps.map((app) => app.id === id ? { ...app, paused: !app.paused } : app) }));
  const recoverFromBlock = (id: string) => update((prev) => ({ ...prev, apps: prev.apps.map((app) => app.id === id ? { ...app, usageMinutes: Math.max(0, app.limitMinutes - 5), history: [...app.history.slice(-6), Math.max(0, app.limitMinutes - 5)] } : app) }));
  const deleteApp = (id: string) => update((prev) => ({ ...prev, apps: prev.apps.filter((app) => app.id !== id), sessions: prev.sessions.filter((session) => session.appId !== id) }));
  const addApp = (app: Omit<MonitoredApp, 'history' | 'usageMinutes' | 'paused'>) => update((prev) => ({ ...prev, apps: [...prev.apps, { ...app, usageMinutes: 0, paused: false, history: [0, 0, 0, 0, 0, 0, 0] }] }));
  const toggleSetting = (key: keyof Pick<AlertSettings, 'alerts' | 'monitoring' | 'darkMode'>) => update((prev) => ({ ...prev, settings: { ...prev.settings, [key]: !prev.settings[key] } }));
  const clearHistory = () => update((prev) => ({ ...prev, sessions: [], blocks: [], apps: prev.apps.map((app) => ({ ...app, usageMinutes: 0, history: [0, 0, 0, 0, 0, 0, 0] })) }));
  const resetLimits = () => update((prev) => ({ ...prev, apps: prev.apps.map((app) => ({ ...app, limitMinutes: 30 })) }));
  const value = useMemo(() => ({ ...store, isLoading, hasError, retry: () => { setHasError(false); setIsLoading(true); setReloadKey((key) => key + 1); }, updateLimit, simulateUsage, togglePaused, recoverFromBlock, deleteApp, addApp, toggleSetting, clearHistory, resetLimits }), [store, isLoading, hasError]);
  return <ShadowAlertContext.Provider value={value}>{children}</ShadowAlertContext.Provider>;
}
export function useShadowAlert() {
  const value = useContext(ShadowAlertContext);
  if (!value) throw new Error('useShadowAlert must be used within ShadowAlertProvider');
  return value;
}