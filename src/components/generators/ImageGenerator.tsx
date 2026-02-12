import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Image as ImageIcon, AlertCircle, Sparkles, DollarSign, Wand2, Settings } from 'lucide-react';
import { useAppStore } from '../../store';
import { db } from '../../lib/db';
import { generateContent } from '../../lib/api';
import { generateImage, calculateImageCost } from '../../lib/openai';
import { generateId, copyToClipboard } from '../../lib/utils';
import { ImageAsset } from '../../types';

type ImageSize = '1024x1024' | '1792x1024' | '1024x1792';
type ImageQuality = 'standard' | 'hd';
type ImageStyle = 'photorealistic' | 'illustration' | 'digital-art' | 'minimalist' | 'corporate' | 'artistic' | 'cartoon' | 'sketch';

export const ImageGenerator = () => {
  const { apiKey, openaiApiKey, setGenerating, isGenerating } = useAppStore();
  const [imageIdea, setImageIdea] = useState('');
  const [detailedPrompt, setDetailedPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [imageSize, setImageSize] = useState<ImageSize>('1024x1024');
  const [imageQuality, setImageQuality] = useState<ImageQuality>('standard');
  const [imageStyle, setImageStyle] = useState<ImageStyle>('photorealistic');
  const [customStyle, setCustomStyle] = useState('');
  const [useCustomStyle, setUseCustomStyle] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{ url: string; cost: number } | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleGeneratePrompt = async () => {
    if (!imageIdea.trim()) {
      setError('Please enter your image idea');
      return;
    }

    if (!apiKey) {
      setError('OpenRouter API key is required for prompt generation. Please add it in settings.');
      return;
    }

    setError('');
    setDetailedPrompt('');
    setIsGeneratingPrompt(true);

    try {
      const settings = await db.getSettings();
      if (!settings) {
        throw new Error('Business settings not found. Please complete the settings first.');
      }

      const systemPrompt = `
        You are an expert prompt engineer specializing in creating detailed, high-quality prompts for AI image generation.
        Create a comprehensive, detailed prompt based on the user's image idea that will produce stunning, professional results.

        Business context:
        - Business name: ${settings.businessName}
        - Brand tone: ${settings.tone}
        - Target audience: ${settings.icp}
        - Brand keywords: ${settings.keywords.join(', ')}

        Your response must strictly follow this JSON format:
        {
          "detailedPrompt": "A comprehensive, detailed prompt optimized for AI image generation with specific details about composition, lighting, style, colors, mood, and technical specifications"
        }

        Guidelines for creating the detailed prompt:
        - Include specific details about composition, lighting, and perspective
        - Describe colors, textures, and materials precisely
        - Specify the mood and atmosphere
        - Include technical details like camera angles, depth of field
        - Make it vivid and descriptive but concise
        - Ensure it aligns with the business context when relevant
        - Optimize for professional, high-quality results
      `;

      const userPrompt = `Generate a detailed image prompt for: ${imageIdea}`;

      const response = await generateContent<{ detailedPrompt: string }>(systemPrompt, userPrompt, apiKey);
      setDetailedPrompt(response.detailedPrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate detailed prompt');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleGenerateImage = async () => {
    const promptToUse = useCustomPrompt ? customPrompt : detailedPrompt;
    
    if (!promptToUse.trim()) {
      setError('Please generate or enter a detailed prompt first');
      return;
    }

    if (!openaiApiKey) {
      setError('OpenAI API key is required for image generation. Please add it in settings.');
      return;
    }

    setIsGeneratingImage(true);
    setError('');
    setGeneratedImage(null);

    try {
      const styleToUse = useCustomStyle ? customStyle : imageStyle;
      const result = await generateImage(promptToUse, openaiApiKey, styleToUse, imageSize, imageQuality);
      setGeneratedImage(result);
      setSaved(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSave = async () => {
    if (!generatedImage) return;

    try {
      const promptUsed = useCustomPrompt ? customPrompt : detailedPrompt;
      const styleUsed = useCustomStyle ? customStyle : imageStyle;
      
      const imageAsset: ImageAsset = {
        id: generateId(),
        type: 'image',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
          title: imageIdea || 'Generated Image',
          prompt: promptUsed,
          imageUrl: generatedImage.url,
          style: styleUsed || undefined,
          cost: generatedImage.cost,
          model: 'dall-e-3'
        }
      };

      await db.saveAsset(imageAsset);
      setSaved(true);
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

  const estimatedCost = calculateImageCost(imageSize, imageQuality);

  const styleOptions: { value: ImageStyle; label: string }[] = [
    { value: 'photorealistic', label: 'Photorealistic' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'artistic', label: 'Artistic' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'sketch', label: 'Sketch' }
  ];

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
            <ImageIcon size={20} />
            <span>AI Image Generator</span>
          </h2>

          {/* Step 1: Image Idea */}
          <div className="mb-6">
            <label htmlFor="imageIdea" className="block text-sm font-medium mb-2">
              Step 1: Describe Your Image Idea
            </label>
            <textarea
              id="imageIdea"
              className="input min-h-[80px]"
              value={imageIdea}
              onChange={(e) => setImageIdea(e.target.value)}
              placeholder="e.g. A modern office workspace with natural lighting and plants"
              disabled={isGeneratingPrompt || isGeneratingImage}
            />
          </div>

          {/* Step 2: Generate Detailed Prompt */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Step 2: Generate Detailed Prompt
              </label>
              <button
                className="btn-secondary flex items-center gap-2"
                onClick={handleGeneratePrompt}
                disabled={isGeneratingPrompt || !imageIdea.trim() || !apiKey}
              >
                {isGeneratingPrompt ? (
                  <>
                    <Sparkles size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    Generate Prompt
                  </>
                )}
              </button>
            </div>

            {detailedPrompt && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✓ AI-Generated Prompt
                  </span>
                  <button
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg tooltip-container"
                    onClick={() => handleCopy(detailedPrompt, 'detailedPrompt')}
                  >
                    {copied === 'detailedPrompt' ? <CheckCircle size={14} /> : <Copy size={14} />}
                    <span className="tooltip">Copy prompt</span>
                  </button>
                </div>
                <p className="text-sm p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                  {detailedPrompt}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="useCustomPrompt"
                checked={useCustomPrompt}
                onChange={(e) => setUseCustomPrompt(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="useCustomPrompt" className="text-sm">
                Use custom prompt instead
              </label>
            </div>

            {useCustomPrompt && (
              <textarea
                className="input min-h-[100px]"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter your custom detailed prompt..."
              />
            )}
          </div>

          {/* Step 3: Style Settings */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Step 3: Style & Settings
              </label>
              <button
                className="btn-ghost flex items-center gap-1 text-sm"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              >
                <Settings size={14} />
                {showAdvancedSettings ? 'Hide' : 'Show'} Advanced
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="useCustomStyle"
                  checked={useCustomStyle}
                  onChange={(e) => setUseCustomStyle(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="useCustomStyle" className="text-sm">
                  Use custom style description
                </label>
              </div>

              {useCustomStyle ? (
                <input
                  type="text"
                  className="input"
                  value={customStyle}
                  onChange={(e) => setCustomStyle(e.target.value)}
                  placeholder="e.g. watercolor painting, vintage photography, modern 3D render"
                />
              ) : (
                <select
                  className="input"
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value as ImageStyle)}
                >
                  {styleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {showAdvancedSettings && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Image Size
                    </label>
                    <select
                      className="input"
                      value={imageSize}
                      onChange={(e) => setImageSize(e.target.value as ImageSize)}
                    >
                      <option value="1024x1024">Square (1024×1024)</option>
                      <option value="1792x1024">Landscape (1792×1024)</option>
                      <option value="1024x1792">Portrait (1024×1792)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quality
                    </label>
                    <select
                      className="input"
                      value={imageQuality}
                      onChange={(e) => setImageQuality(e.target.value as ImageQuality)}
                    >
                      <option value="standard">Standard</option>
                      <option value="hd">HD (Higher Cost)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Generate Image */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <DollarSign size={16} />
                <span>Estimated cost: ${estimatedCost.toFixed(3)}</span>
              </div>
            </div>

            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              onClick={handleGenerateImage}
              disabled={
                isGeneratingImage || 
                (!detailedPrompt && !useCustomPrompt) || 
                (useCustomPrompt && !customPrompt.trim()) ||
                !openaiApiKey
              }
            >
              {isGeneratingImage ? (
                <>
                  <Sparkles size={16} className="animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <ImageIcon size={16} />
                  Generate Image
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </motion.div>

        {/* Preview Panel */}
        {(detailedPrompt || generatedImage) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="card"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Preview</h2>
              {generatedImage && (
                <button
                  className="btn-primary flex items-center gap-1"
                  onClick={handleSave}
                  disabled={saved}
                >
                  {saved ? 'Saved to Library' : 'Save to Library'}
                </button>
              )}
            </div>

            {generatedImage ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={generatedImage.url}
                    alt="Generated image"
                    className="w-full rounded-lg shadow-md"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-sm tooltip-container"
                      onClick={() => handleCopy(generatedImage.url, 'imageUrl')}
                    >
                      {copied === 'imageUrl' ? <CheckCircle size={16} /> : <Copy size={16} />}
                      <span className="tooltip">Copy image URL</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Generation Details</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cost: ${generatedImage.cost.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>Size: {imageSize}</div>
                    <div>Quality: {imageQuality}</div>
                    <div>Style: {useCustomStyle ? customStyle || 'Custom' : imageStyle}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Prompt Used</h3>
                  <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {useCustomPrompt ? customPrompt : detailedPrompt}
                  </p>
                </div>
              </div>
            ) : detailedPrompt && (
              <div>
                <h3 className="font-medium mb-2">Generated Prompt</h3>
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                  {detailedPrompt}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click "Generate Image" to create your image using this prompt.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};