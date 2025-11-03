'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiSave, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    whatsappNumber: '',
    deliveryCharge: 50,
    freeDeliveryThreshold: 999,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({
          whatsappNumber: data.settings.whatsappNumber || '',
          deliveryCharge: data.settings.deliveryCharge || 50,
          freeDeliveryThreshold: data.settings.freeDeliveryThreshold || 999,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Configure your store settings</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <FiSettings className="mr-2" />
            WhatsApp & Delivery Settings
          </h2>

          <div className="space-y-6 max-w-2xl">
            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                WhatsApp Number
                <span className="text-slate-500 ml-2 font-normal">(Include country code, no + or spaces)</span>
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="919999999999"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Example: 919876543210 (for Indian number +91 9876543210)
              </p>
            </div>

            {/* Delivery Charge */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Delivery Charge (₹)
              </label>
              <input
                type="number"
                value={settings.deliveryCharge}
                onChange={(e) => setSettings({ ...settings, deliveryCharge: parseFloat(e.target.value) })}
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Standard delivery charge applied to all orders
              </p>
            </div>

            {/* Free Delivery Threshold */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(e.target.value) })}
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Orders above this amount will get free delivery
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                <FiSave />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Settings Preview</h3>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">
              <strong>WhatsApp Orders:</strong> {settings.whatsappNumber || 'Not configured'}
            </p>
            <p className="text-slate-700">
              <strong>Delivery Charge:</strong> ₹{settings.deliveryCharge}
            </p>
            <p className="text-slate-700">
              <strong>Free Delivery:</strong> On orders above ₹{settings.freeDeliveryThreshold}
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 How to Use</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• WhatsApp number will be used for order notifications</li>
            <li>• Delivery charge is added to all orders by default</li>
            <li>• Free delivery applies automatically for orders above threshold</li>
            <li>• Changes take effect immediately after saving</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
