'use client';

import React, { useState, useEffect } from 'react';
import { X, Wand2, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TerminalLog } from './TerminalLog';

interface RewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalPrompt: string;
  onApply: (rewrittenPrompt: string) => void;
  referenceImage?: string | null;
}

export const RewriteModal: React.FC<RewriteModalProps> = ({
  isOpen,
  onClose,
  originalPrompt,
  onApply,
  referenceImage,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewrittenPrompt, setRewrittenPrompt] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const doRewrite = async () => {
      if (isOpen && originalPrompt) {
        setIsLoading(true);
        setError(null);
        setLogs(['Initializing rewriter...']);

        try {
          // Simulate progressive loading
          const loadingInterval = setInterval(() => {
            setLogs((prev) => {
              const messages = [
                'Deconstructing prompt...',
                'Applying cinematic lens filter...',
                'Enhancing texture vocabulary...',
                'Injecting realism markers...',
                'Adding surface imperfection details...',
                'Finalizing gritty transformation...',
              ];
              if (prev.length < messages.length + 1) {
                return [...prev, messages[prev.length - 1]];
              }
              return prev;
            });
          }, 1500);

          const response = await fetch('/api/rewrite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              originalPrompt,
              referenceImage,
            }),
          });

          clearInterval(loadingInterval);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to rewrite prompt');
          }

          const data = await response.json();
          setRewrittenPrompt(data.rewrittenPrompt);
          setLogs((prev) => [...prev, 'Rewrite complete!']);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setLogs((prev) => [...prev, 'Error: Rewrite failed']);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isOpen && originalPrompt) {
      doRewrite();
    }
    
    // Reset state when modal closes
    if (!isOpen) {
      setRewrittenPrompt('');
      setLogs([]);
      setError(null);
    }
  }, [isOpen, originalPrompt, referenceImage]);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    setLogs(['Retrying rewrite...']);

    try {
      const loadingInterval = setInterval(() => {
        setLogs((prev) => {
          const messages = [
            'Deconstructing prompt...',
            'Applying cinematic lens filter...',
            'Enhancing texture vocabulary...',
            'Injecting realism markers...',
          ];
          if (prev.length < messages.length + 1) {
            return [...prev, messages[prev.length - 1]];
          }
          return prev;
        });
      }, 1500);

      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrompt,
          referenceImage,
        }),
      });

      clearInterval(loadingInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to rewrite prompt');
      }

      const data = await response.json();
      setRewrittenPrompt(data.rewrittenPrompt);
      setLogs((prev) => [...prev, 'Rewrite complete!']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLogs((prev) => [...prev, 'Error: Rewrite failed']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    onApply(rewrittenPrompt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/20 flex items-center justify-center">
              <Wand2 size={20} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Rewrite for Gritty Realism
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                Transform your prompt with cinematic details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--background-tertiary)] rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Prompt */}
          <div>
            <div className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
              Original Prompt
            </div>
            <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] min-h-[200px]">
              <p className="text-sm text-[var(--foreground)] font-mono whitespace-pre-wrap">
                {originalPrompt}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
              <ArrowRight size={24} className="text-black" />
            </div>
          </div>

          {/* Rewritten Prompt / Loading */}
          <div>
            <div className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
              Gritty Version
            </div>
            {isLoading ? (
              <TerminalLog
                logs={logs}
                title="Rewriting..."
                className="min-h-[200px]"
              />
            ) : error ? (
              <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg min-h-[200px]">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-[var(--error)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[var(--error)]">Rewrite Failed</p>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1">{error}</p>
                    <button
                      onClick={handleRetry}
                      className="mt-4 px-4 py-2 bg-[var(--background-tertiary)] border border-[var(--border)] rounded-lg text-sm hover:border-[var(--accent-primary)] transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            ) : rewrittenPrompt ? (
              <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--accent-primary)]/30 min-h-[200px]">
                <p className="text-sm text-[var(--foreground)] font-mono whitespace-pre-wrap">
                  {rewrittenPrompt}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] min-h-[200px] flex items-center justify-center">
                <p className="text-sm text-[var(--foreground-muted)]">
                  Waiting for rewrite...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)] bg-[var(--background)]">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!rewrittenPrompt || isLoading}
            className={cn(
              'btn-primary flex items-center gap-2',
              (!rewrittenPrompt || isLoading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Check size={18} />
            Apply Rewrite
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewriteModal;
