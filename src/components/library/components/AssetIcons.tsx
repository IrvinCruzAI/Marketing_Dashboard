import { FileText, Mail, Share2, Download, Image as ImageIcon } from 'lucide-react';

export const getAssetIcon = (type: string) => {
  switch (type) {
    case 'seo':
      return <FileText size={20} className="text-blue-600 dark:text-blue-400" />;
    case 'email':
      return <Mail size={20} className="text-purple-600 dark:text-purple-400" />;
    case 'social':
      return <Share2 size={20} className="text-green-600 dark:text-green-400" />;
    case 'leadMagnet':
      return <Download size={20} className="text-amber-600 dark:text-amber-400" />;
    case 'image':
      return <ImageIcon size={20} className="text-pink-600 dark:text-pink-400" />;
    default:
      return <FileText size={20} />;
  }
};

export const getPlatformIcon = (platform: string) => {
  const icons = {
    instagram: {
      path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01',
      rect: { width: 20, height: 20, x: 2, y: 2, rx: 5, ry: 5 }
    },
    linkedin: {
      path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 1 0 0-4z'
    },
    facebook: {
      path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'
    },
    twitter: {
      path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'
    }
  };

  const icon = icons[platform as keyof typeof icons];
  if (!icon) return null;

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {icon.rect && <rect {...icon.rect} />}
      <path d={icon.path} />
    </svg>
  );
};