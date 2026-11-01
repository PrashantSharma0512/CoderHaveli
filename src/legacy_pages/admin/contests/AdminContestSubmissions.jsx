'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  FileCode,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Code2,
  RefreshCw,
  X,
  Copy
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../components/helper/axiosInstance';

export default function AdminContestSubmissions() {
  const { contestId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verdictFilter, setVerdictFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Source code inspection modal
  const [viewCodeModal, setViewCodeModal] = useState({ open: false, submission: null });

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/admin/contests/${contestId}/submissions?verdict=${verdictFilter}&page=${page}&limit=20`
      );
      if (res.data.success) {
        setSubmissions(res.data.submissions);
        setTotalPages(res.data.pagination.pages || 1);
      }
    } catch (err) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [contestId, verdictFilter, page]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/contests"
            className="p-2 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-6 h-6 text-amber-500" />
              <span>Contest Submissions Audit</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Inspect participant submissions, execution times, verdicts, and code.
            </p>
          </div>
        </div>

        <button
          onClick={fetchSubmissions}
          className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400 font-bold">Filter Verdict:</span>
        <select
          value={verdictFilter}
          onChange={(e) => { setVerdictFilter(e.target.value); setPage(1); }}
          className="bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-2 outline-none transition-colors"
        >
          <option value="all">All Verdicts</option>
          <option value="Accepted">Accepted</option>
          <option value="Wrong Answer">Wrong Answer</option>
          <option value="Time Limit Exceeded">Time Limit Exceeded</option>
          <option value="Runtime Error">Runtime Error</option>
          <option value="Compilation Error">Compilation Error</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 uppercase font-black tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4">Participant</th>
                <th className="px-4 py-4">Problem</th>
                <th className="px-4 py-4">Verdict</th>
                <th className="px-4 py-4">Score</th>
                <th className="px-4 py-4">Language</th>
                <th className="px-4 py-4">Runtime</th>
                <th className="px-4 py-4">Submitted At</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {submissions.length > 0 ? (
                submissions.map((s) => (
                  <tr key={s._id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.04] transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                      {s.user?.name || 'Anonymous'}
                      <span className="block text-[11px] text-gray-500 dark:text-gray-400">@{s.user?.username}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                      {s.problem?.quesName || 'Problem'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        s.verdict === 'Accepted'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {s.verdict}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-black text-amber-600 dark:text-amber-400">
                      {s.score} pts
                    </td>
                    <td className="px-4 py-4 font-mono text-gray-600 dark:text-gray-400 capitalize">
                      {s.language}
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400 font-mono">
                      {s.runtime}ms
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(s.submittedAt).toLocaleTimeString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setViewCodeModal({ open: true, submission: s })}
                        className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        View Code
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Inspector Modal */}
      {viewCodeModal.open && viewCodeModal.submission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
                  Submission Code: {viewCodeModal.submission.problem?.quesName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By {viewCodeModal.submission.user?.name} • Language: {viewCodeModal.submission.language} • Verdict: {viewCodeModal.submission.verdict}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(viewCodeModal.submission.sourceCode || '');
                    toast.success('Source code copied');
                  }}
                  className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  title="Copy Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewCodeModal({ open: false, submission: null })}
                  className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-auto bg-slate-900 text-gray-100 font-mono text-xs">
              <pre className="whitespace-pre-wrap">{viewCodeModal.submission.sourceCode}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
