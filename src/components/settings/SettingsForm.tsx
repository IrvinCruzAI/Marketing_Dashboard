import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { db } from '../../lib/db';
import { ApiKeyForm } from './ApiKeyForm';
import { BusinessSettings } from '../../types';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const SettingsForm = () => {
  const { setSettingsComplete } = useAppStore();
  const [step, setStep] = useState(1);
  const [apiKeyUpdated, setApiKeyUpdated] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: '',
    name: '',
    logo: '',
    tone: '',
    icp: '',
    brandGuidelines: {
      dos: [''],
      donts: ['']
    },
    keywords: [''],
    createdAt: new Date().toISOString()
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const data = await db.getSettings();
      if (data) {
        setSettings(data);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof BusinessSettings
  ) => {
    setSettings(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleArrayChange = (
    value: string,
    index: number,
    field: 'keywords' | 'dos' | 'donts'
  ) => {
    if (field === 'keywords') {
      const newKeywords = [...settings.keywords];
      newKeywords[index] = value;
      setSettings(prev => ({
        ...prev,
        keywords: newKeywords
      }));
    } else {
      const newGuidelines = { ...settings.brandGuidelines };
      newGuidelines[field][index] = value;
      setSettings(prev => ({
        ...prev,
        brandGuidelines: newGuidelines
      }));
    }
  };

  const addArrayItem = (field: 'keywords' | 'dos' | 'donts') => {
    if (field === 'keywords') {
      setSettings(prev => ({
        ...prev,
        keywords: [...prev.keywords, '']
      }));
    } else {
      const newGuidelines = { ...settings.brandGuidelines };
      newGuidelines[field] = [...newGuidelines[field], ''];
      setSettings(prev => ({
        ...prev,
        brandGuidelines: newGuidelines
      }));
    }
  };

  const removeArrayItem = (
    index: number,
    field: 'keywords' | 'dos' | 'donts'
  ) => {
    if (field === 'keywords') {
      const newKeywords = [...settings.keywords];
      newKeywords.splice(index, 1);
      setSettings(prev => ({
        ...prev,
        keywords: newKeywords
      }));
    } else {
      const newGuidelines = { ...settings.brandGuidelines };
      newGuidelines[field].splice(index, 1);
      setSettings(prev => ({
        ...prev,
        brandGuidelines: newGuidelines
      }));
    }
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');
    setSaveError('');

    try {
      await db.saveSettings(settings);
      setSaveMessage('Settings saved successfully!');
      setSettingsComplete(true);
    } catch (error) {
      setSaveError('Failed to save settings. Please try again.');
      console.error('Settings save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 ${
            step >= 2 ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            2
          </div>
          <div className={`w-12 h-1 ${
            step >= 3 ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            3
          </div>
          <div className={`w-12 h-1 ${
            step >= 4 ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 4 ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            4
          </div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <>
        <h2 className="text-xl font-semibold mb-6">API Settings</h2>
        
        <div className="mb-6">
          <ApiKeyForm 
            mode="settings" 
            onSuccess={() => {
              setApiKeyUpdated(true);
              setTimeout(() => setApiKeyUpdated(false), 3000);
            }}
          />
        </div>

        {apiKeyUpdated && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle size={18} />
            <span>API key updated successfully</span>
          </div>
        )}

        <div className="flex justify-end">
          <motion.button
            type="button"
            className="btn-primary"
            onClick={nextStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next: Brand Basics
          </motion.button>
        </div>
      </>
    );
  };

  const renderStep2 = () => {
    return (
      <>
        <h2 className="text-xl font-semibold mb-6">Brand Basics</h2>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            className="input"
            value={settings.name}
            onChange={(e) => handleChange(e, 'name')}
            placeholder="e.g. John Smith"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="businessName" className="block text-sm font-medium mb-1">
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            className="input"
            value={settings.businessName}
            onChange={(e) => handleChange(e, 'businessName')}
            placeholder="e.g. Acme Inc."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="logo" className="block text-sm font-medium mb-1">
            Logo URL (optional)
          </label>
          <input
            id="logo"
            type="text"
            className="input"
            value={settings.logo || ''}
            onChange={(e) => handleChange(e, 'logo')}
            placeholder="https://example.com/logo.png"
          />
          {settings.logo && (
            <div className="mt-2">
              <img 
                src={settings.logo} 
                alt="Business Logo" 
                className="h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Brand Keywords
          </label>
          {settings.keywords.map((keyword, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                className="input"
                value={keyword}
                onChange={(e) => handleArrayChange(e.target.value, index, 'keywords')}
                placeholder="e.g. innovative, sustainable"
              />
              {settings.keywords.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'keywords')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('keywords')}
            className="text-sm text-brand-600 hover:underline mt-1"
          >
            + Add keyword
          </button>
        </div>

        <div className="flex justify-end">
          <motion.button
            type="button"
            className="btn-primary"
            onClick={nextStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next: Brand Voice
          </motion.button>
        </div>
      </>
    );
  };

  const renderStep3 = () => {
    return (
      <>
        <h2 className="text-xl font-semibold mb-6">Voice & Tone</h2>
        
        <div className="mb-6">
          <label htmlFor="tone" className="block text-sm font-medium mb-1">
            Brand Voice
          </label>
          <textarea
            id="tone"
            className="input min-h-[100px]"
            value={settings.tone}
            onChange={(e) => handleChange(e, 'tone')}
            placeholder="Describe your brand's voice and tone (e.g. Professional but friendly, uses simple language, avoids jargon...)"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Do's (Writing Guidelines)
          </label>
          {settings.brandGuidelines.dos.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                className="input"
                value={item}
                onChange={(e) => handleArrayChange(e.target.value, index, 'dos')}
                placeholder="e.g. Use active voice"
              />
              {settings.brandGuidelines.dos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'dos')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('dos')}
            className="text-sm text-brand-600 hover:underline mt-1"
          >
            + Add do
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Don'ts (Writing Guidelines)
          </label>
          {settings.brandGuidelines.donts.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                className="input"
                value={item}
                onChange={(e) => handleArrayChange(e.target.value, index, 'donts')}
                placeholder="e.g. Avoid industry jargon"
              />
              {settings.brandGuidelines.donts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'donts')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('donts')}
            className="text-sm text-brand-600 hover:underline mt-1"
          >
            + Add don't
          </button>
        </div>

        <div className="flex justify-between">
          <motion.button
            type="button"
            className="btn-secondary"
            onClick={prevStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back
          </motion.button>
          <motion.button
            type="button"
            className="btn-primary"
            onClick={nextStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next: Customer Profile
          </motion.button>
        </div>
      </>
    );
  };

  const renderStep4 = () => {
    return (
      <>
        <h2 className="text-xl font-semibold mb-6">Ideal Customer Profile</h2>
        
        <div className="mb-6">
          <label htmlFor="icp" className="block text-sm font-medium mb-1">
            Describe Your Ideal Customer
          </label>
          <textarea
            id="icp"
            className="input min-h-[150px]"
            value={settings.icp}
            onChange={(e) => handleChange(e, 'icp')}
            placeholder="Describe your ideal customer in detail (demographics, pain points, goals, challenges, etc.)"
          />
        </div>

        {saveMessage && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle size={18} />
            <span>{saveMessage}</span>
          </div>
        )}

        {saveError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{saveError}</span>
          </div>
        )}

        <div className="flex justify-between">
          <motion.button
            type="button"
            className="btn-secondary"
            onClick={prevStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back
          </motion.button>
          <motion.button
            type="button"
            className="btn-primary"
            onClick={saveSettings}
            disabled={isSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </motion.button>
        </div>
      </>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1(); // API Settings
      case 2:
        return renderStep2(); // Brand Basics
      case 3:
        return renderStep3(); // Voice & Tone
      case 4:
        return renderStep4(); // Customer Profile
      default:
        return renderStep1();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        {renderStepIndicator()}
        {renderCurrentStep()}
      </motion.div>
    </div>
  );
};