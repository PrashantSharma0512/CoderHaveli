'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import AceEditor from 'react-ace';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Clock,
  Play,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  Minimize2,
  FileText,
  History,
  Info,
  ChevronDown,
  X,
  Sparkles,
  ArrowLeft,
  Flame,
  Code2
} from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import axiosInstance from '../../components/helper/axiosInstance';

// Ace editor modes & themes
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';

import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

export default function ContestArena() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.login || {});

  // Contest & Problems State
  const [contest, setContest] = useState(null);
  const [problemsList, setProblemsList] = useState([]);
  const [activeProblemId, setActiveProblemId] = useState(null);
  const [problemData, setProblemData] = useState(null);
  const [loadingContest, setLoadingContest] = useState(true);
  const [loadingProblem, setLoadingProblem] = useState(false);

  // Left panel tab: 'statement', 'submissions', 'rules'
  const [leftTab, setLeftTab] = useState('statement');

  // Editor State
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorTheme, setEditorTheme] = useState('dracula');

  // Bottom Output State
  const [bottomTab, setBottomTab] = useState('testcases'); // 'testcases', 'runResult', 'submitResult'
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // User submissions history
  const [mySubmissions, setMySubmissions] = useState([]);
  const [userScore, setUserScore] = useState({ totalScore: 0, rank: 0, problemsSolved: 0 });

  // Leaderboard Drawer
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Time remaining countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isEnded: false });

  // In-arena registration state
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [inArenaAccessCode, setInArenaAccessCode] = useState('');
  const [isRegisteringInArena, setIsRegisteringInArena] = useState(false);

  // 1. Load initial contest data
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoadingContest(true);
        const res = await axiosInstance.get(`/api/contests/${contestId}`);
        if (res.data.success) {
          const c = res.data.contest;
          setContest(c);

          if (!c.isUserRegistered) {
            setNeedsRegistration(true);
          }

          // If contest has ended or not live, notify
          if (c.status !== 'live') {
            toast.error(`Contest is currently ${c.status}. Entering read-only mode.`);
          }

          if (c.problems && c.problems.length > 0) {
            setProblemsList(c.problems);
            const firstProbId = c.problems[0].problemId || c.problems[0]._id;
            setActiveProblemId(firstProbId);
          }

          if (c.userScore) {
            setUserScore(c.userScore);
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load contest arena');
        navigate(`/contests/${contestId}`);
      } finally {
        setLoadingContest(false);
      }
    };

    fetchContest();
  }, [contestId, navigate]);

  // Handle in-arena registration
  const handleRegisterInArena = async () => {
    try {
      setIsRegisteringInArena(true);
      const payload = inArenaAccessCode.trim() ? { accessCode: inArenaAccessCode.trim() } : {};
      const res = await axiosInstance.post(`/api/contests/${contestId}/register`, payload);
      if (res.data.success) {
        toast.success(res.data.message || 'Registered successfully! Good luck in the contest arena!');
        setNeedsRegistration(false);
        setContest(prev => ({ ...prev, isUserRegistered: true }));
        // Reload problem statement
        if (activeProblemId) {
          fetchProblem();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsRegisteringInArena(false);
    }
  };

  // 2. Fetch specific active problem details
  const fetchProblem = async () => {
    if (!activeProblemId) return;
    try {
      setLoadingProblem(true);
      const res = await axiosInstance.get(`/api/contests/${contestId}/problems/${activeProblemId}`);
      if (res.data.success) {
        const p = res.data.problem;
        setProblemData(p);
        setNeedsRegistration(false);

        // Restore code from LocalStorage or starter code
        const storageKey = `coderhaveli_contest_${contestId}_prob_${activeProblemId}_${language}`;
        const savedCode = localStorage.getItem(storageKey);
        if (savedCode) {
          setCode(savedCode);
        } else {
          const starter = p.starterCodes?.[language] || '// Write your solution here\n';
          setCode(starter);
        }

        // Pre-populate custom input with first sample testcase
        if (p.sampleTestCases && p.sampleTestCases.length > 0) {
          setCustomInput(p.sampleTestCases[0].input || '');
        }
      }
    } catch (err) {
      console.error('Error fetching problem details:', err);
      const msg = err.response?.data?.message || 'Unable to access problem statement';
      if (err.response?.status === 403 && msg.toLowerCase().includes('register')) {
        setNeedsRegistration(true);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoadingProblem(false);
    }
  };

  useEffect(() => {
    fetchProblem();
    fetchMySubmissions();
  }, [activeProblemId, contestId, language]);

  // 3. Countdown timer for contest end
  useEffect(() => {
    if (!contest?.endTime) return;

    const updateTimer = () => {
      const diff = +new Date(contest.endTime) - +new Date();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isEnded: false
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  // 4. Autosave code to localStorage on edit
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (activeProblemId) {
      const storageKey = `coderhaveli_contest_${contestId}_prob_${activeProblemId}_${language}`;
      localStorage.setItem(storageKey, newCode);
    }
  };

  // Reset to original starter code
  const handleResetCode = () => {
    if (!window.confirm('Reset code to starter template? Your current edits will be lost.')) return;
    const starter = problemData?.starterCodes?.[language] || '';
    setCode(starter);
    if (activeProblemId) {
      const storageKey = `coderhaveli_contest_${contestId}_prob_${activeProblemId}_${language}`;
      localStorage.removeItem(storageKey);
    }
    toast.success('Code reset to default starter');
  };

  // Fetch submissions history
  const fetchMySubmissions = async () => {
    try {
      const res = await axiosInstance.get(`/api/contests/${contestId}/my-submissions`);
      if (res.data.success) {
        setMySubmissions(res.data.submissions);
      }
    } catch (err) {
      // silently ignore or log
    }
  };

  // Fetch live leaderboard
  const fetchLeaderboard = async () => {
    try {
      const res = await axiosInstance.get(`/api/contests/${contestId}/leaderboard`);
      if (res.data.success) {
        setLeaderboardData(res.data.leaderboard || []);
      }
    } catch (err) {
      console.warn('Leaderboard fetch note:', err.message);
    }
  };

  // Run Sample Test Cases
  const handleRunSample = async () => {
    if (needsRegistration || !contest?.isUserRegistered) {
      toast.error('Please register for the contest first to run tests');
      return;
    }

    if (!code.trim()) {
      toast.error('Please write some code before running');
      return;
    }

    try {
      setIsRunning(true);
      setBottomTab('runResult');
      setRunResult(null);

      const res = await axiosInstance.post(`/api/contests/${contestId}/run-sample`, {
        problemId: activeProblemId,
        language,
        sourceCode: code,
        customInput
      });

      if (res.data.success) {
        setRunResult(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error running code test');
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Official Solution
  const handleSubmitSolution = async () => {
    if (needsRegistration || !contest?.isUserRegistered) {
      toast.error('Please register for the contest first to submit solutions');
      return;
    }

    if (timeLeft.isEnded) {
      toast.error('The contest has ended. Submissions are no longer accepted.');
      return;
    }

    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      setBottomTab('submitResult');
      setSubmissionResult(null);

      const res = await axiosInstance.post(`/api/contests/${contestId}/submissions`, {
        problemId: activeProblemId,
        language,
        sourceCode: code
      });

      if (res.data.success) {
        setSubmissionResult(res.data);
        setUserScore(prev => ({
          ...prev,
          totalScore: res.data.totalScore,
          rank: res.data.rank
        }));

        if (res.data.verdict === 'Accepted') {
          toast.success('🎉 Solution Accepted! Points awarded!');
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 5000);
        } else {
          toast.error(`Verdict: ${res.data.verdict}`);
        }

        fetchMySubmissions();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingContest) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm font-bold">Initializing Contest Arena...</p>
        </div>
      </div>
    );
  }

  const isTimeCritical = timeLeft.hours === 0 && timeLeft.minutes < 10 && !timeLeft.isEnded;

  return (
    <div className={`min-h-screen bg-gray-950 text-gray-100 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Confetti Celebration on Accepted */}
      {showCelebration && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
        />
      )}

      {/* Top Bar Navigation & Timer */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2.5 flex items-center justify-between gap-4 select-none">
        {/* Left: Back & Problem Selector */}
        <div className="flex items-center gap-3">
          <Link
            to={`/contests/${contestId}`}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Leave arena"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
              {contest?.title}
            </span>
            <div className="flex items-center gap-2">
              <select
                value={activeProblemId || ''}
                onChange={(e) => setActiveProblemId(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg text-xs font-bold text-white px-2.5 py-1 focus:ring-1 focus:ring-amber-500 outline-none"
              >
                {problemsList.map((p, idx) => (
                  <option key={p.problemId || p._id} value={p.problemId || p._id}>
                    P{p.order || idx + 1}: {p.title} ({p.points} pts)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Center: Live Contest Countdown */}
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${
          timeLeft.isEnded
            ? 'bg-gray-800 border-gray-700 text-gray-400'
            : isTimeCritical
            ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
            : 'bg-amber-950/50 border-amber-600/60 text-amber-300'
        }`}>
          <Clock className="w-4 h-4" />
          <span className="text-xs uppercase font-extrabold tracking-wider">
            {timeLeft.isEnded ? 'Contest Ended' : 'Time Remaining:'}
          </span>
          <span className="text-sm font-black font-mono">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Right: Score, Leaderboard Drawer, Fullscreen */}
        <div className="flex items-center gap-3">
          {needsRegistration && (
            <button
              onClick={handleRegisterInArena}
              disabled={isRegisteringInArena}
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-lg text-xs shadow-md cursor-pointer animate-pulse transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRegisteringInArena ? 'Registering...' : 'Register to Attempt'}</span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-2 bg-gray-800/80 border border-gray-700 px-3 py-1 rounded-xl text-xs">
            <span className="text-gray-400">Score:</span>
            <span className="font-black text-amber-400">{userScore.totalScore} Pts</span>
            {userScore.rank > 0 && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Rank:</span>
                <span className="font-bold text-amber-400">#{userScore.rank}</span>
              </>
            )}
          </div>

          <button
            onClick={() => {
              setIsLeaderboardOpen(true);
              fetchLeaderboard();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold border border-gray-700 cursor-pointer transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Split (Left Panel: Problem / Submissions, Right Panel: Code & Output) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Panel: 5 Columns */}
        <div className="lg:col-span-5 border-r border-gray-800 flex flex-col bg-gray-900/60 overflow-hidden">
          {/* Left Tabs */}
          <div className="flex items-center border-b border-gray-800 bg-gray-900 px-3 pt-2 gap-1">
            {[
              { id: 'statement', label: 'Problem', icon: FileText },
              { id: 'submissions', label: `My Submissions (${mySubmissions.length})`, icon: History },
              { id: 'rules', label: 'Rules', icon: Info },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLeftTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
                    leftTab === tab.id
                      ? 'bg-gray-800 text-amber-400 border-t-2 border-amber-500'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Left Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {/* Statement Tab */}
            {leftTab === 'statement' && (
              <div className="space-y-5">
                {needsRegistration ? (
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-amber-950/20 border border-amber-500/40 rounded-2xl p-6 text-center space-y-4 shadow-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-amber-500/20">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Contest Registration Required</h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        You must register for this contest to view problem statements, execute sample test cases, and submit official solutions.
                      </p>
                    </div>

                    {contest?.contestType === 'private' && (
                      <div className="max-w-xs mx-auto text-left space-y-1 pt-1">
                        <label className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Private Contest Access Code</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter access code..."
                          value={inArenaAccessCode}
                          onChange={(e) => setInArenaAccessCode(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs font-mono text-white outline-none focus:border-amber-500"
                        />
                      </div>
                    )}

                    <button
                      onClick={handleRegisterInArena}
                      disabled={isRegisteringInArena || (contest?.contestType === 'private' && !inArenaAccessCode.trim())}
                      className="px-6 py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 shadow-lg shadow-amber-500/25 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isRegisteringInArena ? 'Registering...' : 'Register to Attempt Contest'}</span>
                    </button>
                  </div>
                ) : loadingProblem ? (
                  <div className="py-12 text-center text-gray-500 text-xs">
                    Loading problem statement...
                  </div>
                ) : problemData ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-white">
                        {problemData.title}
                      </h2>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        problemData.difficulty === 'Easy'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : problemData.difficulty === 'Medium'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {problemData.difficulty}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                      {problemData.description}
                    </div>

                    {/* Sample Testcases / Examples */}
                    {problemData.sampleTestCases && problemData.sampleTestCases.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Examples
                        </h4>
                        {problemData.sampleTestCases.map((tc, idx) => (
                          <div key={idx} className="bg-gray-800/80 rounded-xl p-3.5 border border-gray-700/80 space-y-2 text-xs font-mono">
                            <span className="text-[11px] text-amber-400 font-bold font-sans block">
                              Example {idx + 1}:
                            </span>
                            <div>
                              <span className="text-gray-400 font-sans block text-[10px]">Input:</span>
                              <pre className="text-gray-200 bg-gray-900 p-2 rounded mt-0.5 overflow-x-auto">{tc.input}</pre>
                            </div>
                            <div>
                              <span className="text-gray-400 font-sans block text-[10px]">Expected Output:</span>
                              <pre className="text-gray-200 bg-gray-900 p-2 rounded mt-0.5 overflow-x-auto">{tc.output}</pre>
                            </div>
                            {tc.explaination && (
                              <p className="text-[11px] text-gray-400 font-sans pt-1">
                                <span className="font-bold">Explanation:</span> {tc.explaination}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData.constraints && problemData.constraints.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Constraints
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-xs text-gray-300 bg-gray-800 p-3 rounded-xl border border-gray-800">
                          {problemData.constraints.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Hints */}
                    {problemData.hints && problemData.hints.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Hints
                        </h4>
                        {problemData.hints.map((h, i) => (
                          <details key={i} className="bg-gray-800 rounded-xl p-3 border border-gray-800 text-xs">
                            <summary className="font-bold cursor-pointer text-amber-400">Hint {i + 1}</summary>
                            <p className="mt-2 text-gray-300">{h}</p>
                          </details>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-gray-500">Problem not found.</p>
                )}
              </div>
            )}

            {/* Submissions Tab */}
            {leftTab === 'submissions' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Submission History for this Contest
                </h3>
                {mySubmissions.length > 0 ? (
                  <div className="space-y-2">
                    {mySubmissions.map((sub) => (
                      <div
                        key={sub._id}
                        className="p-3 bg-gray-800 rounded-xl border border-gray-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-black ${
                              sub.verdict === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {sub.verdict}
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono">({sub.language})</span>
                          </div>
                          <span className="text-[10px] text-gray-500">
                            {new Date(sub.submittedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-amber-400">{sub.score} pts</span>
                          <span className="text-[10px] text-gray-500 block">{sub.runtime}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 py-6 text-center">
                    You haven't submitted any solutions in this contest yet.
                  </p>
                )}
              </div>
            )}

            {/* Rules Tab */}
            {leftTab === 'rules' && (
              <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                <h3 className="font-bold text-sm text-white">Contest Instructions</h3>
                <div className="p-3 bg-gray-800 rounded-xl border border-gray-800 space-y-2">
                  <p>• Accepted solutions receive full points assigned to the problem.</p>
                  <p>• Wrong submissions incur a penalty of +{contest?.scoringConfig?.wrongPenalty || 10} minutes.</p>
                  <p>• Tie-breaking rule: Leaderboard ranks by highest score, then lowest total penalty time.</p>
                  <p>• Solutions submitted after the deadline will be rejected.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor & Output (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col bg-gray-950 overflow-hidden">
          {/* Editor Controls Bar */}
          <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-4 py-2 text-xs">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg text-xs font-bold text-white px-2.5 py-1 focus:ring-1 focus:ring-amber-500 outline-none"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++ (GCC)</option>
                <option value="java">Java (OpenJDK)</option>
              </select>
            </div>

            {/* Editor Actions */}
            <div className="flex items-center gap-2">
              <select
                value={editorTheme}
                onChange={(e) => setEditorTheme(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg text-[11px] text-gray-300 px-2 py-1 outline-none"
              >
                <option value="dracula">Dracula</option>
                <option value="monokai">Monokai</option>
                <option value="tomorrow_night">Tomorrow Night</option>
              </select>

              <button
                onClick={handleResetCode}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg"
                title="Reset starter template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ace Code Editor */}
          <div className="flex-1 relative overflow-hidden min-h-[300px]">
            <AceEditor
              mode={language === 'cpp' ? 'c_cpp' : language}
              theme={editorTheme}
              value={code}
              onChange={handleCodeChange}
              name="contest-ace-editor"
              width="100%"
              height="100%"
              fontSize={14}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
          </div>

          {/* Bottom Panel: Testcases, Execution Output, and Action Buttons */}
          <div className="h-64 border-t border-gray-800 bg-gray-900 flex flex-col overflow-hidden">
            {/* Bottom Tabs & Actions */}
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2 bg-gray-900 text-xs">
              <div className="flex items-center gap-2">
                {[
                  { id: 'testcases', label: 'Test Cases' },
                  { id: 'runResult', label: 'Test Run Output' },
                  { id: 'submitResult', label: 'Submission Verdict' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setBottomTab(t.id)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      bottomTab === t.id
                        ? 'bg-gray-800 text-amber-400'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Execution Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunSample}
                  disabled={isRunning || isSubmitting}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 text-emerald-400 ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>

                <button
                  onClick={handleSubmitSolution}
                  disabled={isSubmitting || isRunning || timeLeft.isEnded}
                  className="px-5 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 shadow-md shadow-amber-500/20 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                  <span>{isSubmitting ? 'Judging...' : 'Submit Solution'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
              {bottomTab === 'testcases' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-400 font-sans">
                    <span className="font-bold">Input for testing:</span>
                    <span className="text-[11px]">Supports custom test input</span>
                  </div>
                  <textarea
                    rows={4}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom input here..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-gray-200 font-mono outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {bottomTab === 'runResult' && (
                <div>
                  {isRunning ? (
                    <div className="py-8 text-center text-gray-400">
                      <div className="animate-spin w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-2" />
                      <span>Executing code against sample cases...</span>
                    </div>
                  ) : runResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {runResult.isFullyPassed ? (
                          <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-md font-bold text-xs flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Sample Tests Passed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-rose-950 text-rose-400 border border-rose-800 rounded-md font-bold text-xs flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Sample Tests Failed
                          </span>
                        )}
                        <span className="text-gray-400 text-[11px]">Execution Time: {runResult.totalExecutionTime || 0}ms</span>
                      </div>

                      {runResult.results?.map((res, i) => (
                        <div key={i} className="bg-gray-950 p-2.5 rounded-lg border border-gray-800 space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-400">
                            <span>Case #{res.testcase || i + 1}</span>
                            <span className={res.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              {res.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 text-[10px]">Your Output:</span>
                            <pre className="text-gray-200">{res.actualOutput}</pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 py-6 text-center">Run code to see test results</p>
                  )}
                </div>
              )}

              {bottomTab === 'submitResult' && (
                <div>
                  {isSubmitting ? (
                    <div className="py-8 text-center text-gray-400">
                      <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-2" />
                      <span>Evaluating your solution with judge...</span>
                    </div>
                  ) : submissionResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-lg font-black text-sm flex items-center gap-1.5 ${
                          submissionResult.verdict === 'Accepted'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {submissionResult.verdict === 'Accepted' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {submissionResult.verdict}
                        </span>

                        <span className="text-xs text-gray-400 font-sans">
                          Points Earned: <b className="text-amber-400">+{submissionResult.scoreEarned}</b>
                        </span>
                        <span className="text-xs text-gray-400 font-sans">
                          Runtime: <b>{submissionResult.executionTime}ms</b>
                        </span>
                      </div>

                      {/* Score update badge */}
                      <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-between">
                        <span className="text-gray-400 font-sans">Your New Contest Score:</span>
                        <span className="font-extrabold text-amber-400 font-sans text-sm">
                          {submissionResult.totalScore} Points
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 py-6 text-center">Submit your solution for official evaluation</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Live Leaderboard Drawer */}
      <AnimatePresence>
        {isLeaderboardOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg bg-gray-900 border-l border-gray-800 h-full flex flex-col p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="font-extrabold text-base text-white">Contest Leaderboard</h3>
                </div>
                <button
                  onClick={() => setIsLeaderboardOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Leaderboard Table */}
              <div className="flex-1 overflow-y-auto divide-y divide-gray-800">
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((item, idx) => (
                    <div key={item._id || idx} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black ${
                          item.rank === 1 ? 'bg-amber-500 text-black' :
                          item.rank === 2 ? 'bg-slate-300 text-black' :
                          item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-400'
                        }`}>
                          {item.rank}
                        </span>
                        <div>
                          <span className="font-bold text-white block">
                            {item.user?.name || 'Anonymous'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {item.problemsSolved} solved • {item.penaltyTime}m penalty
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-amber-400 text-sm">
                        {item.totalScore} pts
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-gray-500 py-8">
                    No participants on leaderboard yet.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
