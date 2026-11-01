'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  X,
  Tag,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronDown
} from 'lucide-react';
import axiosInstance from '@/components/helper/axiosInstance';

interface ProblemListClientProps {
  initialQuestions?: any[];
  initialTotal?: number;
  initialTopics?: any[];
  initialCounts?: {
    all?: number;
    easy?: number;
    medium?: number;
    hard?: number;
  } | null;
}

export default function ProblemListClient({
  initialQuestions = [],
  initialTotal = 0,
  initialTopics = [],
  initialCounts = null,
}: ProblemListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [questions, setQuestions] = useState<any[]>(initialQuestions);
  const [totalProblems, setTotalProblems] = useState<number>(initialTotal || initialQuestions.length);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil((initialTotal || initialQuestions.length) / 20) || 1
  );

  const [topics, setTopics] = useState<any[]>(initialTopics);
  const [counts, setCounts] = useState<{ all?: number; easy?: number; medium?: number; hard?: number } | null>(
    initialCounts
  );

  const [loading, setLoading] = useState<boolean>(initialQuestions.length === 0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [topicSearchInput, setTopicSearchInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const topicScrollRef = useRef<HTMLDivElement>(null);

  // Close topic dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTopicDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch topics & stats on mount
  useEffect(() => {
    const fetchTopicsAndCounts = async () => {
      try {
        const response = await axiosInstance.get('/api/problem/topics');
        if (response.data?.topics) {
          setTopics(response.data.topics);
        }
        if (response.data?.counts) {
          setCounts(response.data.counts);
        }
      } catch (err) {
        console.error('Failed to fetch topics:', err);
      }
    };
    fetchTopicsAndCounts();
  }, []);

  // Fetch from backend with debouncing for search
  const isInitialMount = useRef(true);
  useEffect(() => {
    // Skip first run if we already have initialQuestions from SSR and on default page 1
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (initialQuestions.length > 0) return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsFetching(true);
        const params = new URLSearchParams();
        params.set('paginated', 'true');
        params.set('page', String(currentPage));
        params.set('limit', String(pageSize));

        if (selectedDifficulty !== 'All') {
          params.set('difficulty', selectedDifficulty.toLowerCase());
        }
        if (selectedTopic !== 'All') {
          params.set('topic', selectedTopic);
        }
        if (searchTerm.trim()) {
          params.set('search', searchTerm.trim());
        }

        const res = await axiosInstance.get(`/api/problem?${params.toString()}`);
        if (res.data) {
          if (Array.isArray(res.data)) {
            setQuestions(res.data);
            setTotalProblems(res.data.length);
            setTotalPages(Math.ceil(res.data.length / pageSize) || 1);
          } else if (res.data.problems) {
            setQuestions(res.data.problems);
            setTotalProblems(res.data.total ?? res.data.problems.length);
            setTotalPages(res.data.totalPages ?? (Math.ceil(res.data.total / pageSize) || 1));
            if (res.data.topics && topics.length === 0) {
              setTopics(res.data.topics);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching filtered problems:', error);
      } finally {
        setIsFetching(false);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedDifficulty, selectedTopic, currentPage, pageSize]);

  // Reset page to 1 when filters change
  const handleDifficultyChange = (diff: string) => {
    setSelectedDifficulty(diff);
    setCurrentPage(1);
  };

  const handleTopicChange = (topicName: string) => {
    setSelectedTopic(topicName);
    setCurrentPage(1);
    setTopicDropdownOpen(false);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('All');
    setSelectedTopic('All');
    setCurrentPage(1);
  };

  // Instant client-side filter fallback on the current set of problems
  const displayedQuestions = useMemo(() => {
    return questions.filter((q) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        q?.quesName?.toLowerCase().includes(term) ||
        (q?.quesId && String(q.quesId).toLowerCase().includes(term)) ||
        (Array.isArray(q?.tags) && q.tags.some((t: string) => t?.toLowerCase().includes(term)));

      const matchesDifficulty =
        selectedDifficulty === 'All' ||
        q?.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchesTopic =
        selectedTopic === 'All' ||
        (Array.isArray(q?.tags) &&
          q.tags.some((t: string) => t?.toLowerCase() === selectedTopic.toLowerCase()));

      return matchesSearch && matchesDifficulty && matchesTopic;
    });
  }, [questions, searchTerm, selectedDifficulty, selectedTopic]);

  // Extracted unique topic list (supports string[] or { name, count }[])
  const normalizedTopics = useMemo(() => {
    if (topics.length > 0) {
      return topics.map((t) => (typeof t === 'string' ? { name: t, count: null } : t));
    }
    // Fallback: extract from questions
    const tagMap = new Map<string, number>();
    questions.forEach((q) => {
      if (Array.isArray(q.tags)) {
        q.tags.forEach((tag: string) => {
          if (tag) {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
          }
        });
      }
    });
    return Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }));
  }, [topics, questions]);

  const filteredDropdownTopics = useMemo(() => {
    if (!topicSearchInput.trim()) return normalizedTopics;
    const term = topicSearchInput.toLowerCase();
    return normalizedTopics.filter((t) => t.name.toLowerCase().includes(term));
  }, [normalizedTopics, topicSearchInput]);

  const difficultyFilters = [
    { label: 'All', value: 'All', count: counts?.all },
    { label: 'Easy', value: 'Easy', count: counts?.easy },
    { label: 'Medium', value: 'Medium', count: counts?.medium },
    { label: 'Hard', value: 'Hard', count: counts?.hard },
  ];

  // Pagination calculation
  const startItem = totalProblems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalProblems);

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Top Background Progress Bar when refetching */}
      {isFetching && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-amber-500 z-50 animate-pulse" />
      )}

      {/* Header with Stats Badges */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Interactive Workspace
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Practice Problems
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl">
            Solve curated algorithmic challenges and level up your data structure mastery with multi-language execution.
          </p>
        </div>

        {/* Difficulty Breakdown Badges */}
        {counts && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border border-gray-200 dark:border-gray-700">
              Total: <strong className="text-gray-900 dark:text-white">{counts.all ?? totalProblems}</strong>
            </span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800/40">
              Easy: <strong>{counts.easy ?? 0}</strong>
            </span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-800/40">
              Medium: <strong>{counts.medium ?? 0}</strong>
            </span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-800/40">
              Hard: <strong>{counts.hard ?? 0}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Main Filter Section */}
      <div className="space-y-4 mb-6">
        {/* Row 1: Search & Difficulty Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-2xl">
            <div className="flex items-center bg-gray-50 dark:bg-gray-900 px-4 py-3 rounded-2xl w-full border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all shadow-xs">
              <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search by title, number, or tag (e.g. Two Sum, Dynamic Programming)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent w-full focus:outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {difficultyFilters.map((diff) => {
              const isSelected = selectedDifficulty.toLowerCase() === diff.value.toLowerCase();
              return (
                <button
                  key={diff.value}
                  onClick={() => handleDifficultyChange(diff.value)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? diff.value === 'Easy'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : diff.value === 'Medium'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                        : diff.value === 'Hard'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                        : 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <span>{diff.label}</span>
                  {diff.count !== undefined && diff.count !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isSelected
                          ? 'bg-black/20 text-white'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {diff.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Topic Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full overflow-hidden">
            {/* Topic Filter Dropdown Button */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setTopicDropdownOpen(!topicDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  selectedTopic !== 'All'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedTopic === 'All' ? 'Select Topic' : selectedTopic}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Dropdown Menu */}
              {topicDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-50 p-2 max-h-80 flex flex-col">
                  <div className="px-2 py-1 mb-2 border-b border-gray-100 dark:border-gray-800">
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={topicSearchInput}
                      onChange={(e) => setTopicSearchInput(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="overflow-y-auto flex-1 space-y-1">
                    <button
                      onClick={() => handleTopicChange('All')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        selectedTopic === 'All'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>All Topics</span>
                      {selectedTopic === 'All' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    {filteredDropdownTopics.map((top) => {
                      const isSelected = selectedTopic.toLowerCase() === top.name.toLowerCase();
                      return (
                        <button
                          key={top.name}
                          onClick={() => handleTopicChange(top.name)}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className="truncate">{top.name}</span>
                          <span className="flex items-center gap-1.5 shrink-0 ml-2">
                            {top.count !== null && (
                              <span className="text-[10px] text-gray-400">
                                {top.count}
                              </span>
                            )}
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </span>
                        </button>
                      );
                    })}

                    {filteredDropdownTopics.length === 0 && (
                      <div className="p-3 text-center text-xs text-gray-400">
                        No topics match &quot;{topicSearchInput}&quot;
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Horizontal Topic Pills Bar */}
            <div
              ref={topicScrollRef}
              className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none flex-1"
            >
              <button
                onClick={() => handleTopicChange('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTopic === 'All'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                All Topics
              </button>

              {normalizedTopics.slice(0, 15).map((top) => {
                const isSelected = selectedTopic.toLowerCase() === top.name.toLowerCase();
                return (
                  <button
                    key={top.name}
                    onClick={() => handleTopicChange(top.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-white font-bold shadow-xs'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{top.name}</span>
                    {top.count !== null && (
                      <span
                        className={`text-[10px] px-1 rounded-sm ${
                          isSelected ? 'bg-amber-600/60 text-white' : 'text-gray-400'
                        }`}
                      >
                        {top.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Clear Tag */}
          {(selectedDifficulty !== 'All' || selectedTopic !== 'All' || searchTerm) && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 hover:underline shrink-0 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-gray-800/60 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4 w-32">Difficulty</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4 text-right w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {displayedQuestions.map((q, idx) => (
                <tr
                  key={q._id || idx}
                  className="hover:bg-slate-50/70 dark:hover:bg-gray-800/40 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    {q.quesId || (currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/problem/${q._id}`}
                      className="font-bold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {q.quesName || q.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                        q.difficulty?.toLowerCase() === 'easy'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : q.difficulty?.toLowerCase() === 'medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}
                    >
                      {q.difficulty || 'Easy'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(q.tags) &&
                        q.tags.map((tag: string, tIdx: number) => {
                          const isTagActive = selectedTopic.toLowerCase() === tag.toLowerCase();
                          return (
                            <button
                              key={tIdx}
                              onClick={() => handleTopicChange(tag)}
                              className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                                isTagActive
                                  ? 'bg-amber-500 text-white font-bold'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400'
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/problem/${q._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-all group-hover:shadow-xs"
                    >
                      <span>Solve</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {displayedQuestions.length === 0 && !loading && (
          <div className="p-12 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div className="text-gray-900 dark:text-white font-bold text-lg">
              No matching problems found
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              No algorithmic challenges matched your current search and filter combination.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="px-6 py-4 bg-slate-50/60 dark:bg-gray-800/40 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-gray-900 dark:text-white">{startItem}</strong> to{' '}
              <strong className="text-gray-900 dark:text-white">{endItem}</strong> of{' '}
              <strong className="text-gray-900 dark:text-white">{totalProblems}</strong> problems
            </span>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 ml-2">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || isFetching}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Smart page window
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={isFetching}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || isFetching}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
