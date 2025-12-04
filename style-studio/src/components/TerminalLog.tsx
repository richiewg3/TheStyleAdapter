'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Terminal, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TerminalLogProps {
  logs: string[];
  isComplete?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  title?: string;
  className?: string;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({
  logs,
  isComplete = false,
  hasError = false,
  errorMessage,
  title = 'System Output',
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (index: number) => {
    if (hasError && index === logs.length - 1) {
      return <XCircle size={14} className="text-[var(--error)]" />;
    }
    if (isComplete && index === logs.length - 1) {
      return <CheckCircle size={14} className="text-[var(--success)]" />;
    }
    if (index === logs.length - 1 && !isComplete && !hasError) {
      return <Loader2 size={14} className="text-[var(--accent-primary)] animate-spin" />;
    }
    return <CheckCircle size={14} className="text-[var(--success)]/50" />;
  };

  return (
    <div className={cn(
      'rounded-lg overflow-hidden bg-[#0a0a0a] border border-[var(--border)]',
      className
    )}>
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[var(--background-tertiary)] border-b border-[var(--border)]">
        <Terminal size={14} className="text-[var(--accent-primary)]" />
        <span className="text-xs text-[var(--foreground-muted)] font-mono uppercase tracking-wider">
          {title}
        </span>
        <div className="flex-1" />
        <div className={cn(
          'w-2 h-2 rounded-full',
          hasError ? 'bg-[var(--error)]' : isComplete ? 'bg-[var(--success)]' : 'bg-[var(--accent-primary)] animate-pulse'
        )} />
      </div>

      {/* Log Content */}
      <div 
        ref={scrollRef}
        className="p-4 max-h-[300px] overflow-y-auto font-mono text-sm"
      >
        {logs.length === 0 ? (
          <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
            <Loader2 size={14} className="animate-spin" />
            <span>Initializing...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div 
                key={index}
                className={cn(
                  'flex items-start gap-2',
                  index === logs.length - 1 && !isComplete && !hasError && 'text-[var(--accent-primary)]',
                  hasError && index === logs.length - 1 && 'text-[var(--error)]'
                )}
              >
                <span className="mt-0.5">{getLogIcon(index)}</span>
                <span className={cn(
                  'flex-1',
                  index < logs.length - 1 && 'text-[var(--foreground-muted)]'
                )}>
                  {log}
                </span>
              </div>
            ))}
            
            {/* Cursor at end */}
            {!isComplete && !hasError && (
              <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                <span className="w-3.5" />
                <span className="inline-block w-2 h-4 bg-[var(--accent-primary)] animate-pulse" />
              </div>
            )}
            
            {/* Error message */}
            {hasError && errorMessage && (
              <div className="mt-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded text-[var(--error)]">
                {errorMessage}
              </div>
            )}
            
            {/* Success message */}
            {isComplete && !hasError && (
              <div className="mt-4 p-3 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded text-[var(--success)]">
                ✓ Process completed successfully
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalLog;
