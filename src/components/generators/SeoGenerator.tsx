import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import { db } from '../../lib/db';
import { generateContent } from '../../lib/api';
import { generateId, copyToClipboard } from '../../lib/utils';
import { SeoArticle } from '../../types';

export const SeoGenerator = () => {
  const { apiKey, setGenerating, isGenerating } = useAppStore();
  const [topic, setTopic] = useState('');
  const [article, setArticle] = useState<SeoArticle['data'] | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your article');
      return;
    }

    setError('');
    setArticle(null);
    setGenerating(true);

    try {
      // Get the business settings for context
      const settings = await db.getSettings();
      if (!settings) {
        throw new Error('Business settings not found. Please complete the settings first.');
      }

      // Construct the system prompt
      const systemPrompt = `
        You are an expert SEO content writer. Create an SEO-optimized article based on the provided topic.
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
          "title": "SEO-optimized title with keywords",
          "tags": ["keyword1", "keyword2", "keyword3"],
          "content": "Full article content with proper HTML formatting including h2, h3, p, ul, li tags",
          "wordCount": 500,
          "imagePrompt": "Detailed prompt for generating a hero image that complements the article content"
        }

        The content should be 500-800 words, well-structured with headings, and optimized for search engines.
        Include relevant keywords naturally throughout the content.
        The imagePrompt should describe a compelling, professional image that would work well as a hero image for the article.
      `;

      const userPrompt = `Generate an SEO article about: ${topic}`;

      // Call the API with the prompts
      const response = await generateContent<SeoArticle['data']>(systemPrompt, userPrompt, apiKey);
      
      setArticle(response);
      setSaved(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate article');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!article) return;

    setSaving(true);
    try {
      const newArticle: SeoArticle = {
        id: generateId(),
        type: 'seo',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: article
      };

      await db.saveAsset(newArticle);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
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
            <FileText size={20} />
            <span>Generate SEO Article</span>
          </h2>

          <div className="mb-6">
            <label htmlFor="topic" className="block text-sm font-medium mb-1">
              Article Topic
            </label>
            <input
              id="topic"
              type="text"
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Benefits of sustainable packaging for e-commerce"
              disabled={isGenerating}
            />
          </div>

          <button
            className="btn-primary w-full"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? 'Generating...' : 'Generate Article'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </motion.div>

        {article && (
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

            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {article.title}
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg tooltip-container"
                  onClick={() => handleCopy(article.title, 'title')}
                >
                  {copied === 'title' ? <CheckCircle size={16} /> : <Copy size={16} />}
                  <span className="tooltip">Copy title</span>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Word Count: {article.wordCount}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                Image Prompt
                <button
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg tooltip-container"
                  onClick={() => handleCopy(article.imagePrompt, 'imagePrompt')}
                >
                  {copied === 'imagePrompt' ? <CheckCircle size={14} /> : <Copy size={14} />}
                  <span className="tooltip">Copy prompt</span>
                </button>
              </h3>
              <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                {article.imagePrompt}
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-2 right-2">
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg tooltip-container"
                  onClick={() => handleCopy(article.content, 'content')}
                >
                  {copied === 'content' ? <CheckCircle size={16} /> : <Copy size={16} />}
                  <span className="tooltip">Copy content</span>
                </button>
              </div>
              
              <div 
                className="prose dark:prose-invert max-w-none p-4 max-h-[400px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: article.content }}
              ></div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};