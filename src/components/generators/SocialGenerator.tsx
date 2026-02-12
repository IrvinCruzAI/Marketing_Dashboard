import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Share2, AlertCircle, Image as ImageIcon, Sparkles, DollarSign } from 'lucide-react';
import { useAppStore } from '../../store';
import { db } from '../../lib/db';
import { generateContent } from '../../lib/api';
import { generateImage, calculateImageCost } from '../../lib/openai';
import { generateId, copyToClipboard } from '../../lib/utils';
import { SocialPost, SocialPlatform, ImageAsset } from '../../types';

export const SocialGenerator = () => {
  const { apiKey, openaiApiKey, setGenerating, isGenerating } = useAppStore();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('linkedin');
  const [post, setPost] = useState<SocialPost['data'] | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Image generation states
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('');
  const [generatedImage, setGeneratedImage] = useState<{ url: string; cost: number } | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageSaved, setImageSaved] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your social post');
      return;
    }

    setError('');
    setPost(null);
    setGenerating(true);
    setShowImageGenerator(false);
    setGeneratedImage(null);

    try {
      // Get the business settings for context
      const settings = await db.getSettings();
      if (!settings) {
        throw new Error('Business settings not found. Please complete the settings first.');
      }

      // Construct the system prompt
      const systemPrompt = `
        You are an expert social media copywriter. Create an engaging social media post for ${platform} based on the provided topic.
        You should use the business information provided to tailor the content appropriately.

        Business information:
        - Business name: ${settings.businessName}
        - Tone of voice: ${settings.tone}
        - Ideal customer profile: ${settings.icp}
        - Keywords: ${settings.keywords.join(', ')}
        - Writing guidelines (Dos): ${settings.brandGuidelines.dos.join(', ')}
        - Writing guidelines (Don'ts): ${settings.brandGuidelines.donts.join(', ')}

        Your response must strictly follow this JSON format:
        {
          "copy": "The main text of the social media post",
          "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
          "imagePrompt": "A detailed prompt that could be used to generate an image for this post",
          "platform": "${platform}"
        }

        The copy should be concise, engaging, and optimized for ${platform}. Follow the platform's best practices:
        - Instagram: Visual-focused, emoji-friendly, up to 2200 characters, 3-5 targeted hashtags
        - LinkedIn: Professional tone, 1300-1700 characters, focus on industry insights, 0-3 hashtags
        - Facebook: Conversational, question-based, 1-2 paragraphs, minimal hashtags
        - Twitter/X: Short, punchy, under 280 characters, 1-2 targeted hashtags

        The imagePrompt should describe a compelling, professional image that would work well for this ${platform} post.
      `;

      const userPrompt = `Generate a ${platform} post about: ${topic}`;

      // Call the API with the prompts
      const response = await generateContent<SocialPost['data']>(systemPrompt, userPrompt, apiKey);
      
      setPost(response);
      setEditedPrompt(response.imagePrompt);
      setSaved(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate social post');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!post) return;

    setSaving(true);
    try {
      const newPost: SocialPost = {
        id: generateId(),
        type: 'social',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: post
      };

      await db.saveAsset(newPost);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save social post');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!editedPrompt.trim()) {
      setError('Please enter an image prompt');
      return;
    }

    if (!openaiApiKey) {
      setError('OpenAI API key is required for image generation. Please add it in settings.');
      return;
    }

    setIsGeneratingImage(true);
    setError('');

    try {
      const result = await generateImage(editedPrompt, openaiApiKey, imageStyle);
      setGeneratedImage(result);
      setImageSaved(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveImage = async () => {
    if (!generatedImage || !post) return;

    try {
      const imageAsset: ImageAsset = {
        id: generateId(),
        type: 'image',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
          title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Image - ${topic}`,
          prompt: editedPrompt,
          imageUrl: generatedImage.url,
          platform: platform,
          style: imageStyle || undefined,
          cost: generatedImage.cost,
          model: 'dall-e-3'
        }
      };

      await db.saveAsset(imageAsset);
      setImageSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save image');
    }
  };

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const estimatedCost = calculateImageCost();

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
            <Share2 size={20} />
            <span>Generate Social Post</span>
          </h2>

          <div className="mb-4">
            <label htmlFor="topic" className="block text-sm font-medium mb-1">
              Post Topic
            </label>
            <input
              id="topic"
              type="text"
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Introducing our new sustainable product line"
              disabled={isGenerating}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Platform
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['instagram', 'linkedin', 'facebook', 'twitter'] as SocialPlatform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`py-2 px-4 rounded-lg border text-center ${
                    platform === p
                      ? 'button-selected'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setPlatform(p)}
                  disabled={isGenerating}
                >
                  {p === 'twitter' ? 'Twitter/X' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-primary w-full"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? 'Generating...' : 'Generate Post'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </motion.div>

        {post && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="card"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Preview</h2>
              <button
                className="btn-primary flex items-center gap-1"
                onClick={handleSave}
                disabled={saving || saved}
              >
                {saved ? 'Saved' : saving ? 'Saving...' : 'Save to Library'}
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Platform Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(post.platform)}
                    <span className="font-medium">
                      {post.platform === 'twitter' ? 'Twitter/X' : post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                    </span>
                  </div>
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg tooltip-container"
                    onClick={() => handleCopy(post.copy + '\n\n' + post.hashtags.map(h => `#${h}`).join(' '), 'full')}
                  >
                    {copied === 'full' ? <CheckCircle size={16} /> : <Copy size={16} />}
                    <span className="tooltip">Copy post</span>
                  </button>
                </div>
                
                {/* Post Content */}
                <div className="p-4">
                  <div className="mb-4 whitespace-pre-line">
                    {post.copy}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((tag, index) => (
                      <span key={index} className="text-brand-600 dark:text-brand-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Generation Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <ImageIcon size={18} />
                    Image Generation
                  </h3>
                  {!showImageGenerator && (
                    <button
                      className="btn-secondary flex items-center gap-2"
                      onClick={() => setShowImageGenerator(true)}
                      disabled={!openaiApiKey}
                    >
                      <Sparkles size={16} />
                      Generate Image
                    </button>
                  )}
                </div>

                {!openaiApiKey && !showImageGenerator && (
                  <div className="p-3 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-lg text-sm">
                    Add OpenAI API key in settings to enable image generation
                  </div>
                )}

                {showImageGenerator && (
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Image Prompt
                      </label>
                      <textarea
                        className="input min-h-[80px]"
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        placeholder="Describe the image you want to generate..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Style (Optional)
                      </label>
                      <input
                        type="text"
                        className="input"
                        value={imageStyle}
                        onChange={(e) => setImageStyle(e.target.value)}
                        placeholder="e.g. photorealistic, illustration, minimalist, corporate"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign size={16} />
                        <span>Estimated cost: ${estimatedCost.toFixed(3)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="btn-secondary"
                          onClick={() => setShowImageGenerator(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-primary flex items-center gap-2"
                          onClick={handleGenerateImage}
                          disabled={isGeneratingImage || !editedPrompt.trim()}
                        >
                          {isGeneratingImage ? (
                            <>
                              <Sparkles size={16} className="animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <ImageIcon size={16} />
                              Generate Image
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {generatedImage && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Generated Image</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Cost: ${generatedImage.cost.toFixed(3)}
                        </span>
                        <button
                          className="btn-primary text-sm"
                          onClick={handleSaveImage}
                          disabled={imageSaved}
                        >
                          {imageSaved ? 'Saved to Library' : 'Save to Library'}
                        </button>
                      </div>
                    </div>
                    <img
                      src={generatedImage.url}
                      alt="Generated social media image"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

function getPlatformIcon(platform: SocialPlatform) {
  switch (platform) {
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
      );
    case 'linkedin':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
      );
    case 'facebook':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
      );
    case 'twitter':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
      );
    default:
      return null;
  }
}