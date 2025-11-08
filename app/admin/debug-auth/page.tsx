'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiAlertCircle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

export default function DebugAuthPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    if (token) {
      // Decode the token to see what's inside
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setTokenDetails(payload);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  const testAuthentication = async () => {
    setTesting(true);
    const results: any = {
      orders: null,
      categories: null,
      users: null,
    };

    try {
      // Test orders API
      const ordersRes = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      results.orders = {
        status: ordersRes.status,
        ok: ordersRes.ok,
        data: ordersRes.ok ? await ordersRes.json() : await ordersRes.text(),
      };

      // Test categories API
      const categoriesRes = await fetch('/api/categories');
      results.categories = {
        status: categoriesRes.status,
        ok: categoriesRes.ok,
        data: categoriesRes.ok ? await categoriesRes.json() : await categoriesRes.text(),
      };

      // Test users API
      const usersRes = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      results.users = {
        status: usersRes.status,
        ok: usersRes.ok,
        data: usersRes.ok ? await usersRes.json() : await usersRes.text(),
      };

      setTestResults(results);
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setTesting(false);
    }
  };

  const handleForceLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Authentication Debug</h1>
          <p className="text-slate-600 mt-1">Debug and fix authentication issues</p>
        </div>

        {/* Current User Info */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Current User</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Name:</span>
              <span className="text-slate-900">{user?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Email:</span>
              <span className="text-slate-900">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Role:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                user?.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user?.role || 'N/A'}
              </span>
            </div>
            <div className="flex items-start gap-2 mt-4">
              <span className="font-medium text-slate-700">Token:</span>
              <div className="flex-1">
                <pre className="text-xs bg-slate-50 p-2 rounded overflow-x-auto max-w-full">
                  {token ? token.substring(0, 50) + '...' : 'No token'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Token Details */}
        {tokenDetails && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Token Payload</h2>
            <pre className="text-sm bg-slate-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(tokenDetails, null, 2)}
            </pre>
          </div>
        )}

        {/* Test Authentication */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Test Authentication</h2>
          <button
            onClick={testAuthentication}
            disabled={testing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiRefreshCw className={testing ? 'animate-spin' : ''} />
            {testing ? 'Testing...' : 'Test API Endpoints'}
          </button>

          {testResults && (
            <div className="mt-4 space-y-3">
              {Object.entries(testResults).map(([api, result]: [string, any]) => (
                <div key={api} className={`p-4 rounded-lg border ${
                  result.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.ok ? (
                      <FiCheckCircle className="text-green-600" />
                    ) : (
                      <FiAlertCircle className="text-red-600" />
                    )}
                    <span className="font-semibold capitalize">{api} API</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <pre className="text-xs bg-white p-2 rounded overflow-x-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-2">Fix Authentication Issues</h3>
              <p className="text-sm text-yellow-800 mb-4">
                If you're seeing 401 or 403 errors, your token might be stale or invalid. 
                Click the button below to log out and then log back in with your credentials 
                to get a fresh token.
              </p>
              <button
                onClick={handleForceLogout}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Force Logout & Re-login
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
