'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Trophy,
  Zap,
  Eye,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../components/helper/axiosInstance';

export default function AdminWeeklyScheduler() {
  const [config, setConfig] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [titleTemplate, setTitleTemplate] = useState('');
  const [descriptionTemplate, setDescriptionTemplate] = useState('');

  // Preview Modal
  const [previewModal, setPreviewModal] = useState({ open: false, data: null, loading: false });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [configRes, historyRes] = await Promise.all([
        axiosInstance.get('/api/admin/contests/scheduler/config'),
        axiosInstance.get('/api/admin/contests/scheduler/history?page=1&limit=10')
      ]);

      if (configRes.data?.success) {
        const c = configRes.data.config;
        setConfig(c);
        setNextSchedule(configRes.data.nextSchedule);
        setDayOfWeek(c.dayOfWeek !== undefined ? c.dayOfWeek : 0);
        setStartTime(c.startTime || '11:00');
        setEndTime(c.endTime || '12:00');
        setTimezone(c.timezone || 'Asia/Kolkata');
        setTitleTemplate(c.titleTemplate || 'CoderHaveli Weekly Contest #{weekNumber}');
        setDescriptionTemplate(c.descriptionTemplate || '');
      }

      if (historyRes.data?.success) {
        setHistory(historyRes.data.contests || []);
      }
    } catch (err) {
      console.error('Error fetching weekly scheduler data:', err);
      toast.error('Failed to load scheduler configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Settings
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await axiosInstance.put('/api/admin/contests/scheduler/config', {
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        timezone,
        titleTemplate,
        descriptionTemplate
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Scheduler configuration updated');
        fetchData();
      }
    } catch (err) {
      console.error('Save config error:', err);
      toast.error(err.response?.data?.message || 'Failed to update scheduler configuration');
    } finally {
      setActionLoading(false);
    }
  };

  // Pause / Resume
  const handleTogglePause = async () => {
    const isCurrentlyPaused = config?.isPaused;
    const endpoint = isCurrentlyPaused
      ? '/api/admin/contests/scheduler/resume'
      : '/api/admin/contests/scheduler/pause';
    const confirmMsg = isCurrentlyPaused
      ? 'Resume automatic weekly contest generation?'
      : 'Pause automatic weekly contest generation? Running or created contests will not be affected.';

    if (!window.confirm(confirmMsg)) return;

    try {
      setActionLoading(true);
      const res = await axiosInstance.post(endpoint);
      if (res.data?.success) {
        toast.success(res.data.message || 'Scheduler status updated');
        fetchData();
      }
    } catch (err) {
      console.error('Pause/Resume error:', err);
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Preview Questions
  const handlePreview = async () => {
    try {
      setPreviewModal({ open: true, data: null, loading: true });
      const res = await axiosInstance.get('/api/admin/contests/scheduler/preview');
      if (res.data?.success) {
        setPreviewModal({ open: true, data: res.data.preview, loading: false });
      }
    } catch (err) {
      console.error('Preview error:', err);
      toast.error(err.response?.data?.message || 'Failed to preview weekly questions');
      setPreviewModal({ open: false, data: null, loading: false });
    }
  };

  // Manual Trigger
  const handleManualTrigger = async () => {
    if (!window.confirm('Trigger manual weekly contest generation NOW? This will select 3 problems and create the contest immediately.')) return;

    try {
      setActionLoading(true);
      const res = await axiosInstance.post('/api/admin/contests/scheduler/trigger');
      if (res.data?.success) {
        if (res.data.created) {
          toast.success(res.data.message || 'Weekly contest generated successfully!');
        } else {
          toast(res.data.message || 'Weekly contest already exists for this cycle', { icon: 'ℹ️' });
        }
        fetchData();
      }
    } catch (err) {
      console.error('Trigger error:', err);
      toast.error(err.response?.data?.message || 'Failed to trigger weekly contest');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <Link to="/admin/contests" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Contest Management</span>
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-200 font-medium">Weekly Scheduler</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-500" />
            <span>Weekly Public Contest Scheduler</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Automate weekly public contest generation (1 Easy, 1 Medium, 1 Hard) every Sunday with zero manual intervention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-800 shadow-xs transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handlePreview}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Preview Next Problems</span>
          </button>

          <button
            onClick={handleManualTrigger}
            disabled={actionLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-gray-950 dark:from-amber-400 dark:to-yellow-500 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Trigger Generation Now</span>
          </button>
        </div>
      </div>

      {/* Overview Status Cards */}
      {config && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Scheduler State */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Scheduler State</span>
              <button
                onClick={handleTogglePause}
                disabled={actionLoading}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  config.isPaused
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40 hover:bg-emerald-200'
                    : 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/40 hover:bg-rose-200'
                }`}
              >
                {config.isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                <span>{config.isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>
            <div>
              <span className={`text-xl font-black ${config.isPaused ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {config.isPaused ? 'PAUSED' : 'ACTIVE & RUNNING'}
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {config.isPaused ? 'No automatic contests will be created until resumed.' : 'Generates contest automatically every week.'}
              </p>
            </div>
          </div>

          {/* Card 2: Next Scheduled Run */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Next Execution</span>
            <div>
              <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white block">
                {nextSchedule?.startTime ? new Date(nextSchedule.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : 'Pending calculation'}
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-0.5 block font-semibold">
                Cycle: {nextSchedule?.weeklyIdentifier || 'weekly'} (IST)
              </span>
            </div>
          </div>

          {/* Card 3: Target Timings */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Configured Timings</span>
            <div>
              <span className="text-xl font-black text-gray-900 dark:text-white">
                {config.startTime} – {config.endTime}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">
                Every Sunday • 60 Mins Duration
              </span>
            </div>
          </div>

          {/* Card 4: Last Execution Status */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3 shadow-xs">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Last Run Result</span>
            <div>
              <span className={`text-xl font-black uppercase ${
                config.lastExecutionStatus === 'success' ? 'text-emerald-600 dark:text-emerald-400' : config.lastExecutionStatus === 'failed' ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {config.lastExecutionStatus || 'IDLE'}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">
                {config.lastExecutionAt ? new Date(config.lastExecutionAt).toLocaleDateString() : 'Never executed'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scheduler Configuration Form */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
          <Settings className="w-5 h-5 text-amber-500" />
          <span>Scheduler Settings & Timings</span>
        </h2>

        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Day of Week */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                Contest Day
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs"
              >
                <option value={0}>Sunday (Default)</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                Start Time (IST)
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="11:00"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs font-mono"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                End Time (IST)
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="12:00"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Title Template */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                Title Template
              </label>
              <input
                type="text"
                value={titleTemplate}
                onChange={(e) => setTitleTemplate(e.target.value)}
                placeholder="CoderHaveli Weekly Contest #{weekNumber}"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs"
              />
              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 block">
                Use <code>{'{weekNumber}'}</code> and <code>{'{year}'}</code> placeholders.
              </span>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                Timezone
              </label>
              <input
                type="text"
                value={timezone}
                disabled
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 dark:text-gray-400 outline-none text-xs font-mono cursor-not-allowed"
              />
              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 block">
                Explicitly locked to Asia/Kolkata (IST) as required.
              </span>
            </div>
          </div>

          {/* Description Template */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
              Contest Description Template
            </label>
            <textarea
              value={descriptionTemplate}
              onChange={(e) => setDescriptionTemplate(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:border-amber-500 text-xs resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-gray-950 dark:from-amber-400 dark:to-yellow-500 font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {actionLoading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Weekly Contests History */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>Previously Generated Weekly Contests</span>
        </h2>

        {history.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 py-6 text-center">No weekly public contests generated yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 uppercase font-black tracking-wider border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="py-3 px-4">Contest Title</th>
                  <th className="py-3 px-4">Identifier</th>
                  <th className="py-3 px-4">Start Time (IST)</th>
                  <th className="py-3 px-4">Problems</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {history.map((c) => (
                  <tr key={c._id} className="hover:bg-amber-50/40 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-600 dark:text-amber-400 font-semibold">
                      {c.weeklyIdentifier || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300">
                      {new Date(c.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300">
                      {c.problems?.length || 3} Questions
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        c.status === 'live' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30' :
                        c.status === 'scheduled' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/contests/${c._id}`}
                        className="text-amber-600 dark:text-amber-400 hover:underline font-bold"
                      >
                        View Arena
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-500" />
                <span>Next Weekly Contest Preview</span>
              </h3>
              <button
                onClick={() => setPreviewModal({ open: false, data: null, loading: false })}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewModal.loading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Selecting 1 Easy, 1 Medium, and 1 Hard question randomly...</p>
              </div>
            ) : previewModal.data ? (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">{previewModal.data.title}</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Cycle: {previewModal.data.schedule?.weeklyIdentifier} • Timezone: {previewModal.data.timezone}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">Selected Questions (3)</span>
                  {previewModal.data.problems?.map((p, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-gray-800 text-xs font-black flex items-center justify-center text-amber-700 dark:text-amber-400">
                          {p.order}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{p.title}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">ID: {p.quesId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          p.difficulty === 'Easy' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                          p.difficulty === 'Medium' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400' :
                          'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                        }`}>
                          {p.difficulty}
                        </span>
                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mt-0.5">{p.points} Pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewModal({ open: false, data: null, loading: false })}
                className="px-5 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
