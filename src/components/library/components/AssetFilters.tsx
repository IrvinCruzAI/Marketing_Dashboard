import { Search } from 'lucide-react';
import { AssetType, AssetStatus } from '../../../types';

interface AssetFiltersProps {
  typeFilter: AssetType | 'all';
  statusFilter: AssetStatus | 'all';
  sortBy: 'newest' | 'oldest';
  onTypeChange: (type: AssetType | 'all') => void;
  onStatusChange: (status: AssetStatus | 'all') => void;
  onSortChange: (sort: 'newest' | 'oldest') => void;
  onSearch: (query: string) => void;
  disabled?: boolean;
}

export const AssetFilters = ({
  typeFilter,
  statusFilter,
  sortBy,
  onTypeChange,
  onStatusChange,
  onSortChange,
  onSearch,
  disabled
}: AssetFiltersProps) => {
  return (
    <div className="flex items-center gap-6">
      {/* Search Section - 30% width */}
      <div className="w-[30%] relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search assets..."
          className="input pl-10 w-full"
          onChange={(e) => onSearch(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Filters Section - 70% width */}
      <div className="flex-1 flex items-center gap-3">
        <select 
          className="input py-1.5 flex-1"
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value as AssetType | 'all')}
          disabled={disabled}
        >
          <option value="all">All Types</option>
          <option value="seo">SEO Articles</option>
          <option value="email">Email Campaigns</option>
          <option value="social">Social Posts</option>
          <option value="leadMagnet">Lead Magnets</option>
          <option value="image">Images</option>
        </select>
        
        <select 
          className="input py-1.5 flex-1"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as AssetStatus | 'all')}
          disabled={disabled}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="review">In Review</option>
          <option value="published">Published</option>
        </select>
        
        <select 
          className="input py-1.5 flex-1"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest')}
          disabled={disabled}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};