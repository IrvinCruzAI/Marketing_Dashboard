export type BusinessSettings = {
  businessName: string;
  name: string;
  logo?: string;
  tone: string;
  icp: string;
  brandGuidelines: {
    dos: string[];
    donts: string[];
  };
  keywords: string[];
  createdAt: string;
};

export type AssetStatus = 'draft' | 'review' | 'published';

export type AssetType = 'seo' | 'email' | 'social' | 'leadMagnet' | 'image';

export type BaseAsset = {
  id: string;
  type: AssetType;
  status: AssetStatus;
  createdAt: string;
  updatedAt: string;
};

export type SeoArticle = BaseAsset & {
  type: 'seo';
  data: {
    title: string;
    tags: string[];
    content: string;
    wordCount: number;
    imagePrompt: string;
  };
};

export type EmailPurpose = 'newsletter' | 'promotion' | 'announcement' | 'followUp';

export type EmailCampaign = BaseAsset & {
  type: 'email';
  data: {
    subject: string;
    previewLine: string;
    bodyHtml: string;
    purpose: EmailPurpose;
  };
};

export type SocialPlatform = 'instagram' | 'linkedin' | 'facebook' | 'twitter';

export type SocialPost = BaseAsset & {
  type: 'social';
  data: {
    copy: string;
    hashtags: string[];
    imagePrompt: string;
    platform: SocialPlatform;
  };
};

export type LeadMagnetType = 'guide' | 'checklist' | 'template' | 'calculatorPrompt';

export type LeadMagnet = BaseAsset & {
  type: 'leadMagnet';
  data: {
    title: string;
    outline: string[];
    deliverableHtml?: string;
    promptForCoder?: string;
    resourceType: LeadMagnetType;
  };
};

export type ImageAsset = BaseAsset & {
  type: 'image';
  data: {
    title: string;
    prompt: string;
    imageUrl: string;
    platform?: SocialPlatform;
    style?: string;
    cost: number;
    model: string;
  };
};

export type Asset = SeoArticle | EmailCampaign | SocialPost | LeadMagnet | ImageAsset;

export type ThemeMode = 'light' | 'dark';