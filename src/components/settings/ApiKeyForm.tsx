import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ApiKeyFormProps {
  mode: 'initial' | 'settings';
  onSuccess?: () => void;
}

export const ApiKeyForm = ({ mode, onSuccess }: ApiKeyFormProps) => {
  const { apiKey, setApiKey, openaiApiKey, setOpenaiApiKey } = useAppStore();
  const [key, setKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (mode === 'settings') {
      if (apiKey) setKey(apiKey);
      if (openaiApiKey) setOpenaiKey(openaiApiKey);
    }
  }, [mode, apiKey, openaiApiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simple validation by making a basic request to OpenRouter
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'FutureCrafters.ai Marketing Dashboard'
        }
      });

      if (!response.ok) {
        throw new Error('Invalid OpenRouter API key or unable to connect to OpenRouter');
      }

      // If successful, save the API keys
      setApiKey(key);
      if (openaiKey.trim()) {
        setOpenaiApiKey(openaiKey);
      }
      
      if (mode === 'settings') {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={mode === 'initial' ? 'max-w-md mx-auto mt-20' : ''}>
      <motion.div
        initial={mode === 'initial' ? { opacity: 0, y: 20 } : false}
        animate={mode === 'initial' ? { opacity: 1, y: 0 } : false}
        transition={mode === 'initial' ? { duration: 0.5 } : undefined}
        className={mode === 'initial' ? 'card' : ''}
      >
        {mode === 'initial' ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                <img 
                  src="/Future Crafters (Logo) (1).svg" 
                  alt="FutureCrafters.ai" 
                  className="w-12 h-12"
                />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-center mb-6">Welcome to FutureCrafters.ai</h1>
          </>
        ) : (
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Configure your API keys for content generation and image creation.
            </p>
          </div>
        )}
        
        {mode === 'initial' && (
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            To get started with the AI Marketing Dashboard, please enter your API keys below.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
              OpenRouter API Key (Required)
            </label>
            <input
              id="apiKey"
              type="password"
              className="input"
              placeholder="sk_or_..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for content generation (SEO, Email, Social, Lead Magnets)
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="openaiKey" className="block text-sm font-medium mb-1">
              OpenAI API Key (Optional)
            </label>
            <input
              id="openaiKey"
              type="password"
              className="input"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for image generation in Social Media Studio
            </p>
          </div>

          {showSuccess && (
            <div className="mt-2 text-success flex items-center gap-1 text-sm">
              <CheckCircle size={16} />
              <span>API keys updated successfully</span>
            </div>
          )}
          {error && (
            <div className="mt-2 text-error flex items-center gap-1 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {mode === 'initial' && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
              <CheckCircle size={16} className="text-success" />
              <span>Your API keys are stored locally and never sent to our servers</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Validating...' : mode === 'initial' ? 'Continue' : 'Update API Keys'}
          </button>
        </form>

        {mode === 'initial' && (
          <div className="mt-6 text-sm text-center text-gray-500 space-y-2">
            <div>
              Don't have an OpenRouter API key?{' '}
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline"
              >
                Get one from OpenRouter
              </a>
            </div>
            <div>
              Want image generation?{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline"
              >
                Get OpenAI API key
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};