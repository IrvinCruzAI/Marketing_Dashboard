import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { db } from '../../lib/db';
import { Asset, AssetType, AssetStatus } from '../../types';
import { AssetCard } from './components/AssetCard';
import { AssetFilters } from './components/AssetFilters';
import { ViewModal, DeleteModal } from './components/AssetModals';

interface AssetLibraryProps {
  searchResults?: Asset[];
  searchQuery?: string;
}

export const AssetLibrary = ({ searchResults, searchQuery }: AssetLibraryProps) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<AssetType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAsset, setEditedAsset] = useState<Asset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  useEffect(() => {
    if (searchResults) {
      setAssets(searchResults);
      setLoading(false);
      return;
    }

    const loadAssets = async () => {
      setLoading(true);
      try {
        const type = typeFilter === 'all' ? undefined : typeFilter;
        const status = statusFilter === 'all' ? undefined : statusFilter;
        const data = await db.getAssets(type, status);

        // Filter by search query if present
        const filteredData = localSearchQuery
          ? data.filter(asset => {
              const searchString = JSON.stringify(asset).toLowerCase();
              return searchString.includes(localSearchQuery.toLowerCase());
            })
          : data;

        const sortedData = sortBy === 'newest' 
          ? [...filteredData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : [...filteredData].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        setAssets(sortedData);
      } catch (error) {
        console.error('Error loading assets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [typeFilter, statusFilter, sortBy, searchResults, localSearchQuery]);

  const handleStatusChange = async (id: string, newStatus: AssetStatus) => {
    try {
      await db.updateAssetStatus(id, newStatus);
      setAssets(prev => prev.map(asset => 
        asset.id === id ? { ...asset, status: newStatus, updatedAt: new Date().toISOString() } : asset
      ));
      if (selectedAsset?.id === id) {
        setSelectedAsset(prev => prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : null);
      }
    } catch (error) {
      console.error('Error updating asset status:', error);
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditedAsset({ ...asset });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedAsset) return;
    
    setIsSaving(true);
    try {
      await db.saveAsset(editedAsset);
      setAssets(prev => prev.map(asset => 
        asset.id === editedAsset.id ? editedAsset : asset
      ));
      setSelectedAsset(editedAsset);
      setIsEditing(false);
      setEditedAsset(null);
    } catch (error) {
      console.error('Error saving asset:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditChange = (field: string, value: any) => {
    if (!editedAsset) return;
    
    setEditedAsset(prev => {
      if (!prev) return prev;
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          data: {
            ...prev.data,
            [parent]: {
              ...prev.data[parent],
              [child]: value
            }
          }
        };
      }
      
      return {
        ...prev,
        data: {
          ...prev.data,
          [field]: value
        }
      };
    });
  };

  const handleDelete = async () => {
    if (!assetToDelete) return;

    try {
      await db.deleteAsset(assetToDelete);
      setAssets(prev => prev.filter(asset => asset.id !== assetToDelete));
      setIsDeleteModalOpen(false);
      setAssetToDelete(null);
      
      if (selectedAsset?.id === assetToDelete) {
        setIsViewModalOpen(false);
        setSelectedAsset(null);
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedAsset(null);
  };

  return (
    <div>
      {searchQuery && (
        <div className="mb-4 p-3 bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-brand-200 rounded-lg">
          <p>Search results for: <strong>{searchQuery}</strong></p>
          <p className="text-sm">{assets.length} results found</p>
        </div>
      )}

      <div className="mb-6">
        <AssetFilters
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        sortBy={sortBy}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
        onSortChange={setSortBy}
        onSearch={setLocalSearchQuery}
        disabled={!!searchResults}
        />
      </div>

      {loading ? (
        <div className="space-y-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
            </div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
          <div className="mb-4 text-gray-400">
            <FileText size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No assets found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery 
              ? 'No assets match your search criteria. Try a different search term.'
              : 'Start creating content to build your asset library.'
            }
          </p>
          {!searchQuery && (
            <button 
              className="btn-primary"
              onClick={() => {
                const createButton = document.querySelector('[data-create-button]');
                if (createButton instanceof HTMLElement) {
                  createButton.click();
                }
              }}
            >
              Create Your First Asset
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onView={(asset) => {
                setSelectedAsset(asset);
                setIsViewModalOpen(true);
              }}
              onStatusChange={handleStatusChange}
              onDelete={(id) => {
                setAssetToDelete(id);
                setIsDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {selectedAsset && (
        <ViewModal
          asset={selectedAsset}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          isSaving={isSaving}
          editedAsset={editedAsset}
          onEditChange={handleEditChange}
          onCancelEdit={handleCancelEdit}
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};