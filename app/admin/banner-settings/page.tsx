'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface BannerSettings {
  _id?: string;
  section: string;
  textColor: string;
  ctaBackgroundColor: string;
  ctaTextColor: string;
  ctaBorderColor: string;
  ctaHoverBackgroundColor: string;
  ctaHoverTextColor: string;
}

const sections = [
  { value: 'bridal-hero', label: 'Bridal Hero Banner' },
  { value: 'commitment', label: 'Commitment Banner' },
  { value: 'best-deals', label: 'Best Deals Section' },
  { value: 'homepage', label: 'Homepage Buttons' },
];

export default function BannerSettingsPage() {
  const [selectedSection, setSelectedSection] = useState('bridal-hero');
  const [settings, setSettings] = useState<BannerSettings>({
    section: 'bridal-hero',
    textColor: '#FFFFFF',
    ctaBackgroundColor: 'transparent',
    ctaTextColor: '#FFFFFF',
    ctaBorderColor: '#FFFFFF',
    ctaHoverBackgroundColor: '#FFFFFF',
    ctaHoverTextColor: '#000000',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [selectedSection]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/banner-settings?section=${selectedSection}`);
      const data = await res.json();
      
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banner-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          section: selectedSection,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Banner settings saved successfully!');
      } else {
        toast.error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      section: selectedSection,
      textColor: '#FFFFFF',
      ctaBackgroundColor: 'transparent',
      ctaTextColor: '#FFFFFF',
      ctaBorderColor: '#FFFFFF',
      ctaHoverBackgroundColor: '#FFFFFF',
      ctaHoverTextColor: '#000000',
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Banner Color Settings</h1>
        <p className="text-text-secondary mb-8">
          Control the colors of text and CTA buttons across different sections of your website.
        </p>

        {/* Section Selector */}
        <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-text-primary"
          >
            {sections.map((section) => (
              <option key={section.value} value={section.value}>
                {section.label}
              </option>
            ))}
          </select>
        </div>

        {/* Color Settings */}
        <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Color Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                  className="h-10 w-20 rounded-sm border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.textColor}
                  onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-text-primary"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            {/* CTA Background Color */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CTA Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.ctaBackgroundColor === 'transparent' ? '#FFFFFF' : settings.ctaBackgroundColor}
                  onChange={(e) => setSettings({ ...settings, ctaBackgroundColor: e.target.value })}
                  className="h-10 w-20 rounded-sm border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaBackgroundColor}
                  onChange={(e) => setSettings({ ...settings, ctaBackgroundColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-text-primary"
                  placeholder="transparent or #FFFFFF"
                />
              </div>
            </div>

            {/* CTA Text Color */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CTA Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.ctaTextColor}
                  onChange={(e) => setSettings({ ...settings, ctaTextColor: e.target.value })}
                  className="h-10 w-20 rounded-sm border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaTextColor}
                  onChange={(e) => setSettings({ ...settings, ctaTextColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-text-primary"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            {/* CTA Border Color */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CTA Border Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.ctaBorderColor}
                  onChange={(e) => setSettings({ ...settings, ctaBorderColor: e.target.value })}
                  className="h-10 w-20 rounded-sm border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaBorderColor}
                  onChange={(e) => setSettings({ ...settings, ctaBorderColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-text-primary"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            {/* CTA Hover Background Color */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CTA Hover Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.ctaHoverBackgroundColor}
                  onChange={(e) => setSettings({ ...settings, ctaHoverBackgroundColor: e.target.value })}
                  className="h-10 w-20 rounded-sm border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaHoverBackgroundColor}
                  onChange={(e) => setSettings({ ...settings, ctaHoverBackgroundColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-text-primary"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            {/* CTA Hover Text Color */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CTA Hover Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.ctaHoverTextColor}
                  onChange={(e) => setSettings({ ...settings, ctaHoverTextColor: e.target.value })}
                  className="h-10 w-20 rounded-sm border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaHoverTextColor}
                  onChange={(e) => setSettings({ ...settings, ctaHoverTextColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-text-primary"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-slate-100 rounded-sm shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Preview</h2>
          <div 
            className="relative h-48 rounded-sm overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: '#333333' }}
          >
            <div className="text-center">
              <h3 
                className="text-2xl font-bold mb-4"
                style={{ color: settings.textColor }}
              >
                Sample Heading Text
              </h3>
              <button
                className="px-8 py-4 rounded-none font-semibold text-lg border-2 transition-all duration-300"
                style={{
                  backgroundColor: settings.ctaBackgroundColor,
                  color: settings.ctaTextColor,
                  borderColor: settings.ctaBorderColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = settings.ctaHoverBackgroundColor;
                  e.currentTarget.style.color = settings.ctaHoverTextColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = settings.ctaBackgroundColor;
                  e.currentTarget.style.color = settings.ctaTextColor;
                }}
              >
                Call to Action
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-text-primary text-white rounded-sm hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-sm hover:bg-slate-50 transition-colors font-medium"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
