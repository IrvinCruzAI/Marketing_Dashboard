import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, FileText, Mail, Share2, Download, 
  Package, Home, ChevronLeft, ChevronRight, Image as ImageIcon, Recycle 
} from 'lucide-react';
import { useAppStore } from '../../store';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

const SidebarLink = ({ icon, label, isActive, isExpanded, onClick }: SidebarLinkProps) => {
  return (
    <motion.button
      className={cn('sidebar-link', isActive && 'active')}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { isSidebarExpanded, toggleSidebar } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isSidebarExpanded || isHovered;

  // Handle window resize to auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSidebarExpanded) {
        toggleSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarExpanded, toggleSidebar]);

  return (
    <motion.div
      className="fixed left-0 top-0 h-screen bg-white dark:bg-surface shadow-md z-20 flex flex-col"
      initial={{ width: 64 }}
      animate={{ width: isExpanded ? 220 : 64 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
        <motion.div 
          className="flex items-center justify-center px-2"
          animate={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-2">
            <img 
              src="/Future Crafters (Logo) (1).svg" 
              alt="FutureCrafters.AI" 
              className="w-8 h-8"
            />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-lg whitespace-nowrap overflow-hidden"
              >
                FutureCrafters.ai
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto">
        <SidebarLink
          icon={<Home size={20} />}
          label="Dashboard"
          isActive={activeTab === 'dashboard'}
          isExpanded={isExpanded}
          onClick={() => onTabChange('dashboard')}
        />
        <SidebarLink
          icon={<Settings size={20} />}
          label="Settings"
          isActive={activeTab === 'settings'}
          isExpanded={isExpanded}
          onClick={() => onTabChange('settings')}
        />

        <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
          <div className={cn("px-3 py-2 text-xs text-gray-500", !isExpanded && "sr-only")}>
            GENERATORS
          </div>
        </div>

        <SidebarLink
          icon={<FileText size={20} />}
          label="SEO Articles"
          isActive={activeTab === 'seo'}
          isExpanded={isExpanded}
          onClick={() => onTabChange('seo')}
        />
        <SidebarLink
          icon={<Mail size={20} />}
          label="Email Campaigns"
          isActive={activeTab === 'email'}
          isExpanded={isExpanded}
          onClick={() => onTabChange('email')}
        />
        <SidebarLink
          icon={<Share2 size={20} />}
          label="Social Studio"
          isActive={activeTab === 'social'}
          isExpanded={isExpanded}
          onClick={() => onTabChange('social')}
        />
        <SidebarLink
          icon={<Download size={20} />}
          label="Lead Magnets"
          isActive={activeTab === 'leadMagnet'}
          isExpanded={isExpanded}
          onClick={() => onTabChange('leadMagnet')}
        />
        <SidebarLink
          icon={<ImageIcon size={20} />}
          label="AI Images"
          isActive={activeTab === 'image'}
          isExpanded={isExpanded}
          onClick={() => onTabChange('image')}
        />
        <SidebarLink
          icon={<Recycle size={20} />}
          label="Repurpose Content"
          isActive={activeTab === 'repurpose'}
          isExpanded={isExpanded}
          onClick={() => onTabChange('repurpose')}
        />

        <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
          <div className={cn("px-3 py-2 text-xs text-gray-500", !isExpanded && "sr-only")}>
            LIBRARY
          </div>
          <SidebarLink
          icon={<Package size={20} />}
          label="Asset Library"
          isActive={activeTab === 'library'}
          isExpanded={isExpanded}
          onClick={() => onTabChange('library')}
          />
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isSidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </motion.div>
  );
};