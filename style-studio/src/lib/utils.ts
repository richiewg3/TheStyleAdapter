import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Convert File to base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Validate image file
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Debounce function
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Loading messages for different phases
export const loadingMessages = {
  analyzing: [
    'Analyzing composition...',
    'Studying light patterns...',
    'Evaluating textures...',
    'Considering perspectives...',
    'Mapping geometry...',
  ],
  generating: [
    'Initializing neural canvas...',
    'Mapping textures...',
    'Rendering lighting...',
    'Adding micro-details...',
    'Applying film grain...',
    'Final color grade...',
  ],
  rewriting: [
    'Deconstructing prompt...',
    'Applying cinematic lens...',
    'Enhancing texture vocabulary...',
    'Injecting realism markers...',
  ],
  rendering: [
    'Building 3D space...',
    'Placing light sources...',
    'Calculating shadows...',
    'Rendering reflections...',
    'Adding atmospheric effects...',
    'Final composition...',
  ],
};

// Get random loading message for a phase
export const getRandomLoadingMessage = (phase: keyof typeof loadingMessages): string => {
  const messages = loadingMessages[phase];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Simulate progressive loading messages
export const simulateLoadingProgress = (
  phase: keyof typeof loadingMessages,
  onMessage: (message: string) => void,
  intervalMs: number = 2000
): (() => void) => {
  const messages = [...loadingMessages[phase]];
  let index = 0;
  
  const interval = setInterval(() => {
    if (index < messages.length) {
      onMessage(messages[index]);
      index++;
    } else {
      // Loop back with variations
      index = 0;
      onMessage(messages[index] + '..');
    }
  }, intervalMs);
  
  // Return cleanup function
  return () => clearInterval(interval);
};

// Highlight keywords in text for terminal display
export const highlightKeywords = (text: string): string => {
  const keywords = [
    'Lighting', 'Light', 'Shadow', 'Shadows',
    'Texture', 'Textures', 'Surface',
    'Camera', 'Lens', 'Focus', 'Depth',
    'Color', 'Tone', 'Grade', 'Film',
    'Composition', 'Frame', 'Angle',
    'Atmosphere', 'Mood', 'Ambient',
  ];
  
  let result = text;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    result = result.replace(regex, '<span class="highlight-keyword">$1</span>');
  });
  
  return result;
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Download image from base64 or URL
export const downloadImage = (imageData: string, filename: string = 'render.png'): void => {
  const link = document.createElement('a');
  link.href = imageData;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
