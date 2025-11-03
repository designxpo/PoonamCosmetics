'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export default function ImageUpload({ value, onChange, label, required }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum 5MB allowed.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onChange(data.url);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="space-y-3">
        {/* Image Preview */}
        {value && (
          <div className="relative inline-block">
            <img
              src={value}
              alt="Upload preview"
              className="w-full h-48 object-cover rounded-sm border border-slate-200"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* Upload Options */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* File Upload Button */}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <>
                  <FiLoader size={18} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FiUpload size={18} />
                  <span>Upload Image</span>
                </>
              )}
            </button>
          </div>

          {/* URL Input */}
          <div className="flex-1">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or paste image URL"
              className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={uploading}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Upload an image (max 5MB) or paste an image URL. Supported formats: JPG, PNG, WebP, GIF
        </p>
      </div>
    </div>
  );
}
