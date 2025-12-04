'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn, fileToBase64, isValidImageFile } from '@/lib/utils';

interface DragDropZoneProps {
  onImageSelect: (imageData: string) => void;
  currentImage?: string | null;
  onClear?: () => void;
  label?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  onImageSelect,
  currentImage,
  onClear,
  label = 'Upload Image',
  description = 'Drag and drop or click to browse',
  className,
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    
    if (!isValidImageFile(file)) {
      setError('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File too large. Maximum size is 10MB.');
      return;
    }
    
    setIsLoading(true);
    try {
      const base64 = await fileToBase64(file);
      onImageSelect(base64);
    } catch {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [onImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear?.();
    setError(null);
  };

  // If there's a current image, show preview
  if (currentImage) {
    return (
      <div className={cn('relative group', className)}>
        <div className={cn(
          'relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]',
          compact ? 'aspect-square' : 'aspect-video'
        )}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={currentImage} 
            alt="Uploaded preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleClear}
              className="p-2 bg-[var(--error)] rounded-full text-white hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-[var(--foreground-muted)]">
            {label}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200',
          compact ? 'aspect-square p-4' : 'aspect-video p-8',
          isDragging
            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
            : 'border-[var(--border)] bg-[var(--background-secondary)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--background-tertiary)]',
          isLoading && 'pointer-events-none opacity-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center h-full text-center">
          {isLoading ? (
            <>
              <div className="w-10 h-10 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-[var(--foreground-muted)]">Processing...</p>
            </>
          ) : (
            <>
              <div className={cn(
                'rounded-full bg-[var(--background-tertiary)] mb-3 flex items-center justify-center',
                compact ? 'w-10 h-10' : 'w-14 h-14'
              )}>
                {isDragging ? (
                  <ImageIcon size={compact ? 20 : 28} className="text-[var(--accent-primary)]" />
                ) : (
                  <Upload size={compact ? 20 : 28} className="text-[var(--foreground-muted)]" />
                )}
              </div>
              <p className={cn(
                'font-medium text-[var(--foreground)]',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {label}
              </p>
              {!compact && (
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  {description}
                </p>
              )}
              {!compact && (
                <p className="text-xs text-[var(--foreground-muted)] mt-2">
                  JPEG, PNG, GIF, WebP • Max 10MB
                </p>
              )}
            </>
          )}
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-xs text-[var(--error)]">{error}</p>
      )}
    </div>
  );
};

export default DragDropZone;
