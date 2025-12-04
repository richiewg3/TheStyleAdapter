'use client';

import React from 'react';
import { Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { downloadImage } from '@/lib/utils';

export default function GalleryPage() {
  const { generatedImage, setGeneratedImage } = useProjectStore();

  // In a real app, this would be a list of saved renders
  const renders = generatedImage ? [{ id: '1', url: generatedImage, createdAt: new Date() }] : [];

  const handleDownload = (url: string) => {
    const timestamp = new Date().getTime();
    downloadImage(url, `style-studio-render-${timestamp}.png`);
  };

  const handleDelete = (id: string) => {
    if (id === '1') {
      setGeneratedImage(null);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-2">
          Gallery
        </h1>
        <p className="text-[var(--foreground-muted)] max-w-2xl">
          View and manage your rendered images. Download or delete renders from your session.
        </p>
      </div>

      {/* Gallery Grid */}
      {renders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renders.map((render) => (
            <div 
              key={render.id}
              className="group relative rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--background-secondary)]"
            >
              <div className="aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={render.url} 
                  alt="Rendered image" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs text-[var(--foreground-muted)] mb-3">
                    {render.createdAt.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(render.url)}
                      className="flex-1 py-2 px-3 bg-[var(--accent-primary)] text-black rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--accent-secondary)] transition-colors"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(render.id)}
                      className="py-2 px-3 bg-[var(--error)]/20 text-[var(--error)] rounded-lg text-sm font-medium flex items-center justify-center hover:bg-[var(--error)]/30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-6">
            <ImageIcon size={40} className="text-[var(--foreground-muted)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            No renders yet
          </h2>
          <p className="text-[var(--foreground-muted)] text-center max-w-md mb-6">
            Your rendered images will appear here. Go to The Studio to create your first render.
          </p>
          <a 
            href="/studio"
            className="btn-primary"
          >
            Go to Studio
          </a>
        </div>
      )}
    </div>
  );
}
