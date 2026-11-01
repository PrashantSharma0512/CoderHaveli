'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  Trophy,
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  Layers,
  Settings,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  Lock,
  Globe,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../components/helper/axiosInstance';

export default function AdminContestForm() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(contestId);

  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'schedule', 'problems', 'settings'
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Available problems from database
  const [allProblems, setAllProblems] = useState([]);
  const [problemSearch, setProblemSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    detailedDescription: '',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    contestType: 'public',
    difficulty: 'All Levels',
    status: 'draft',
    visibility: 'public',
    startTime: '',
    endTime: '',
    registrationOpenAt: '',
    registrationCloseAt: '',
    timezone: 'Asia/Kolkata',
    rules: '1. No plagiarism allowed.\n2. Submissions after contest end will not be counted towards rank.\n3. Each wrong attempt on a problem before solve may incur penalty minutes.',
    prize: 'Top rankers win CoderHaveli badges & community recognition!',
    accessCode: '',
    maxParticipants: 0,
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    scoringConfig: {
      wrongPenalty: 10,
      partialScoring: false,
      tieBreaker: 'penalty_then_time'
    },
    leaderboardVisibility: 'always',
    problems: []
  });

  // Fetch available problems for the picker
  useEffect(() => {
    const fetchExistingProblems = async () => {
      try {
        const res = await axiosInstance.get('/api/problem');
        if (Array.isArray(res.data)) {
          setAllProblems(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch problems list:', err);
      }
    };
    fetchExistingProblems();
  }, []);

  // Fetch contest data if in edit mode
  useEffect(() => {
    if (!isEdit) return;

    const fetchContest = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/admin/contests/${contestId}`);
        if (res.data.success) {
          const c = res.data.contest;

          // Format ISO strings to datetime-local values (YYYY-MM-DDTHH:mm) in local browser time
          const toLocalInput = (iso) => {
            if (!iso) return '';
            const d = new Date(iso);
            if (isNaN(d.getTime())) return '';
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
          };

          setFormData({
            title: c.title || '',
            slug: c.slug || '',
            description: c.description || '',
            detailedDescription: c.detailedDescription || '',
            banner: c.banner || '',
            contestType: c.contestType || 'public',
            difficulty: c.difficulty || 'All Levels',
            status: c.status || 'draft',
            visibility: c.visibility || 'public',
            startTime: toLocalInput(c.startTime),
            endTime: toLocalInput(c.endTime),
            registrationOpenAt: toLocalInput(c.registrationOpenAt),
            registrationCloseAt: toLocalInput(c.registrationCloseAt),
            timezone: c.timezone || 'Asia/Kolkata',
            rules: c.rules || '',
            prize: c.prize || '',
            accessCode: c.accessCode || '',
            maxParticipants: c.maxParticipants || 0,
            allowedLanguages: c.allowedLanguages || ['javascript', 'python', 'cpp', 'java'],
            scoringConfig: {
              wrongPenalty: c.scoringConfig?.wrongPenalty ?? 10,
              partialScoring: !!c.scoringConfig?.partialScoring,
              tieBreaker: c.scoringConfig?.tieBreaker || 'penalty_then_time'
            },
            leaderboardVisibility: c.leaderboardVisibility || 'always',
            problems: (c.problems || [])
              .filter(p => p && (p.problem || p._id))
              .map((p, idx) => ({
                problem: p.problem?._id || p.problem,
                quesName: p.problem?.quesName || 'Problem',
                difficulty: p.problem?.difficulty || 'Medium',
                points: p.points || 100,
                order: p.order || idx + 1
              }))
          });
        }
      } catch (err) {
        toast.error('Failed to load contest for editing');
        navigate('/admin/contests');
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId, isEdit, navigate]);

  // Handle title change & auto-generate slug in create mode
  const handleTitleChange = (val) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: !isEdit && !prev.slug
        ? val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
        : prev.slug
    }));
  };

  // Add problem to contest
  const handleAddProblem = (prob) => {
    const exists = formData.problems.some(p => p.problem === prob._id);
    if (exists) {
      toast.error('Problem already added to contest');
      return;
    }

    setFormData(prev => ({
      ...prev,
      problems: [
        ...prev.problems,
        {
          problem: prob._id,
          quesName: prob.quesName,
          difficulty: prob.difficulty,
          points: 100,
          order: prev.problems.length + 1
        }
      ]
    }));
    toast.success(`Added "${prob.quesName}"`);
  };

  // Remove problem
  const handleRemoveProblem = (index) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems.filter((_, i) => i !== index)
    }));
  };

  // Move problem up/down
  const handleMoveProblem = (index, direction) => {
    const newProblems = [...formData.problems];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newProblems.length) return;

    const temp = newProblems[index];
    newProblems[index] = newProblems[target];
    newProblems[target] = temp;

    // renumber orders
    newProblems.forEach((p, idx) => { p.order = idx + 1; });
    setFormData(prev => ({ ...prev, problems: newProblems }));
  };

  // Language checkbox toggle
  const handleLanguageToggle = (lang) => {
    setFormData(prev => {
      const exists = prev.allowedLanguages.includes(lang);
      const updated = exists
        ? prev.allowedLanguages.filter(l => l !== lang)
        : [...prev.allowedLanguages, lang];
      return { ...prev, allowedLanguages: updated };
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.title.trim()) {
      toast.error('Please enter a contest title');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      toast.error('Please specify start and end dates/times');
      return;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (end <= start) {
      toast.error('End time must be later than start time');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        registrationOpenAt: formData.registrationOpenAt ? formData.registrationOpenAt : null,
        registrationCloseAt: formData.registrationCloseAt ? formData.registrationCloseAt : null,
        problems: formData.problems
          .filter(p => p && (p.problem || p._id))
          .map((p, idx) => ({
            problem: p.problem?._id || p.problem || p._id,
            points: parseInt(p.points) || 100,
            order: idx + 1
          }))
      };

      if (isEdit) {
        try {
          await axiosInstance.patch(`/api/admin/contests/${contestId}`, payload);
        } catch (patchErr) {
          // If PATCH encountered a network/method restriction, try PUT
          await axiosInstance.put(`/api/admin/contests/${contestId}`, payload);
        }
        toast.success('Contest updated successfully');
      } else {
        await axiosInstance.post('/api/admin/contests', payload);
        toast.success('Contest created successfully');
      }
      navigate('/admin/contests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving contest');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center text-gray-900 dark:text-white">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredProblems = allProblems.filter(p =>
    p.quesName?.toLowerCase().includes(problemSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/contests"
            className="p-2 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {isEdit ? 'Edit Contest' : 'Create New Contest'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Configure contest details, scheduling, problems, and scoring rules.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving...' : isEdit ? 'Update Contest' : 'Save Contest'}</span>
        </button>
      </div>

      {/* Structured Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs shadow-sm">
        {[
          { id: 'basic', label: '1. Basic Information', icon: Trophy },
          { id: 'schedule', label: '2. Scheduling & Access', icon: Calendar },
          { id: 'problems', label: `3. Assigned Problems (${formData.problems.length})`, icon: Layers },
          { id: 'settings', label: '4. Scoring & Options', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: Basic Information */}
        {activeTab === 'basic' && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Contest Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Contest Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haveli Algorithmic Sprint #16"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. haveli-algorithmic-sprint-16"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white font-mono focus:border-amber-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Short Description *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Brief summary displayed on contest cards..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Contest Type
                </label>
                <select
                  value={formData.contestType}
                  onChange={(e) => setFormData({ ...formData, contestType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                >
                  <option value="public">Public</option>
                  <option value="private">Private (Access Code Required)</option>
                  <option value="practice">Practice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                >
                  <option value="All Levels">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="ended">Ended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Banner Image URL
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Contest Rules & Instructions
              </label>
              <textarea
                rows={4}
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none font-mono transition-colors"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Scheduling & Access */}
        {activeTab === 'schedule' && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Scheduling & Participant Access</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Registration Closes At (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.registrationCloseAt}
                  onChange={(e) => setFormData({ ...formData, registrationCloseAt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Timezone
                </label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none font-mono transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Maximum Participants (0 for unlimited)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                />
              </div>

              {formData.contestType === 'private' && (
                <div>
                  <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Private Access Code</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HAVELI_SECRET_2026"
                    value={formData.accessCode}
                    onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-amber-50/50 dark:bg-gray-950/80 border border-amber-500/50 rounded-xl text-xs text-gray-900 dark:text-white font-mono focus:border-amber-500 outline-none transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Problems Assignment */}
        {activeTab === 'problems' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Assigned Problems in Contest */}
            <div className="lg:col-span-7 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center justify-between">
                <span>Assigned Contest Problems</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">{formData.problems.length} Selected</span>
              </h3>

              {formData.problems.length > 0 ? (
                <div className="space-y-3">
                  {formData.problems.map((p, idx) => (
                    <div
                      key={p.problem || idx}
                      className="p-3 bg-slate-50 dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center font-black text-amber-700 dark:text-amber-400">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">{p.quesName}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{p.difficulty}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 dark:text-gray-400">Pts:</span>
                          <input
                            type="number"
                            min="10"
                            step="10"
                            value={p.points}
                            onChange={(e) => {
                              const pts = parseInt(e.target.value) || 100;
                              const updated = [...formData.problems];
                              updated[idx].points = pts;
                              setFormData({ ...formData, problems: updated });
                            }}
                            className="w-16 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-center font-bold text-amber-600 dark:text-amber-400"
                          />
                        </div>

                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveProblem(idx, 'up')}
                          className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === formData.problems.length - 1}
                          onClick={() => handleMoveProblem(idx, 'down')}
                          className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveProblem(idx)}
                          className="p-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-lg ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-8 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
                  No problems added yet. Search and add from the right panel.
                </p>
              )}
            </div>

            {/* Right: Problem Picker */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Find Coding Problems</h3>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search existing questions..."
                  value={problemSearch}
                  onChange={(e) => setProblemSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                {filteredProblems.map((prob) => {
                  const isAdded = formData.problems.some(p => p.problem === prob._id);
                  return (
                    <div
                      key={prob._id}
                      className="p-2.5 bg-slate-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="pr-2">
                        <span className="font-bold text-gray-900 dark:text-white block truncate max-w-[200px]">
                          {prob.quesName}
                        </span>
                        <span className={`text-[10px] ${
                          prob.difficulty === 'Easy' ? 'text-emerald-600 dark:text-emerald-400' :
                          prob.difficulty === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {prob.difficulty}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={isAdded}
                        onClick={() => handleAddProblem(prob)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isAdded
                            ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white cursor-pointer shadow-sm hover:opacity-95'
                        }`}
                      >
                        {isAdded ? 'Added' : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Scoring & Options */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Scoring Configuration & Permissions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Wrong Submission Penalty (Minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.scoringConfig.wrongPenalty}
                  onChange={(e) => setFormData({
                    ...formData,
                    scoringConfig: { ...formData.scoringConfig, wrongPenalty: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Leaderboard Visibility
                </label>
                <select
                  value={formData.leaderboardVisibility}
                  onChange={(e) => setFormData({ ...formData, leaderboardVisibility: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
                >
                  <option value="always">Always Visible (Public & Live)</option>
                  <option value="during">Visible During and After Contest</option>
                  <option value="after">Visible Only After Contest Ends</option>
                </select>
              </div>
            </div>

            {/* Allowed Languages Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Allowed Programming Languages
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'javascript', label: 'JavaScript (Node.js)' },
                  { id: 'python', label: 'Python 3' },
                  { id: 'cpp', label: 'C++' },
                  { id: 'java', label: 'Java' },
                ].map((l) => (
                  <label
                    key={l.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      formData.allowedLanguages.includes(l.id)
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 dark:border-amber-600 text-amber-800 dark:text-amber-300 shadow-sm'
                        : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.allowedLanguages.includes(l.id)}
                      onChange={() => handleLanguageToggle(l.id)}
                      className="hidden"
                    />
                    <span>{l.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prize info */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Prize Information
              </label>
              <input
                type="text"
                value={formData.prize}
                onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-colors"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
