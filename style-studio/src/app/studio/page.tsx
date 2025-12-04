'use client';

import React, { useState, useCallback } from 'react';
import { Zap, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DragDropZone, PromptTerminal, TerminalLog, ComparisonSlider, RewriteModal } from '@/components';
import { useProjectStore } from '@/store/useProjectStore';
import { cn, downloadImage } from '@/lib/utils';

export default function StudioPage() {
  const [showRewriteModal, setShowRewriteModal] = useState(false);
  
  const {
    structureReference,
    styleReference,
    studioPrompt,
    generatedImage,
    isLoading,
    loadingMessages,
    error,
    setStructureReference,
    setStyleReference,
    setStudioPrompt,
    setGeneratedImage,
    setLoading,
    addLoadingMessage,
    setError,
    clearError,
  } = useProjectStore();

  const handleRender = useCallback(async () => {
    if (!studioPrompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      return;
    }

    clearError();
    setLoading(true, 'rendering');
    setGeneratedImage(null);

    // Simulate progressive loading messages
    const messages = [
      'Initializing neural canvas...',
      'Parsing prompt semantics...',
      'Building 3D scene geometry...',
      'Mapping texture references...',
      'Calculating lighting vectors...',
      'Rendering shadows and reflections...',
      'Applying film grain texture...',
      'Adding atmospheric effects...',
      'Final color grading...',
      'Compositing final render...',
    ];

    let messageIndex = 0;
    const loadingInterval = setInterval(() => {
      if (messageIndex < messages.length) {
        addLoadingMessage(messages[messageIndex]);
        messageIndex++;
      }
    }, 2000);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: studioPrompt,
          structureReference,
          styleReference,
        }),
      });

      clearInterval(loadingInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      addLoadingMessage('Render complete!');
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      clearInterval(loadingInterval);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [studioPrompt, structureReference, styleReference, setLoading, addLoadingMessage, setGeneratedImage, setError, clearError]);

  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage, `style-studio-render-${Date.now()}.png`);
    }
  };

  const handleRewriteApply = (rewrittenPrompt: string) => {
    setStudioPrompt(rewrittenPrompt);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/brief" 
          className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Brief
        </Link>
        <div className="phase-badge mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
          Phase B
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-2">
          The Studio
        </h1>
        <p className="text-[var(--foreground-muted)] max-w-2xl">
          Combine structure and style references with your prompt to generate 
          gritty, photorealistic images. Upload references to guide composition and texture.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Inputs */}
        <div className="xl:col-span-1 space-y-6">
          {/* Structure Reference */}
          <div className="card-dark">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-mono">
                S
              </span>
              Structure Reference
            </h2>
            <p className="text-xs text-[var(--foreground-muted)] mb-3">
              Defines composition, pose, and layout
            </p>
            <DragDropZone
              onImageSelect={setStructureReference}
              currentImage={structureReference}
              onClear={() => setStructureReference(null)}
              label="Structure"
              compact
            />
          </div>

          {/* Style Reference */}
          <div className="card-dark">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-5 h-5 rounded bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">
                T
              </span>
              Texture/Style Reference
            </h2>
            <p className="text-xs text-[var(--foreground-muted)] mb-3">
              Defines lighting, textures, and visual style
            </p>
            <DragDropZone
              onImageSelect={setStyleReference}
              currentImage={styleReference}
              onClear={() => setStyleReference(null)}
              label="Style"
              compact
            />
          </div>

          {/* Prompt Input */}
          <div className="card-dark">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-5 h-5 rounded bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs flex items-center justify-center font-mono">
                P
              </span>
              Prompt
            </h2>
            <PromptTerminal
              value={studioPrompt}
              onChange={setStudioPrompt}
              placeholder="Enter your Director's Treatment or custom prompt..."
              rows={6}
              onRewrite={() => setShowRewriteModal(true)}
              showCopy={false}
            />
          </div>

          {/* Render Button */}
          <button
            onClick={handleRender}
            disabled={isLoading || !studioPrompt.trim()}
            className={cn(
              'w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider transition-all duration-200',
              'flex items-center justify-center gap-3',
              isLoading || !studioPrompt.trim()
                ? 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] cursor-not-allowed'
                : 'bg-gradient-to-r from-[var(--accent-primary)] to-orange-500 text-black hover:shadow-[0_0_30px_var(--accent-glow)] hover:-translate-y-1'
            )}
          >
            {isLoading ? (
              <>
                <RefreshCw size={24} className="animate-spin" />
                Rendering...
              </>
            ) : (
              <>
                <Zap size={24} />
                Render
              </>
            )}
          </button>
        </div>

        {/* Right Column: Output */}
        <div className="xl:col-span-2 space-y-6">
          {/* Loading State */}
          {isLoading && loadingMessages.length > 0 && (
            <TerminalLog
              logs={loadingMessages}
              title="Render Engine"
              className="mb-6"
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg text-[var(--error)]">
              <p className="font-medium">Render Failed</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={handleRender}
                className="mt-3 px-4 py-2 bg-[var(--error)] text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Retry Render
              </button>
            </div>
          )}

          {/* Output Preview */}
          <div className="card-dark">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Render Output
              </h2>
              {generatedImage && (
                <button
                  onClick={handleDownload}
                  className="btn-secondary flex items-center gap-2 text-sm py-2"
                >
                  <Download size={16} />
                  Download
                </button>
              )}
            </div>

            {generatedImage ? (
              structureReference ? (
                <ComparisonSlider
                  beforeImage={structureReference}
                  afterImage={generatedImage}
                  beforeLabel="Reference"
                  afterLabel="Render"
                />
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-[var(--border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={generatedImage}
                    alt="Generated render"
                    className="w-full h-auto"
                  />
                </div>
              )
            ) : (
              <div className="aspect-[4/3] rounded-lg border border-[var(--border)] bg-[var(--background)] flex flex-col items-center justify-center">
                {isLoading ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--accent-primary)]/30 border-t-[var(--accent-primary)] rounded-full animate-spin mb-4" />
                    <p className="text-[var(--foreground-muted)]">
                      Generating your render...
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center mb-4 mx-auto">
                      <Zap size={32} className="text-[var(--foreground-muted)]" />
                    </div>
                    <p className="text-[var(--foreground-muted)] mb-2">
                      Your render will appear here
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]/60">
                      Add references and a prompt, then hit Render
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info Panel */}
          {!generatedImage && !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-dark bg-[var(--background-tertiary)]">
                <h3 className="text-sm font-semibold text-blue-400 mb-2">
                  Structure Reference
                </h3>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Upload your character sketch or composition reference. 
                  The AI will maintain this structure while applying the style.
                </p>
              </div>
              <div className="card-dark bg-[var(--background-tertiary)]">
                <h3 className="text-sm font-semibold text-purple-400 mb-2">
                  Style Reference
                </h3>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Upload a photo with the texture, lighting, and color grade you want. 
                  This defines the &quot;gritty realism&quot; aesthetic.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rewrite Modal */}
      <RewriteModal
        isOpen={showRewriteModal}
        onClose={() => setShowRewriteModal(false)}
        originalPrompt={studioPrompt}
        onApply={handleRewriteApply}
        referenceImage={structureReference || styleReference}
      />
    </div>
  );
}
