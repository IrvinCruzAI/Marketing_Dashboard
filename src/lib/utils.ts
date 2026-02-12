import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

export function getAssetIcon(type: string): string {
  switch (type) {
    case 'seo':
      return 'FileText';
    case 'email':
      return 'Mail';
    case 'social':
      return 'Share2';
    case 'leadMagnet':
      return 'Download';
    case 'image':
      return 'Image';
    default:
      return 'File';
  }
}

export function getAssetTypeLabel(type: string): string {
  switch (type) {
    case 'seo':
      return 'SEO Article';
    case 'email':
      return 'Email Campaign';
    case 'social':
      return 'Social Post';
    case 'leadMagnet':
      return 'Lead Magnet';
    case 'image':
      return 'Generated Image';
    default:
      return 'Asset';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'review':
      return 'In Review';
    case 'published':
      return 'Published';
    default:
      return status;
  }
}