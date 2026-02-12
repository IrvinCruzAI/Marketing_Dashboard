import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Mail, Share2, Download, ChevronRight, ClipboardList, Clock, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { Asset, BusinessSettings } from '../../types';
import { formatDate } from '../../lib/utils';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const settingsData = await db.getSettings();
        setSettings(settingsData);

        const assetsData = await db.getAssets();
        setAssets(assetsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getAssetCounts = () => {
    const counts = {
      seo: 0,
      email: 0,
      social: 0,
      leadMagnet: 0,
      image: 0,
      total: 0,
      published: 0
    };

    assets.forEach(asset => {
      counts[asset.type]++;
      counts.total++;
      if (asset.status === 'published') {
        counts.published++;
      }
    });

    return counts;
  };

  const counts = getAssetCounts();
  const recentAssets = assets.slice(0, 5);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">
            Welcome back, {settings?.name ? settings.name.split(' ')[0] : 'User'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Assets</h3>
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-semibold">{counts.total}</p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">SEO Articles</h3>
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <FileText size={18} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-semibold">{counts.seo}</p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Campaigns</h3>
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Mail size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-semibold">{counts.email}</p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Social Posts</h3>
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Share2 size={18} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-semibold">{counts.social}</p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Generated Images</h3>
                <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                  <ImageIcon size={18} className="text-pink-600 dark:text-pink-400" />
                </div>
              </div>
              <p className="text-3xl font-semibold">{counts.image}</p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Lead Magnets</h3>
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Download size={18} className="text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <p className="text-3xl font-semibold">{counts.leadMagnet}</p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Drafts</h3>
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <ClipboardList size={18} className="text-gray-600 dark:text-gray-400" />
                </div>
              </div>
              <p className="text-3xl font-semibold">{assets.filter(a => a.status === 'draft').length}</p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">In Review</h3>
                <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Clock size={18} className="text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <p className="text-3xl font-semibold">{assets.filter(a => a.status === 'review').length}</p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Published</h3>
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-semibold">{counts.published}</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Assets</h3>
                <button 
                  onClick={() => navigate('/library')}
                  className="text-sm text-brand-600 hover:underline flex items-center"
                >
                  View all <ChevronRight size={16} />
                </button>
              </div>

              {recentAssets.length > 0 ? (
                <div className="space-y-3">
                  {recentAssets.map((asset) => (
                    <div 
                      key={asset.id} 
                      className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getAssetIcon(asset.type)}
                          <div>
                            <p className="font-medium">{getAssetTitle(asset)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(asset.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className={`status-pill ${getStatusClass(asset.status)}`}>
                          {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  <p>No assets created yet</p>
                  <p className="text-sm mt-2">Start creating content using the generators</p>
                </div>
              )}
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold mb-4">Quick Start</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  onClick={() => navigate('/seo')}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium mb-1">Create SEO Article</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Generate optimized blog content</p>
                </a>

                <a
                  onClick={() => navigate('/email')}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                    <Mail size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium mb-1">Create Email</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Design engaging email campaigns</p>
                </a>

                <a
                  onClick={() => navigate('/social')}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <Share2 size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-medium mb-1">Create Social Post</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Generate platform-specific posts</p>
                </a>

                <a
                  onClick={() => navigate('/lead-magnet')}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3 group-hover:bg-amber-200 dark:group-hover:bg-amber-800 transition-colors">
                    <Download size={20} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="font-medium mb-1">Create Lead Magnet</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Build resources to capture leads</p>
                </a>
              </div>
            </motion.div>
          </div>
          
          {/* Asset View Modal */}
          {isViewModalOpen && selectedAsset && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
              onClick={() => setIsViewModalOpen(false)}
            >
              <div 
                className="bg-white dark:bg-surface rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getAssetIcon(selectedAsset.type)}
                    <h2 className="text-lg font-semibold">{getAssetTitle(selectedAsset)}</h2>
                  </div>
                  <button 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>
                
                <div className="overflow-y-auto flex-1 p-6">
                  {selectedAsset.type === 'seo' && (
                    <>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedAsset.data.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {selectedAsset.data.imagePrompt && (
                        <div className="mb-6">
                          <h3 className="font-medium mb-2">Image Prompt</h3>
                          <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            {selectedAsset.data.imagePrompt}
                          </p>
                        </div>
                      )}
                      <div 
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedAsset.data.content }}
                      />
                    </>
                  )}
                  
                  {selectedAsset.type === 'email' && (
                    <>
                      <div className="mb-4">
                        <h3 className="font-medium">Subject: {selectedAsset.data.subject}</h3>
                        <p className="text-sm text-gray-500">{selectedAsset.data.previewLine}</p>
                      </div>
                      <div 
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedAsset.data.bodyHtml }}
                      />
                    </>
                  )}
                  
                  {selectedAsset.type === 'social' && (
                    <>
                      <div className="mb-4 whitespace-pre-line">{selectedAsset.data.copy}</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedAsset.data.hashtags.map((tag, index) => (
                          <span key={index} className="text-brand-600">#{tag}</span>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {selectedAsset.type === 'leadMagnet' && (
                    <>
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Outline:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedAsset.data.outline.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      {selectedAsset.data.deliverableHtml && (
                        <div 
                          className="prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedAsset.data.deliverableHtml }}
                        />
                      )}
                    </>
                  )}

                  {selectedAsset.type === 'image' && (
                    <>
                      <div className="mb-4">
                        <img
                          src={selectedAsset.data.imageUrl}
                          alt={selectedAsset.data.title}
                          className="w-full rounded-lg shadow-md"
                        />
                      </div>
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Generation Details:</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Model: {selectedAsset.data.model} • Cost: ${selectedAsset.data.cost.toFixed(3)}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Prompt:</h3>
                        <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {selectedAsset.data.prompt}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-500">
                    Created: {formatDate(selectedAsset.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

function getAssetIcon(type: string) {
  switch (type) {
    case 'seo':
      return <FileText size={18} className="text-blue-600 dark:text-blue-400" />;
    case 'email':
      return <Mail size={18} className="text-purple-600 dark:text-purple-400" />;
    case 'social':
      return <Share2 size={18} className="text-green-600 dark:text-green-400" />;
    case 'leadMagnet':
      return <Download size={18} className="text-amber-600 dark:text-amber-400" />;
    case 'image':
      return <ImageIcon size={18} className="text-pink-600 dark:text-pink-400" />;
    default:
      return <FileText size={18} />;
  }
}

function getAssetTitle(asset: Asset): string {
  switch (asset.type) {
    case 'seo':
      return asset.data.title;
    case 'email':
      return asset.data.subject;
    case 'social':
      return `${asset.data.platform === 'twitter' ? 'Twitter/X' : asset.data.platform.charAt(0).toUpperCase() + asset.data.platform.slice(1)} Post`;
    case 'leadMagnet':
      return asset.data.title;
    case 'image':
      return asset.data.title;
    default:
      return 'Unknown Asset';
  }
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'draft':
      return 'status-draft';
    case 'review':
      return 'status-review';
    case 'published':
      return 'status-published';
    default:
      return 'status-draft';
  }
}