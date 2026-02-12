import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Recycle, AlertCircle, FileText, Mail, Share2, MessageSquare } from 'lucide-react';
import { useAppStore } from '../../store';
import { db } from '../../lib/db';
import { generateContent } from '../../lib/api';
import { generateId, copyToClipboard } from '../../lib/utils';
import { Asset } from '../../types';

interface RepurposedContent {
  email?: string;
  linkedin?: string;
  instagram?: {
    copy: string;
    hashtags: string[];
  };
  facebook?: string;
  twitter?: string;
}

interface ChannelSelection {
  email: boolean;
  linkedin: boolean;
  instagram: boolean;
  facebook: boolean;
  twitter: boolean;
}

export const RepurposeGenerator = () => {
  const { apiKey, setGenerating, isGenerating } = useAppStore();
  const [sourceContent, setSourceContent] = useState('');
  const [channels, setChannels] = useState<ChannelSelection>({
    email: true,
    linkedin: true,
    instagram: true,
    facebook: true,
    twitter: true
  });
  const [repurposedContent, setRepurposedContent] = useState<RepurposedContent | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<{ [key: string]: boolean }>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChannelChange = (channel: keyof ChannelSelection) => {
    setChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  const handleGenerate = async () => {
    if (!sourceContent.trim()) {
      setError('Please enter your source content');
      return;
    }

    const selectedChannels = Object.entries(channels).filter(([_, selected]) => selected);
    if (selectedChannels.length === 0) {
      setError('Please select at least one channel');
      return;
    }

    setError('');
    setRepurposedContent(null);
    setGenerating(true);

    try {
      // Get the business settings for context
      const settings = await db.getSettings();
      if (!settings) {
        throw new Error('Business settings not found. Please complete the settings first.');
      }

      // Build the channels list for the prompt
      const channelsList = selectedChannels.map(([channel]) => channel).join(', ');

      // Construct the system prompt
      const systemPrompt = `
        You are an expert content repurposing specialist. Transform the provided long-form content into optimized snippets for different social media and marketing channels.
        
        Business information:
        - Business name: ${settings.businessName}
        - Tone of voice: ${settings.tone}
        - Ideal customer profile: ${settings.icp}
        - Keywords: ${settings.keywords.join(', ')}
        - Writing guidelines (Dos): ${settings.brandGuidelines.dos.join(', ')}
        - Writing guidelines (Don'ts): ${settings.brandGuidelines.donts.join(', ')}

        Your response must strictly follow this JSON format:
        {
          ${channels.email ? '"email": "Professional email content with subject-worthy hook and clear value proposition",' : ''}
          ${channels.linkedin ? '"linkedin": "Professional LinkedIn post with industry insights and engagement hooks",' : ''}
          ${channels.instagram ? '"instagram": {"copy": "Engaging Instagram caption with storytelling elements", "hashtags": ["hashtag1", "hashtag2", "hashtag3"]},' : ''}
          ${channels.facebook ? '"facebook": "Conversational Facebook post that encourages engagement and discussion",' : ''}
          ${channels.twitter ? '"twitter": "Concise Twitter/X post under 280 characters with strong hook"' : ''}
        }

        Channel-specific guidelines:
        - Email: Professional tone, clear value proposition, actionable insights, 150-300 words
        - LinkedIn: Professional but engaging, industry insights, thought leadership angle, 100-200 words
        - Instagram: Visual storytelling, emotional connection, behind-the-scenes feel, 100-150 words + 5-10 relevant hashtags
        - Facebook: Conversational, community-focused, question-based to encourage comments, 100-200 words
        - Twitter/X: Punchy, conversation-starting, under 280 characters, include key insight or question

        Maintain the core message and value while adapting the tone, length, and style for each platform's audience and best practices.
      `;

      const userPrompt = `Repurpose this content for ${channelsList}: ${sourceContent}`;

      // Call the API with the prompts
      const response = await generateContent<RepurposedContent>(systemPrompt, userPrompt, apiKey);
      
      setRepurposedContent(response);
      setSaved({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to repurpose content');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveSnippet = async (channel: string, content: any) => {
    setSaving(true);
    try {
      let asset: Asset;
      const baseId = generateId();
      const timestamp = new Date().toISOString();

      switch (channel) {
        case 'email':
          asset = {
            id: baseId,
            type: 'email',
            status: 'draft',
            createdAt: timestamp,
            updatedAt: timestamp,
            data: {
              subject: `Repurposed: ${sourceContent.substring(0, 50)}...`,
              previewLine: content.substring(0, 100) + '...',
              bodyHtml: `<p>${content.replace(/\n/g, '</p><p>')}</p>`,
              purpose: 'newsletter' as const
            }
          };
          break;

        case 'linkedin':
        case 'facebook':
        case 'twitter':
          asset = {
            id: baseId,
            type: 'social',
            status: 'draft',
            createdAt: timestamp,
            updatedAt: timestamp,
            data: {
              copy: content,
              hashtags: [],
              imagePrompt: `Professional ${channel} post image related to: ${sourceContent.substring(0, 100)}`,
              platform: channel as 'linkedin' | 'facebook' | 'twitter'
            }
          };
          break;

        case 'instagram':
          asset = {
            id: baseId,
            type: 'social',
            status: 'draft',
            createdAt: timestamp,
            updatedAt: timestamp,
            data: {
              copy: content.copy,
              hashtags: content.hashtags,
              imagePrompt: `Engaging Instagram post image related to: ${sourceContent.substring(0, 100)}`,
              platform: 'instagram' as const
            }
          };
          break;

        default:
          throw new Error('Unknown channel type');
      }

      await db.saveAsset(asset);
      setSaved(prev => ({ ...prev, [channel]: true }));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to save ${channel} snippet`);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail size={18} className="text-purple-600 dark:text-purple-400" />;
      case 'linkedin':
        return <Share2 size={18} className="text-blue-600 dark:text-blue-400" />;
      case 'instagram':
        return <Share2 size={18} className="text-pink-600 dark:text-pink-400" />;
      case 'facebook':
        return <Share2 size={18} className="text-blue-700 dark:text-blue-500" />;
      case 'twitter':
        return <MessageSquare size={18} className="text-sky-600 dark:text-sky-400" />;
      default:
        return <FileText size={18} />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20';
      case 'linkedin':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
      case 'instagram':
        return 'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/20';
      case 'facebook':
        return 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20';
      case 'twitter':
        return 'border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20';
      default:
        return 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Recycle size={20} />
            <span>Repurpose Content</span>
          </h2>

          <div className="mb-6">
            <label htmlFor="sourceContent" className="block text-sm font-medium mb-2">
              Source Content
            </label>
            <textarea
              id="sourceContent"
              className="input min-h-[200px]"
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              placeholder="Paste your long-form content here (blog post, article, newsletter, etc.)"
              disabled={isGenerating}
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {sourceContent.length} characters
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Target Channels
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={channels.email}
                  onChange={() => handleChannelChange('email')}
                  className="rounded"
                  disabled={isGenerating}
                />
                <Mail size={16} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium">Email</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={channels.linkedin}
                  onChange={() => handleChannelChange('linkedin')}
                  className="rounded"
                  disabled={isGenerating}
                />
                <Share2 size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">LinkedIn</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={channels.instagram}
                  onChange={() => handleChannelChange('instagram')}
                  className="rounded"
                  disabled={isGenerating}
                />
                <Share2 size={16} className="text-pink-600 dark:text-pink-400" />
                <span className="text-sm font-medium">Instagram</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={channels.facebook}
                  onChange={() => handleChannelChange('facebook')}
                  className="rounded"
                  disabled={isGenerating}
                />
                <Share2 size={16} className="text-blue-700 dark:text-blue-500" />
                <span className="text-sm font-medium">Facebook</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={channels.twitter}
                  onChange={() => handleChannelChange('twitter')}
                  className="rounded"
                  disabled={isGenerating}
                />
                <MessageSquare size={16} className="text-sky-600 dark:text-sky-400" />
                <span className="text-sm font-medium">Twitter/X</span>
              </label>
            </div>
          </div>

          <button
            className="btn-primary w-full"
            onClick={handleGenerate}
            disabled={isGenerating || !sourceContent.trim() || Object.values(channels).every(v => !v)}
          >
            {isGenerating ? 'Repurposing Content...' : 'Repurpose Content'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </motion.div>

        {repurposedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-6">Repurposed Snippets</h2>

            <div className="space-y-6">
              {repurposedContent.email && (
                <div className={`p-4 rounded-lg border-2 ${getChannelColor('email')}`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      {getChannelIcon('email')}
                      <h3 className="font-medium">Email Newsletter</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg tooltip-container"
                        onClick={() => handleCopy(repurposedContent.email!, 'email')}
                      >
                        {copied === 'email' ? <CheckCircle size={16} /> : <Copy size={16} />}
                        <span className="tooltip">Copy content</span>
                      </button>
                      <button
                        className="btn-primary text-sm"
                        onClick={() => handleSaveSnippet('email', repurposedContent.email)}
                        disabled={saved.email || saving}
                      >
                        {saved.email ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm whitespace-pre-line">
                    {repurposedContent.email}
                  </div>
                </div>
              )}

              {repurposedContent.linkedin && (
                <div className={`p-4 rounded-lg border-2 ${getChannelColor('linkedin')}`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      {getChannelIcon('linkedin')}
                      <h3 className="font-medium">LinkedIn Post</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg tooltip-container"
                        onClick={() => handleCopy(repurposedContent.linkedin!, 'linkedin')}
                      >
                        {copied === 'linkedin' ? <CheckCircle size={16} /> : <Copy size={16} />}
                        <span className="tooltip">Copy content</span>
                      </button>
                      <button
                        className="btn-primary text-sm"
                        onClick={() => handleSaveSnippet('linkedin', repurposedContent.linkedin)}
                        disabled={saved.linkedin || saving}
                      >
                        {saved.linkedin ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm whitespace-pre-line">
                    {repurposedContent.linkedin}
                  </div>
                </div>
              )}

              {repurposedContent.instagram && (
                <div className={`p-4 rounded-lg border-2 ${getChannelColor('instagram')}`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      {getChannelIcon('instagram')}
                      <h3 className="font-medium">Instagram Post</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg tooltip-container"
                        onClick={() => handleCopy(
                          `${repurposedContent.instagram!.copy}\n\n${repurposedContent.instagram!.hashtags.map(h => `#${h}`).join(' ')}`,
                          'instagram'
                        )}
                      >
                        {copied === 'instagram' ? <CheckCircle size={16} /> : <Copy size={16} />}
                        <span className="tooltip">Copy content</span>
                      </button>
                      <button
                        className="btn-primary text-sm"
                        onClick={() => handleSaveSnippet('instagram', repurposedContent.instagram)}
                        disabled={saved.instagram || saving}
                      >
                        {saved.instagram ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm whitespace-pre-line mb-3">
                    {repurposedContent.instagram.copy}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {repurposedContent.instagram.hashtags.map((tag, index) => (
                      <span key={index} className="text-pink-600 dark:text-pink-400 text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {repurposedContent.facebook && (
                <div className={`p-4 rounded-lg border-2 ${getChannelColor('facebook')}`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      {getChannelIcon('facebook')}
                      <h3 className="font-medium">Facebook Post</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg tooltip-container"
                        onClick={() => handleCopy(repurposedContent.facebook!, 'facebook')}
                      >
                        {copied === 'facebook' ? <CheckCircle size={16} /> : <Copy size={16} />}
                        <span className="tooltip">Copy content</span>
                      </button>
                      <button
                        className="btn-primary text-sm"
                        onClick={() => handleSaveSnippet('facebook', repurposedContent.facebook)}
                        disabled={saved.facebook || saving}
                      >
                        {saved.facebook ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm whitespace-pre-line">
                    {repurposedContent.facebook}
                  </div>
                </div>
              )}

              {repurposedContent.twitter && (
                <div className={`p-4 rounded-lg border-2 ${getChannelColor('twitter')}`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      {getChannelIcon('twitter')}
                      <h3 className="font-medium">Twitter/X Post</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg tooltip-container"
                        onClick={() => handleCopy(repurposedContent.twitter!, 'twitter')}
                      >
                        {copied === 'twitter' ? <CheckCircle size={16} /> : <Copy size={16} />}
                        <span className="tooltip">Copy content</span>
                      </button>
                      <button
                        className="btn-primary text-sm"
                        onClick={() => handleSaveSnippet('twitter', repurposedContent.twitter)}
                        disabled={saved.twitter || saving}
                      >
                        {saved.twitter ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm whitespace-pre-line">
                    {repurposedContent.twitter}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {repurposedContent.twitter.length}/280 characters
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};