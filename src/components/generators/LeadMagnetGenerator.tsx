import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Download, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import { db } from '../../lib/db';
import { generateContent } from '../../lib/api';
import { generateId, copyToClipboard } from '../../lib/utils';
import { LeadMagnet, LeadMagnetType } from '../../types';

export const LeadMagnetGenerator = () => {
  const { apiKey, setGenerating, isGenerating } = useAppStore();
  const [topic, setTopic] = useState('');
  const [resourceType, setResourceType] = useState<LeadMagnetType>('guide');
  const [leadMagnet, setLeadMagnet] = useState<LeadMagnet['data'] | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'code'>('content');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your lead magnet');
      return;
    }

    setError('');
    setLeadMagnet(null);
    setGenerating(true);

    try {
      // Get the business settings for context
      const settings = await db.getSettings();
      if (!settings) {
        throw new Error('Business settings not found. Please complete the settings first.');
      }

      // Construct the system prompt
      const systemPrompt = `
        You are an expert lead magnet creator. Create a valuable lead magnet resource based on the provided topic and type.
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
          "title": "Attention-grabbing title for the lead magnet",
          "outline": ["Section 1", "Section 2", "Section 3"],
          "deliverableHtml": "Full content with proper HTML formatting including h2, h3, p, ul, li, table tags",
          "promptForCoder": "Detailed prompt for a developer to create an interactive version if needed",
          "resourceType": "${resourceType}"
        }

        The content should be valuable, actionable, and aligned with the specified resource type:
        - guide: Comprehensive, step-by-step tutorial with explanations and examples
        - checklist: Structured list of items with checkboxes, organized by category
        - template: Reusable framework with placeholders for customization
        - calculatorPrompt: Detailed specifications for creating an interactive calculator
      `;

      const userPrompt = `Generate a ${resourceType} about: ${topic}`;

      // Call the API with the prompts
      const response = await generateContent<LeadMagnet['data']>(systemPrompt, userPrompt, apiKey);
      
      setLeadMagnet(response);
      setSaved(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate lead magnet');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!leadMagnet) return;

    setSaving(true);
    try {
      const newLeadMagnet: LeadMagnet = {
        id: generateId(),
        type: 'leadMagnet',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: leadMagnet
      };

      await db.saveAsset(newLeadMagnet);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lead magnet');
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
            <Download size={20} />
            <span>Generate Lead Magnet</span>
          </h2>

          <div className="mb-4">
            <label htmlFor="topic" className="block text-sm font-medium mb-1">
              Lead Magnet Topic
            </label>
            <input
              id="topic"
              type="text"
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 10 strategies to reduce customer acquisition costs"
              disabled={isGenerating}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Resource Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['guide', 'checklist', 'template', 'calculatorPrompt'] as LeadMagnetType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`py-2 px-4 rounded-lg border text-center ${
                    resourceType === type
                      ? 'button-selected'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setResourceType(type)}
                  disabled={isGenerating}
                >
                  {type === 'calculatorPrompt' ? 'Calculator' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-primary w-full"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? 'Generating...' : 'Generate Lead Magnet'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </motion.div>

        {leadMagnet && (
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
                  {leadMagnet.title}
                </h3>
                <button
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg tooltip-container"
                  onClick={() => handleCopy(leadMagnet.title, 'title')}
                >
                  {copied === 'title' ? <CheckCircle size={16} /> : <Copy size={16} />}
                  <span className="tooltip">Copy title</span>
                </button>
              </div>
              
              <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Resource Type: {leadMagnet.resourceType.charAt(0).toUpperCase() + leadMagnet.resourceType.slice(1)}
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium mb-2">Outline:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {leadMagnet.outline.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-4">
              <div className="border-b border-gray-200 dark:border-gray-700 flex mb-4">
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'content'
                      ? 'border-b-2 border-brand-600 text-brand-800 dark:text-brand-300'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('content')}
                >
                  Content
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'code'
                      ? 'border-b-2 border-brand-600 text-brand-800 dark:text-brand-300'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('code')}
                >
                  Developer Prompt
                </button>
              </div>

              {activeTab === 'content' ? (
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-sm tooltip-container"
                      onClick={() => handleCopy(leadMagnet.deliverableHtml, 'deliverable')}
                    >
                      {copied === 'deliverable' ? <CheckCircle size={16} /> : <Copy size={16} />}
                      <span className="tooltip">Copy HTML</span>
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900 max-h-[400px] overflow-y-auto">
                    <div 
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: leadMagnet.deliverableHtml }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-sm tooltip-container"
                      onClick={() => handleCopy(leadMagnet.promptForCoder, 'prompt')}
                    >
                      {copied === 'prompt' ? <CheckCircle size={16} /> : <Copy size={16} />}
                      <span className="tooltip">Copy prompt</span>
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800 max-h-[400px] overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">{leadMagnet.promptForCoder}</pre>
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