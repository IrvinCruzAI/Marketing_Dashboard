import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Moon, Sun, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { cn } from '../../lib/utils';
import { BusinessSettings } from '../../types';

interface HeaderProps {
  activeTab: string;
  onSearch: (query: string) => void;
  onOpenCreate: () => void;
}

export const Header = ({ activeTab, onSearch, onOpenCreate }: HeaderProps) => {
  const { theme, toggleTheme } = useAppStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-surface/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-10 pl-16 md:pl-64 flex items-center">
      <div className="h-full flex items-center justify-between px-4 w-full">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">
            <span className="hidden md:inline">Marketing Dashboard</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative w-32 sm:w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="input pl-10 py-1.5 text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <motion.button
            data-create-button
            className="btn-ghost flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
            onClick={onOpenCreate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create</span>
          </motion.button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-gray-700" />
            ) : (
              <Sun size={20} className="text-gray-300" />
            )}
          </button>
            
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => navigate('/settings')}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

function getTabTitle(tab: string): string {
  switch (tab) {
    case 'dashboard':
      return 'Dashboard';
    case 'settings':
      return 'Settings';
    case 'seo':
      return 'SEO Generator';
    case 'email':
      return 'Email Generator';
    case 'social':
      return 'Social Studio';
    case 'leadMagnet':
      return 'Lead Magnets';
    case 'image':
      return 'AI Images';
    case 'repurpose':
      return 'Repurpose';
    case 'library':
      return 'Library';
    default:
      return 'Dashboard';
  }
}