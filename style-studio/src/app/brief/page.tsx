'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Copy, Check, RefreshCw } from 'lucide-react';
import { DragDropZone, PromptTerminal, TerminalLog } from '@/components';
import { useProjectStore } from '@/store/useProjectStore';
import { cn, copyToClipboard } from '@/lib/utils';

export default function BriefPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  const {
    referenceImage,
    conceptText,
    directorTreatment,
    isLoading,
    loadingMessages,
    error,
    setReferenceImage,
    setConceptText,
    setDirectorTreatment,
    sendTreatmentToStudio,
    setLoading,
    addLoadingMessage,
    setError,
    clearError,
  } = useProjectStore();

  const handleGenerate = useCallback(async () => {
    if (!conceptText.trim()) {
      setError('Please enter a concept to generate a treatment.');
      return;
    }

    clearError();
    setLoading(true, 'analyzing');
    setDirectorTreatment('');

    // Simulate progressive loading messages
    const messages = [
      'Initializing Art Director...',
      'Analyzing concept...',
      'Simulating lighting setups...',
      'Evaluating chiaroscuro approach...',
      'Testing diffused natural light...',
      'Calculating rim lighting angles...',
      'Selecting optimal setup for gritty realism...',
      'Generating Director\'s Treatment...',
    ];

    let messageIndex = 0;
    const loadingInterval = setInterval(() => {
      if (messageIndex < messages.length) {
        addLoadingMessage(messages[messageIndex]);
        messageIndex++;
      }
    }, 1500);

    try {
      const response = await fetch('/api/director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptText,
          referenceImage,
        }),
      });

      clearInterval(loadingInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate treatment');
      }

      const data = await response.json();
      addLoadingMessage('Treatment generated successfully!');
      setDirectorTreatment(data.treatment);
    } catch (err) {
      clearInterval(loadingInterval);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [conceptText, referenceImage, setLoading, addLoadingMessage, setDirectorTreatment, setError, clearError]);

  const handleCopy = async () => {
    const success = await copyToClipboard(directorTreatment);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendToStudio = () => {
    sendTreatmentToStudio();
    router.push('/studio');
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="phase-badge mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
          Phase A
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-2">
          The Brief
        </h1>
        <p className="text-[var(--foreground-muted)] max-w-2xl">
          Upload a reference image and describe your concept. The AI Art Director will analyze 
          your input and generate a polished &quot;Director&apos;s Treatment&quot; with detailed lighting, 
          lens, and texture specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-6">
          {/* Reference Image Upload */}
          <div className="card-dark">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-sm flex items-center justify-center font-mono">
                1
              </span>
              Reference Sheet
              <span className="text-sm font-normal text-[var(--foreground-muted)]">(Optional)</span>
            </h2>
            <DragDropZone
              onImageSelect={setReferenceImage}
              currentImage={referenceImage}
              onClear={() => setReferenceImage(null)}
              label="Upload Reference Image"
              description="Upload a sketch or character reference"
            />
          </div>

          {/* Concept Input */}
          <div className="card-dark">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-sm flex items-center justify-center font-mono">
                2
              </span>
              Your Concept
            </h2>
            <PromptTerminal
              value={conceptText}
              onChange={setConceptText}
              placeholder="Describe your concept... (e.g., 'Dragon in a sandbox, sad')"
              label="Concept Input"
              rows={4}
              showCopy={false}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !conceptText.trim()}
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Generating Treatment...
              </>
            ) : (
              <>
                Generate Director&apos;s Treatment
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg text-[var(--error)]">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={handleGenerate}
                className="mt-3 px-4 py-2 bg-[var(--error)] text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && loadingMessages.length > 0 && (
            <TerminalLog
              logs={loadingMessages}
              title="Art Director Processing"
              className="mb-6"
            />
          )}

          {/* Director's Treatment Output */}
          <div className="card-dark">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-sm flex items-center justify-center font-mono">
                3
              </span>
              Director&apos;s Treatment
            </h2>
            
            <PromptTerminal
              value={directorTreatment}
              readOnly
              placeholder="Your Director's Treatment will appear here..."
              label="Output"
              rows={10}
              showCopy={false}
              isLoading={isLoading}
            />

            {/* Action Buttons */}
            {directorTreatment && !isLoading && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleCopy}
                  className={cn(
                    'btn-secondary flex items-center gap-2',
                    copied && 'border-[var(--success)] text-[var(--success)]'
                  )}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button
                  onClick={handleSendToStudio}
                  className="btn-primary flex items-center gap-2"
                >
                  Send to Studio
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          {!directorTreatment && !isLoading && (
            <div className="card-dark bg-[var(--background-tertiary)]">
              <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                Tips for Better Results
              </h3>
              <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)]">•</span>
                  Include emotional context (e.g., &quot;melancholic&quot;, &quot;triumphant&quot;)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)]">•</span>
                  Mention environment details (indoor/outdoor, time of day)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)]">•</span>
                  Reference real-world textures you want to emphasize
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)]">•</span>
                  Upload a sketch to guide composition and character pose
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
