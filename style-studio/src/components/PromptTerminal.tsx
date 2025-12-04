'use client';

import React, { useMemo } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { cn, copyToClipboard } from '@/lib/utils';

interface PromptTerminalProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  label?: string;
  onRewrite?: () => void;
  isLoading?: boolean;
  showCopy?: boolean;
  rows?: number;
  className?: string;
}

// Keywords to highlight in the terminal
const KEYWORDS = [
  'Lighting', 'Light', 'Shadow', 'Shadows', 'Backlit', 'Rim',
  'Texture', 'Textures', 'Surface', 'Grain', 'Imperfections',
  'Camera', 'Lens', 'Focus', 'Depth', 'Bokeh', 'f/1.4', 'f/1.8', 'f/2.8',
  'Color', 'Tone', 'Grade', 'Film', 'Kodak', 'Portra', 'Cinematic',
  'Composition', 'Frame', 'Angle', 'Perspective',
  'Atmosphere', 'Mood', 'Ambient', 'Dust', 'Haze', 'Fog',
  '50mm', '85mm', '100mm', '35mm', '24mm',
];

export const PromptTerminal: React.FC<PromptTerminalProps> = ({
  value,
  onChange,
  placeholder = 'Enter your concept here...',
  readOnly = false,
  label,
  onRewrite,
  isLoading = false,
  showCopy = true,
  rows = 6,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Highlight keywords in the text for display
  const highlightedText = useMemo(() => {
    if (!value) return '';
    
    let result = value;
    KEYWORDS.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      result = result.replace(regex, `<span class="text-[var(--accent-primary)] font-semibold">$1</span>`);
    });
    
    return result;
  }, [value]);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        {label && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--accent-primary)]" />
            <span className="text-sm font-medium text-[var(--foreground-muted)] font-mono uppercase tracking-wider">
              {label}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {onRewrite && (
            <button
              onClick={onRewrite}
              disabled={isLoading || !value}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all',
                'bg-[var(--background-tertiary)] border border-[var(--border)]',
                'hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:text-inherit'
              )}
              title="Rewrite for Gritty Realism"
            >
              <Wand2 size={14} />
              Rewrite
            </button>
          )}
          
          {showCopy && value && (
            <button
              onClick={handleCopy}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all',
                'bg-[var(--background-tertiary)] border border-[var(--border)]',
                'hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]',
                copied && 'border-[var(--success)] text-[var(--success)]'
              )}
              title="Copy to clipboard"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Container */}
      <div className={cn(
        'relative rounded-lg overflow-hidden',
        'bg-[#0a0a0a] border border-[var(--border)]',
        'focus-within:border-[var(--accent-primary)] focus-within:shadow-[0_0_0_2px_var(--accent-glow)]',
        'transition-all duration-200'
      )}>
        {/* Terminal Header Bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--background-tertiary)] border-b border-[var(--border)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs text-[var(--foreground-muted)] font-mono ml-2">
            prompt.txt
          </span>
        </div>

        {/* Terminal Content */}
        <div className="relative p-4">
          {/* Line numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col pt-4 text-right pr-3 text-[var(--foreground-muted)]/50 font-mono text-sm select-none border-r border-[var(--border)]/50">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>

          {/* Text Area */}
          <div className="pl-12">
            {readOnly ? (
              <div 
                className={cn(
                  'font-mono text-sm leading-6 text-[var(--foreground)] whitespace-pre-wrap min-h-[150px]',
                  !value && 'text-[var(--foreground-muted)]'
                )}
                dangerouslySetInnerHTML={{ 
                  __html: highlightedText || placeholder 
                }}
              />
            ) : (
              <textarea
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                disabled={isLoading}
                className={cn(
                  'w-full bg-transparent border-none outline-none resize-none',
                  'font-mono text-sm leading-6 text-[var(--foreground)]',
                  'placeholder:text-[var(--foreground-muted)]',
                  isLoading && 'opacity-50 cursor-not-allowed'
                )}
              />
            )}
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex items-center gap-2 text-[var(--accent-primary)]">
                <div className="w-4 h-4 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-sm">Processing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Cursor blink effect for readOnly with content */}
        {readOnly && value && (
          <div className="absolute bottom-4 right-4">
            <span className="inline-block w-2 h-5 bg-[var(--accent-primary)] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptTerminal;
