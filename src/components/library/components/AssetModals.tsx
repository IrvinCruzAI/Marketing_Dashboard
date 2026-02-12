import { Asset } from '../../../types';
import { formatDate, getStatusLabel } from '../../../lib/utils';
import { getAssetIcon } from './AssetIcons';
import { AssetContent } from './AssetContent';

interface ViewModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  onEdit: (asset: Asset) => void;
  onSave: () => void;
  isSaving: boolean;
  editedAsset: Asset | null;
  onEditChange: (field: string, value: any) => void;
  onCancelEdit: () => void;
}

export const ViewModal = ({
  asset,
  isOpen,
  onClose,
  isEditing,
  onEdit,
  onSave,
  isSaving,
  editedAsset,
  onEditChange,
  onCancelEdit
}: ViewModalProps) => {
  if (!isOpen) return null;

  const getAssetTitle = (asset: Asset): string => {
    switch (asset.type) {
      case 'seo':
        return asset.data.title;
      case 'email':
        return asset.data.subject;
      case 'social':
        return `${asset.data.platform.charAt(0).toUpperCase() + asset.data.platform.slice(1)} Post`;
      case 'leadMagnet':
        return asset.data.title;
      default:
        return 'Unknown Asset';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-surface rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getAssetIcon(asset.type)}
            <h2 className="text-lg font-semibold">{getAssetTitle(asset)}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className={`status-pill status-${asset.status}`}>
              {getStatusLabel(asset.status)}
            </div>
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          <AssetContent 
            asset={asset}
            isEditing={isEditing}
            editedAsset={editedAsset}
            onEditChange={onEditChange}
          />
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created: {formatDate(asset.createdAt)}
            {asset.createdAt !== asset.updatedAt && (
              <span className="ml-4">Updated: {formatDate(asset.updatedAt)}</span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
            <button 
              className="btn-primary"
              onClick={() => {
                if (isEditing) {
                  onCancelEdit();
                } else {
                  onEdit(asset);
                }
              }}
            >
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </button>
            {isEditing && (
              <button 
                className="btn-primary bg-success hover:bg-green-700"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-surface rounded-2xl w-full max-w-md p-6 m-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">
          Are you sure you want to delete this asset? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button 
            className="btn-secondary" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn-primary bg-error hover:bg-red-700" 
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};