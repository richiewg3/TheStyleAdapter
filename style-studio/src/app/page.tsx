'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, Palette, Wand2, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-orange-500 mb-8 glow-amber">
            <Sparkles size={40} className="text-black" />
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-[var(--foreground)] mb-4">
            The Style Studio
          </h1>
          <p className="text-xl lg:text-2xl text-[var(--accent-primary)] font-mono mb-6">
            Digital Darkroom
          </p>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto mb-12">
            Transform your cartoon concepts into gritty, photorealistic cinematography. 
            Powered by AI art direction and style transfer technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/brief"
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              Start Creating
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/studio"
              className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              Jump to Studio
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Feature 1 */}
            <div className="card-dark hover:border-[var(--accent-primary)] transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/20 flex items-center justify-center mb-4 group-hover:bg-[var(--accent-primary)]/30 transition-colors">
                <FileText size={24} className="text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                The Director
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                AI Art Director analyzes your concept and generates a polished 
                &quot;Director&apos;s Treatment&quot; with lighting, lens, and texture specifications.
              </p>
              <Link 
                href="/brief" 
                className="inline-flex items-center gap-1 text-sm text-[var(--accent-primary)] mt-4 hover:underline"
              >
                Start here <ArrowRight size={14} />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="card-dark hover:border-purple-500 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Palette size={24} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Style Transfer
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Combine structure and style references to generate gritty, 
                photorealistic images using advanced AI image generation.
              </p>
              <Link 
                href="/studio" 
                className="inline-flex items-center gap-1 text-sm text-purple-400 mt-4 hover:underline"
              >
                Open Studio <ArrowRight size={14} />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="card-dark hover:border-blue-500 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Wand2 size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Prompt Polish
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Rewrite any prompt for gritty realism. Transform &quot;cute&quot; descriptions 
                into cinematic, texture-rich specifications.
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-blue-400 mt-4">
                Available in Studio
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] p-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            Powered by Google Gemini API
          </p>
          <div className="flex items-center gap-6 text-sm text-[var(--foreground-muted)]">
            <Link href="/brief" className="hover:text-[var(--foreground)] transition-colors">
              The Brief
            </Link>
            <Link href="/studio" className="hover:text-[var(--foreground)] transition-colors">
              The Studio
            </Link>
            <Link href="/settings" className="hover:text-[var(--foreground)] transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
