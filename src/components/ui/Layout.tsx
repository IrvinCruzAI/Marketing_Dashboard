import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { db } from '../../lib/db';
import { SettingsForm } from '../settings/SettingsForm';
import { Dashboard } from '../dashboard/Dashboard';
import { SeoGenerator } from '../generators/SeoGenerator';
import { EmailGenerator } from '../generators/EmailGenerator';
import { SocialGenerator } from '../generators/SocialGenerator';
import { LeadMagnetGenerator } from '../generators/LeadMagnetGenerator';
import { ImageGenerator } from '../generators/ImageGenerator';
import { RepurposeGenerator } from '../generators/RepurposeGenerator';
import { AssetLibrary } from '../library/AssetLibrary';
import { ApiKeyForm } from '../settings/ApiKeyForm';
import { Asset } from '../../types';

export const Layout = () => {
  const { 
    isSettingsComplete, 
    setSettingsComplete, 
    apiKey,
    setApiKey,
    isSidebarExpanded,
    theme
  } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState(getActiveTab(location.pathname));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Update active tab when route changes
  useEffect(() => {
    setActiveTab(getActiveTab(location.pathname));
  }, [location]);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check if settings are complete
  useEffect(() => {
    const checkSettings = async () => {
      const settings = await db.getSettings();
      setSettingsComplete(!!settings);
    };

    checkSettings();
  }, [setSettingsComplete]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results = await db.searchAssets(query);
    setSearchResults(results);
  };

  const handleTabChange = (tab: string) => {
    const path = getPathFromTab(tab);
    navigate(path);
    setIsSearching(false);
    setSearchQuery('');
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const renderContent = () => {
    // If API key is not set, show API key form
    if (!apiKey) {
      return <ApiKeyForm mode="initial" />;
    }

    // If settings are not complete, show settings form
    if (!isSettingsComplete) {
      return (
        <div className="space-y-8">
          <ApiKeyForm mode="settings" />
          <SettingsForm />
        </div>
      );
    }

    // If searching, show search results
    if (isSearching && searchQuery) {
      return <AssetLibrary searchResults={searchResults} searchQuery={searchQuery} />;
    }

    // Otherwise, show the active tab content
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <SettingsForm />;
      case 'seo':
        return <SeoGenerator />;
      case 'email':
        return <EmailGenerator />;
      case 'social':
        return <SocialGenerator />;
      case 'leadMagnet':
        return <LeadMagnetGenerator />;
      case 'image':
        return <ImageGenerator />;
      case 'repurpose':
        return <RepurposeGenerator />;
      case 'library':
        return <AssetLibrary />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <Header 
        activeTab={activeTab} 
        onSearch={handleSearch}
        onOpenCreate={openCreateModal}
      />
      
      <main 
        className="transition-all duration-300 ease-ease-custom pt-16"
        style={{ 
          marginLeft: isSidebarExpanded ? '220px' : '64px'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname + (isSearching ? '-search' : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<SettingsForm />} />
              <Route path="/seo" element={<SeoGenerator />} />
              <Route path="/email" element={<EmailGenerator />} />
              <Route path="/social" element={<SocialGenerator />} />
              <Route path="/lead-magnet" element={<LeadMagnetGenerator />} />
              <Route path="/image" element={<ImageGenerator />} />
              <Route path="/repurpose" element={<RepurposeGenerator />} />
              <Route path="/library" element={<AssetLibrary />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Create Asset Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white dark:bg-surface rounded-2xl p-6 w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Create New Asset</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button
                  className="card hover:shadow-lg transition-all p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    navigate('/seo');
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                  </div>
                  <span className="font-medium text-sm">SEO Article</span>
                </button>
                
                <button
                  className="card hover:shadow-lg transition-all p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    navigate('/email');
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <span className="font-medium text-sm">Email Campaign</span>
                </button>
                
                <button
                  className="card hover:shadow-lg transition-all p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    navigate('/social');
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400"><path d="M18 8L22 4L18 0M18 0V22M6 8L2 4L6 0M6 0V22"/></svg>
                  </div>
                  <span className="font-medium text-sm">Social Post</span>
                </button>
                
                <button
                  className="card hover:shadow-lg transition-all p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    navigate('/lead-magnet');
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400"><path d="M12 17v4M8 21h8M7 4h10M17 4v6.5a3.5 3.5 0 0 1-7 0V4"/></svg>
                  </div>
                  <span className="font-medium text-sm">Lead Magnet</span>
                </button>

                <button
                  className="card hover:shadow-lg transition-all p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    navigate('/image');
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600 dark:text-pink-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </div>
                  <span className="font-medium text-sm">AI Image</span>
                </button>

                <button
                  className="card hover:shadow-lg transition-all p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    navigate('/repurpose');
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 dark:text-teal-400"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                  </div>
                  <span className="font-medium text-sm">Repurpose Content</span>
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  className="btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function getActiveTab(pathname: string): string {
  switch (pathname) {
    case '/':
      return 'dashboard';
    case '/settings':
      return 'settings';
    case '/seo':
      return 'seo';
    case '/email':
      return 'email';
    case '/social':
      return 'social';
    case '/lead-magnet':
      return 'leadMagnet';
    case '/image':
      return 'image';
    case '/repurpose':
      return 'repurpose';
    case '/library':
      return 'library';
    default:
      return 'dashboard';
  }
}

function getPathFromTab(tab: string): string {
  switch (tab) {
    case 'dashboard':
      return '/';
    case 'settings':
      return '/settings';
    case 'seo':
      return '/seo';
    case 'email':
      return '/email';
    case 'social':
      return '/social';
    case 'leadMagnet':
      return '/lead-magnet';
    case 'image':
      return '/image';
    case 'repurpose':
      return '/repurpose';
    case 'library':
      return '/library';
    default:
      return '/';
  }
}