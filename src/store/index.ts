import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode } from '../types';

interface AppState {
  apiKey: string;
  setApiKey: (key: string) => void;
  openaiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
  isSettingsComplete: boolean;
  setSettingsComplete: (complete: boolean) => void;
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  isGenerating: boolean;
  setGenerating: (generating: boolean) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      openaiApiKey: '',
      setOpenaiApiKey: (key) => set({ openaiApiKey: key }),
      isSettingsComplete: false,
      setSettingsComplete: (complete) => set({ isSettingsComplete: complete }),
      isInitialized: false,
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      isSidebarExpanded: false,
      toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
      isGenerating: false,
      setGenerating: (generating) => set({ isGenerating: generating }),
      theme: 'light' as ThemeMode,
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-storage',
    }
  )
);