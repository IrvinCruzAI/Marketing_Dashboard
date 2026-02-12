import { useState } from 'react';
import { Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { Asset } from '../../../types';
import { getPlatformIcon } from './AssetIcons';

interface AssetContentProps {
  asset: Asset;
  isEditing: boolean;
  editedAsset: Asset | null;
  onEditChange: (field: string, value: any) => void;
}

interface CopyButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const CopyButton = ({ onClick, className = '', children }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} flex items-center gap-2`}
    >
      {copied ? (
        <>
          <CheckCircle size={16} className="text-green-500" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={16} />
          {children}
        </>
      )}
    </button>
  );
};

export const AssetContent = ({ 
  asset, 
  isEditing, 
  editedAsset,
  onEditChange 
}: AssetContentProps) => {
  const displayAsset = isEditing ? editedAsset : asset;
  if (!displayAsset) return null;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  switch (asset.type) {
    case 'seo':
      return (
        <div className="p-6">
          {isEditing ? (
            <input
              type="text"
              className="input text-xl font-semibold mb-4"
              value={displayAsset.data.title}
              onChange={(e) => onEditChange('title', e.target.value)}
            />
          ) : (
            <h3 className="text-xl font-semibold mb-4">{displayAsset.data.title}</h3>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {displayAsset.data.tags.map((tag, index) => (
              <span key={index} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Word Count: {displayAsset.data.wordCount}
          </div>

          {displayAsset.data.imagePrompt && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Image Prompt</h3>
              {isEditing ? (
                <textarea
                  className="input text-sm"
                  value={displayAsset.data.imagePrompt}
                  onChange={(e) => onEditChange('imagePrompt', e.target.value)}
                />
              ) : (
                <>
                  <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                    {displayAsset.data.imagePrompt}
                  </p>
                  <CopyButton
                    onClick={() => handleCopy(displayAsset.data.imagePrompt)}
                    className="btn-secondary text-sm"
                  >
                    Copy Image Prompt
                  </CopyButton>
                </>
              )}
            </div>
          )}

          {isEditing ? (
            <textarea
              className="input min-h-[300px] font-mono text-sm"
              value={displayAsset.data.content}
              onChange={(e) => onEditChange('content', e.target.value)}
            />
          ) : (
            <>
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: displayAsset.data.content }}
              >
              </div>
              <CopyButton
                onClick={() => handleCopy(displayAsset.data.content)}
                className="mt-4 btn-secondary"
              >
                Copy Content
              </CopyButton>
            </>
          )}
        </div>
      );
    
    case 'email':
      return (
        <div className="p-6">
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="input text-xl font-semibold mb-2"
                  value={displayAsset.data.subject}
                  onChange={(e) => onEditChange('subject', e.target.value)}
                />
                <input
                  type="text"
                  className="input text-sm"
                  value={displayAsset.data.previewLine}
                  onChange={(e) => onEditChange('previewLine', e.target.value)}
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">{displayAsset.data.subject}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{displayAsset.data.previewLine}</p>
                <div className="flex gap-2 mt-3">
                  <CopyButton
                    onClick={() => handleCopy(displayAsset.data.subject)}
                    className="btn-secondary text-sm"
                  >
                    Copy Subject
                  </CopyButton>
                  <CopyButton
                    onClick={() => handleCopy(displayAsset.data.previewLine)}
                    className="btn-secondary text-sm"
                  >
                    Copy Preview Line
                  </CopyButton>
                </div>
              </>
            )}
            <div className="mt-2">
              <span className="tag-pill">
                {displayAsset.data.purpose.charAt(0).toUpperCase() + displayAsset.data.purpose.slice(1)}
              </span>
            </div>
          </div>
          {isEditing ? (
            <textarea
              className="input min-h-[300px] font-mono text-sm"
              value={displayAsset.data.bodyHtml}
              onChange={(e) => onEditChange('bodyHtml', e.target.value)}
            />
          ) : (
            <>
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: displayAsset.data.bodyHtml }}
              >
              </div>
              <CopyButton
                onClick={() => handleCopy(displayAsset.data.bodyHtml)}
                className="mt-4 btn-secondary"
              >
                Copy HTML
              </CopyButton>
            </>
          )}
        </div>
      );
    
    case 'social':
      return (
        <div className="p-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              {getPlatformIcon(displayAsset.data.platform)}
              <span className="font-medium">
                {displayAsset.data.platform.charAt(0).toUpperCase() + displayAsset.data.platform.slice(1)}
              </span>
            </div>
            <div className="p-4">
              {isEditing ? (
                <textarea
                  className="input mb-4"
                  value={displayAsset.data.copy}
                  onChange={(e) => onEditChange('copy', e.target.value)}
                />
              ) : (
                <>
                  <div className="mb-4 whitespace-pre-line">
                    {displayAsset.data.copy}
                  </div>
                  <CopyButton
                    onClick={() => handleCopy(displayAsset.data.copy)}
                    className="mb-4 btn-secondary"
                  >
                    Copy Post
                  </CopyButton>
                </>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {displayAsset.data.hashtags.map((tag, index) => (
                  <span key={index} className="text-brand-600 dark:text-brand-400">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-2">Image Prompt</h3>
                {isEditing ? (
                  <textarea
                    className="input text-sm"
                    value={displayAsset.data.imagePrompt}
                    onChange={(e) => onEditChange('imagePrompt', e.target.value)}
                  />
                ) : (
                  <>
                    <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {displayAsset.data.imagePrompt}
                    </p>
                    <CopyButton
                      onClick={() => handleCopy(displayAsset.data.imagePrompt)}
                      className="mt-2 btn-secondary"
                    >
                      Copy Prompt
                    </CopyButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'leadMagnet':
      return (
        <div className="p-6">
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {isEditing ? (
              <input
                type="text"
                className="input text-xl font-semibold mb-2"
                value={displayAsset.data.title}
                onChange={(e) => onEditChange('title', e.target.value)}
              />
            ) : (
              <h3 className="text-xl font-semibold mb-2">{displayAsset.data.title}</h3>
            )}
            <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Resource Type: {displayAsset.data.resourceType.charAt(0).toUpperCase() + displayAsset.data.resourceType.slice(1)}
            </div>
            <div className="mt-3">
              <h4 className="font-medium mb-2">Outline:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {displayAsset.data.outline.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          {isEditing ? (
            <textarea
              className="input min-h-[300px] font-mono text-sm"
              value={displayAsset.data.deliverableHtml}
              onChange={(e) => onEditChange('deliverableHtml', e.target.value)}
            />
          ) : (
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: displayAsset.data.deliverableHtml }}
            />
          )}
          {displayAsset.data.promptForCoder && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Developer Prompt</h3>
              <div className="relative">
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">
                  {displayAsset.data.promptForCoder}
                </p>
                <CopyButton
                  onClick={() => handleCopy(displayAsset.data.promptForCoder)}
                  className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-sm text-sm"
                >
                  Copy Prompt
                </CopyButton>
              </div>
            </div>
          )}
        </div>
      );

    case 'image':
      return (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{displayAsset.data.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>Model: {displayAsset.data.model}</span>
              <span>Cost: ${displayAsset.data.cost.toFixed(3)}</span>
              {displayAsset.data.platform && (
                <span>Platform: {displayAsset.data.platform}</span>
              )}
            </div>
            {displayAsset.data.style && (
              <div className="mb-4">
                <span className="tag-pill">{displayAsset.data.style}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <img
              src={displayAsset.data.imageUrl}
              alt={displayAsset.data.title}
              className="w-full rounded-lg shadow-md"
            />
            <div className="flex gap-2 mt-3">
              <a
                href={displayAsset.data.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Open Full Size
              </a>
              <CopyButton
                onClick={() => handleCopy(displayAsset.data.imageUrl)}
                className="btn-secondary"
              >
                Copy URL
              </CopyButton>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Generation Prompt</h4>
            <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
              {displayAsset.data.prompt}
            </p>
            <CopyButton
              onClick={() => handleCopy(displayAsset.data.prompt)}
              className="btn-secondary text-sm"
            >
              Copy Prompt
            </CopyButton>
          </div>
        </div>
      );
    
    default:
      return <div className="p-6">Content not available</div>;
  }
};