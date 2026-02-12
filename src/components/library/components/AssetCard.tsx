import { motion } from 'framer-motion';
import { Eye, Edit, Trash, Image as ImageIcon } from 'lucide-react';
import { Asset } from '../../../types';
import { formatDate, getAssetTypeLabel, getStatusLabel } from '../../../lib/utils';
import { getAssetIcon } from './AssetIcons';

interface AssetCardProps {
  asset: Asset;
  onView: (asset: Asset) => void;
  onStatusChange: (id: string, status: Asset['status']) => void;
  onDelete: (id: string) => void;
}

export const AssetCard = ({ asset, onView, onStatusChange, onDelete }: AssetCardProps) => {
  const getAssetTitle = (asset: Asset): string => {
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
  };

  const getAssetSubtitle = (asset: Asset): string => {
    switch (asset.type) {
      case 'image':
        return `${asset.data.model} • $${asset.data.cost.toFixed(3)}`;
      case 'social':
        return asset.data.platform === 'twitter' ? 'Twitter/X' : asset.data.platform;
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-800 transition-colors"
      onClick={() => onView(asset)}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {asset.type === 'image' ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              <img
                src={asset.data.imageUrl}
                alt={asset.data.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              {getAssetIcon(asset.type)}
            </div>
          )}
          <div>
            <h3 className="font-semibold">{getAssetTitle(asset)}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{getAssetTypeLabel(asset.type)}</span>
              {getAssetSubtitle(asset) && (
                <>
                  <span>•</span>
                  <span>{getAssetSubtitle(asset)}</span>
                </>
              )}
              <span>•</span>
              <span>{formatDate(asset.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`status-pill status-${asset.status}`}>
            {getStatusLabel(asset.status)}
          </div>
          
          <div className="flex items-center">
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg tooltip-container"
              onClick={(e) => {
                e.stopPropagation();
                onView(asset);
              }}
            >
              <Eye size={18} />
              <span className="tooltip">View</span>
            </button>
            
            {asset.type !== 'image' && (
              <div className="relative group">
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg tooltip-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit size={18} />
                  <span className="tooltip">Change Status</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(asset.id, 'draft');
                      }}
                    >
                      Set as Draft
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(asset.id, 'review');
                      }}
                    >
                      Move to Review
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(asset.id, 'published');
                      }}
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg tooltip-container text-error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(asset.id);
              }}
            >
              <Trash size={18} />
              <span className="tooltip">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};