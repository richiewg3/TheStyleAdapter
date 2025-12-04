'use client';

import React, { useState } from 'react';
import { RotateCcw, Key, Palette, Info } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';

export default function SettingsPage() {
  const { resetProject } = useProjectStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetProject();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-2">
          Settings
        </h1>
        <p className="text-[var(--foreground-muted)] max-w-2xl">
          Configure your Style Studio experience and manage your project data.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* API Configuration */}
        <div className="card-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/20 flex items-center justify-center">
              <Key size={20} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                API Configuration
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                Google Gemini API settings
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                API Key Status
              </label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                <span className="text-sm text-[var(--foreground)]">
                  Configured via environment variable
                </span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)] mt-2">
                Set <code className="bg-[var(--background-tertiary)] px-1 py-0.5 rounded">GOOGLE_AI_API_KEY</code> or <code className="bg-[var(--background-tertiary)] px-1 py-0.5 rounded">GEMINI_API_KEY</code> in your environment.
              </p>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="card-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Palette size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Theme
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                Visual appearance settings
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                Color Scheme
              </label>
              <div className="flex gap-3">
                <button className="flex-1 p-3 rounded-lg border-2 border-[var(--accent-primary)] bg-[var(--background)] text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#0d0d0d] border border-[var(--border)]" />
                    <span className="text-sm font-medium text-[var(--foreground)]">Dark</span>
                  </div>
                </button>
                <button className="flex-1 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center opacity-50 cursor-not-allowed">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white border border-[var(--border)]" />
                    <span className="text-sm font-medium text-[var(--foreground)]">Light</span>
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)]">Coming soon</span>
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">
                Accent Color
              </label>
              <div className="flex gap-2">
                {['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6'].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-lg border-2 ${color === '#f59e0b' ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <p className="text-xs text-[var(--foreground-muted)] mt-2">
                Custom accent colors coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Project Data */}
        <div className="card-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--error)]/20 flex items-center justify-center">
              <RotateCcw size={20} className="text-[var(--error)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Project Data
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                Manage your current project
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-[var(--foreground-muted)]">
              Clear all uploaded images, prompts, and generated content. This action cannot be undone.
            </p>
            
            {showResetConfirm ? (
              <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg">
                <p className="text-sm text-[var(--foreground)] mb-3">
                  Are you sure? This will clear all your project data.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-[var(--error)] text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-[var(--background-tertiary)] text-[var(--foreground)] rounded-lg text-sm border border-[var(--border)] hover:border-[var(--foreground-muted)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-[var(--background-tertiary)] text-[var(--error)] rounded-lg text-sm border border-[var(--error)]/30 hover:bg-[var(--error)]/10 transition-colors flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset Project
              </button>
            )}
          </div>
        </div>

        {/* About */}
        <div className="card-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Info size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                About
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                The Style Studio
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-[var(--foreground-muted)]">
            <p>
              <span className="text-[var(--foreground)]">Version:</span> 1.0.0
            </p>
            <p>
              <span className="text-[var(--foreground)]">Powered by:</span> Google Gemini API
            </p>
            <p>
              <span className="text-[var(--foreground)]">Built with:</span> Next.js, TypeScript, Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
