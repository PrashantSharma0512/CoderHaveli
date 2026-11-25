import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Save, RefreshCw, Users, Eye, Edit3 } from 'lucide-react';
import toast from '@/components/common/CoderHaveliToast';
import axiosInstance from '../../components/helper/axiosInstance';

const PrivacyPolicyContent = () => {
  const [title, setTitle] = useState('CoderHaveli Privacy Policy');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState(1);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const fetchPolicy = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/privacy-policy');
      if (res.data?.success && res.data?.data) {
        const { policy, acceptedCount: acc, totalUsers: tot } = res.data.data;
        if (policy) {
          setTitle(policy.title || 'CoderHaveli Privacy Policy');
          setContent(policy.content || '');
          setVersion(policy.version || 1);
          setUpdatedAt(policy.updatedAt || null);
        }
        setAcceptedCount(acc || 0);
        setTotalUsers(tot || 0);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load privacy policy');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Privacy policy content cannot be empty');
      return;
    }
    try {
      setSaving(true);
      const res = await axiosInstance.put('/admin/privacy-policy', { title, content });
      if (res.data?.success) {
        toast.success(res.data.message || 'Privacy Policy published!');
        fetchPolicy();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish privacy policy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
              <ShieldCheck className="w-6 h-6" />
            </span>
            Privacy Policy Manager
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Publishing an update increments the policy version and prompts all users to review &amp; accept the new terms.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPolicy}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 uppercase font-semibold">Current Version</div>
          <div className="mt-1 text-2xl font-black text-amber-500">v{version}</div>
          {updatedAt && (
            <div className="text-[11px] text-gray-400 mt-1">Updated {new Date(updatedAt).toLocaleString()}</div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            Users Accepted v{version}
          </div>
          <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {acceptedCount} <span className="text-sm font-semibold text-gray-400">/ {totalUsers}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 uppercase font-semibold">Pending Acceptance</div>
          <div className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
            {Math.max(0, totalUsers - acceptedCount)}
          </div>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Edit Privacy Policy
          </h2>
          <button
            type="button"
            onClick={() => setPreviewMode((p) => !p)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
        </div>

        {previewMode ? (
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-3">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">{title}</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {content}
            </div>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Policy Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Policy Content
              </label>
              <textarea
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white font-sans leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500">
                Saving will publish <strong>v{version + 1}</strong> and notify all users.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Publishing...' : `Save & Publish v${version + 1}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;

