import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Mail, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import { db } from '../../lib/db';
import { generateContent } from '../../lib/api';
import { generateId, copyToClipboard } from '../../lib/utils';
import { EmailCampaign, EmailPurpose } from '../../types';

export const EmailGenerator = () => {
  const { apiKey, setGenerating, isGenerating } = useAppStore();
  const [topic, setTopic] = useState('');
  const [purpose, setPurpose] = useState<EmailPurpose>('newsletter');
  const [email, setEmail] = useState<EmailCampaign['data'] | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your email');
      return;
    }

    setError('');
    setEmail(null);
    setGenerating(true);

    try {
      // Get the business settings for context
      const settings = await db.getSettings();
      if (!settings) {
        throw new Error('Business settings not found. Please complete the settings first.');
      }

      // Construct the system prompt
      const systemPrompt = `
        You are an expert email copywriter. Create an engaging email based on the provided topic and purpose.
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
          "subject": "Attention-grabbing email subject line",
          "previewLine": "Short preview text that appears in email clients",
          "bodyHtml": "Full email body with proper HTML formatting including h2, p, ul, li, a tags",
          "purpose": "${purpose}"
        }

        The email should be concise, engaging, and aligned with the specified purpose. Include a clear call-to-action.
        Format the email properly with HTML, but keep the design simple and clean.
      `;

      const userPrompt = `Generate a ${purpose} email about: ${topic}`;

      // Call the API with the prompts
      const response = await generateContent<EmailCampaign['data']>(systemPrompt, userPrompt, apiKey);
      
      setEmail(response);
      setSaved(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!email) return;

    setSaving(true);
    try {
      const newEmail: EmailCampaign = {
        id: generateId(),
        type: 'email',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: email
      };

      await db.saveAsset(newEmail);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save email');
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
            <Mail size={20} />
            <span>Generate Email Campaign</span>
          </h2>

          <div className="mb-4">
            <label htmlFor="topic" className="block text-sm font-medium mb-1">
              Email Topic
            </label>
            <input
              id="topic"
              type="text"
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Summer sale announcement"
              disabled={isGenerating}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Email Purpose
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['newsletter', 'promotion', 'announcement', 'followUp'] as EmailPurpose[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`py-2 px-4 rounded-lg border text-center ${
                    purpose === p
                      ? 'button-selected'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setPurpose(p)}
                  disabled={isGenerating}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-primary w-full"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? 'Generating...' : 'Generate Email'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </motion.div>

        {email && (
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
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {email.subject}
                      </h3>
                      <button
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg tooltip-container"
                        onClick={() => handleCopy(email.subject, 'subject')}
                      >
                        {copied === 'subject' ? <CheckCircle size={14} /> : <Copy size={14} />}
                        <span className="tooltip">Copy subject</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      {email.previewLine}
                      <button
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg tooltip-container"
                        onClick={() => handleCopy(email.previewLine, 'preview')}
                      >
                        {copied === 'preview' ? <CheckCircle size={14} /> : <Copy size={14} />}
                        <span className="tooltip">Copy preview</span>
                      </button>
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 rounded-full text-xs">
                    {email.purpose.charAt(0).toUpperCase() + email.purpose.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="absolute top-2 right-2 z-10">
                  <button
                    className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-sm tooltip-container"
                    onClick={() => handleCopy(email.bodyHtml, 'body')}
                  >
                    {copied === 'body' ? <CheckCircle size={16} /> : <Copy size={16} />}
                    <span className="tooltip">Copy HTML</span>
                  </button>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-6">
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};