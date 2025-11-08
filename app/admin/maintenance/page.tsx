'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuthStore } from '@/store/authStore';
import { FiTool, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminFixToolsPage() {
  const { token } = useAuthStore();
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fixProductCategories = async () => {
    if (!token) {
      toast.error('Not authenticated');
      return;
    }

    setFixing(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/fix-product-categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Fixed ${data.fixed} products!`);
        setResult(data);
      } else {
        toast.error(data.error || 'Failed to fix products');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fix products');
    } finally {
      setFixing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Database Maintenance Tools</h1>
          <p className="text-slate-600 mt-1">Fix common database issues</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiTool size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Fix Product Category References
              </h2>
              <p className="text-slate-600 mb-4">
                This tool will scan all products and fix any that have category slugs instead of 
                ObjectIds. This fixes the error: "Cast to ObjectId failed for value 'lipstick'".
              </p>
              <button
                onClick={fixProductCategories}
                disabled={fixing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fixing ? 'Fixing...' : 'Run Fix'}
              </button>
            </div>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-slate-900 mb-3">Results:</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <FiCheckCircle />
                      <span className="font-semibold">Fixed: {result.fixed}</span>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <FiAlertCircle />
                      <span className="font-semibold">Errors: {result.errors}</span>
                    </div>
                  </div>
                </div>

                {result.details?.fixed?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-slate-900 mb-2">Fixed Products:</h4>
                    <div className="bg-slate-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                      <ul className="text-sm text-slate-700 space-y-1">
                        {result.details.fixed.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <FiCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {result.details?.errors?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Errors:</h4>
                    <div className="bg-red-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                      <ul className="text-sm text-red-700 space-y-1">
                        {result.details.errors.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={16} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Run this tool if you see "Cast to ObjectId failed" errors</li>
                <li>This will update products that have category slugs to use proper ObjectIds</li>
                <li>Products with non-existent category slugs will be reported as errors</li>
                <li>Safe to run multiple times</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
