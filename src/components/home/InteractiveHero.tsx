'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2,
  Terminal,
  Trophy,
  Sparkles,
  Play,
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
  RotateCcw,
  Binary,
  Cpu,
  Layers,
  GitBranch,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CodeSnippet {
  lang: string;
  filename: string;
  code: string[];
  output: {
    status: string;
    runtime: string;
    memory: string;
    cases: string;
  };
}

const SNIPPETS: Record<string, CodeSnippet> = {
  cpp: {
    lang: 'C++',
    filename: 'TwoSum.cpp',
    code: [
      '#include <vector>',
      '#include <unordered_map>',
      '',
      'std::vector<int> twoSum(std::vector<int>& nums, int target) {',
      '    std::unordered_map<int, int> seen;',
      '    for (int i = 0; i < nums.size(); ++i) {',
      '        int comp = target - nums[i];',
      '        if (seen.count(comp)) return {seen[comp], i};',
      '        seen[nums[i]] = i;',
      '    }',
      '    return {};',
      '}',
    ],
    output: {
      status: 'Accepted',
      runtime: '0 ms (Beats 100%)',
      memory: '14.1 MB',
      cases: '3/3 Passed',
    },
  },
  python: {
    lang: 'Python',
    filename: 'two_sum.py',
    code: [
      'def two_sum(nums: list[int], target: int) -> list[int]:',
      '    seen = {}',
      '    for idx, num in enumerate(nums):',
      '        diff = target - num',
      '        if diff in seen:',
      '            return [seen[diff], idx]',
      '        seen[num] = idx',
      '    return []',
      '',
      '# Verified with 10k random test cases',
    ],
    output: {
      status: 'Accepted',
      runtime: '28 ms (Beats 98.7%)',
      memory: '17.4 MB',
      cases: '3/3 Passed',
    },
  },
  javascript: {
    lang: 'JavaScript',
    filename: 'twoSum.js',
    code: [
      'function twoSum(nums, target) {',
      '  const map = new Map();',
      '  for (let i = 0; i < nums.length; i++) {',
      '    const comp = target - nums[i];',
      '    if (map.has(comp)) return [map.get(comp), i];',
      '    map.set(nums[i], i);',
      '  }',
      '  return [];',
      '}',
    ],
    output: {
      status: 'Accepted',
      runtime: '3 ms (Beats 99.2%)',
      memory: '44.8 MB',
      cases: '3/3 Passed',
    },
  },
};

// Running background code streams
const CODE_COLUMNS = [
  [
    'const solve = async (graph, start) => {',
    '  const dist = new Map();',
    '  const pq = new MinPriorityQueue();',
    '  pq.enqueue(start, 0);',
    '  while (!pq.isEmpty()) {',
    '    const { element: u, priority: d } = pq.dequeue();',
    '    if (d > (dist.get(u) ?? Infinity)) continue;',
    '    for (const [v, w] of graph[u]) {',
    '      if (d + w < (dist.get(v) ?? Infinity)) {',
    '        dist.set(v, d + w);',
    '        pq.enqueue(v, d + w);',
    '      }',
    '    }',
    '  }',
    '  return dist;',
    '};',
    '// Time: O((V + E) log V) | Dijkstra algorithm',
    'export default solve;',
  ],
  [
    'template <typename T>',
    'class SegmentTree {',
    '    vector<T> tree;',
    '    int n;',
    'public:',
    '    SegmentTree(int n) : n(n), tree(4 * n, 0) {}',
    '    void update(int node, int l, int r, int idx, T val) {',
    '        if (l == r) { tree[node] = val; return; }',
    '        int mid = (l + r) / 2;',
    '        if (idx <= mid) update(2*node, l, mid, idx, val);',
    '        else update(2*node+1, mid+1, r, idx, val);',
    '        tree[node] = tree[2*node] + tree[2*node+1];',
    '    }',
    '    T query(int node, int l, int r, int ql, int qr) {',
    '        if (ql <= l && r <= qr) return tree[node];',
    '        if (r < ql || l > qr) return 0;',
    '        int mid = (l + r) / 2;',
    '        return query(2*node, l, mid, ql, qr) + query(2*node+1, mid+1, r, ql, qr);',
    '    }',
    '};',
  ],
  [
    'def longest_palindromic_subseq(s: str) -> int:',
    '    n = len(s)',
    '    dp = [[0] * n for _ in range(n)]',
    '    for i in range(n - 1, -1, -1):',
    '        dp[i][i] = 1',
    '        for j in range(i + 1, n):',
    '            if s[i] == s[j]:',
    '                dp[i][j] = dp[i + 1][j - 1] + 2',
    '            else:',
    '                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])',
    '    return dp[0][n - 1]',
    '# Dynamic Programming Table: O(N^2) space optimized',
    'assert longest_palindromic_subseq("bbbab") == 4',
  ],
  [
    '// LRU Cache with Doubly Linked List & Hash Map',
    'struct Node {',
    '    int key, val;',
    '    Node *prev, *next;',
    '    Node(int k, int v): key(k), val(v), prev(nullptr), next(nullptr) {}',
    '};',
    'class LRUCache {',
    '    unordered_map<int, Node*> cache;',
    '    Node *head, *tail;',
    '    int cap;',
    'public:',
    '    LRUCache(int capacity): cap(capacity) {',
    '        head = new Node(-1, -1);',
    '        tail = new Node(-1, -1);',
    '        head->next = tail; tail->prev = head;',
    '    }',
    '    int get(int key) {',
    '        if (!cache.count(key)) return -1;',
    '        moveToHead(cache[key]);',
    '        return cache[key]->val;',
    '    }',
    '};',
  ],
  [
    'export async function executeSandbox(code: string, lang: string) {',
    '  const container = await docker.createContainer({',
    '    Image: `coderhaveli-judge-${lang}:latest`,',
    '    Cmd: ["run", "/app/solution"],',
    '    Tty: false,',
    '    HostConfig: { Memory: 128 * 1024 * 1024, CpuQuota: 50000 }',
    '  });',
    '  await container.start();',
    '  const logs = await container.logs({ stdout: true, stderr: true });',
    '  return { status: "ACCEPTED", timeMs: 12, memoryMb: 14 };',
    '}',
  ],
];

// Floating Tech Pill Badges
const FLOATING_PILLS = [
  { text: 'O(1) Hash Map', icon: Cpu, x: '8%', y: '12%', delay: 0 },
  { text: 'Dynamic Programming', icon: Layers, x: '82%', y: '16%', delay: 1.5 },
  { text: 'Binary Tree Traversal', icon: GitBranch, x: '4%', y: '78%', delay: 0.8 },
  { text: '0ms Fast Judge', icon: Zap, x: '84%', y: '82%', delay: 2.2 },
  { text: 'Bit Manipulation', icon: Binary, x: '46%', y: '6%', delay: 1.0 },
];

export default function InteractiveHero() {
  const [selectedLang, setSelectedLang] = useState<'cpp' | 'python' | 'javascript'>('cpp');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleRunCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setHasRun(false);

    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
        });
      } catch (err) {
        // fallback silently
      }
    }, 800);
  };

  const activeSnippet = SNIPPETS[selectedLang];

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* =========================================================================
          BACKGROUND: Running Code Streams & Floating Tech Pills
         ========================================================================= */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      >
        {/* Subtle Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Ambient Glowing Color Orbs */}
        <div className="absolute -top-20 left-1/4 w-[450px] h-[450px] bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-yellow-500/10 dark:bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl" />

        {/* Vertical Running Code Columns */}
        <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 px-4 opacity-[0.14] dark:opacity-[0.22] font-mono text-[11px] leading-relaxed text-amber-950 dark:text-amber-200">
          {CODE_COLUMNS.map((column, colIdx) => (
            <motion.div
              key={colIdx}
              initial={{ y: 0 }}
              animate={{ y: colIdx % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
              transition={{
                duration: 35 + colIdx * 8,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="space-y-3 whitespace-pre"
            >
              {/* Duplicate array for seamless infinite vertical scroll */}
              {[...column, ...column, ...column].map((line, lineIdx) => (
                <div
                  key={lineIdx}
                  className={
                    line.startsWith('//') || line.startsWith('#')
                      ? 'text-gray-400 dark:text-gray-500'
                      : line.includes('solve') || line.includes('class') || line.includes('def')
                      ? 'text-amber-600 dark:text-amber-400 font-semibold'
                      : line.includes('return') || line.includes('while') || line.includes('for')
                      ? 'text-yellow-600 dark:text-yellow-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }
                >
                  {line}
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Floating Developer / Algorithm Pills */}
        {FLOATING_PILLS.map((pill, idx) => {
          const Icon = pill.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6 + idx,
                repeat: Infinity,
                delay: pill.delay,
                ease: 'easeInOut',
              }}
              style={{ left: pill.x, top: pill.y }}
              className="absolute hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-800/80 backdrop-blur shadow-sm pointer-events-none"
            >
              <Icon className="w-3.5 h-3.5 text-amber-500" />
              <span>{pill.text}</span>
            </motion.div>
          );
        })}
      </div>

      {/* =========================================================================
          FOREGROUND: Headline & Stable Interactive IDE Card
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headline & CTA */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span>Interactive Algorithmic Learning & Contests</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]"
          >
            Code, Compete &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500">
              Level Up
            </span>{' '}
            Your Engineering Skills.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            From Data Structures & Algorithms to System Design and Live Coding Contests.
            Practice with an integrated browser judge and track your progress to mastery.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Code2 className="w-5 h-5" />
              <span>Start Practicing</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              href="/contests"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900/80 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-800 shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Join Contests</span>
            </Link>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800/80 max-w-lg mx-auto lg:mx-0"
          >
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">500+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Curated Problems</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-amber-500">Weekly</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Live Sprints</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">0ms</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Cloud Judge</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: STABLE (No Tilt) Interactive Code Terminal Card */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-amber-500/10 text-slate-100 overflow-hidden select-none hover:border-amber-500/40 transition-colors duration-300"
          >
            {/* Top Badge */}
            <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold backdrop-blur">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Interactive Sandbox</span>
            </div>

            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  {activeSnippet.filename}
                </span>
              </div>

              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 mr-0 sm:mr-32">
                {(['cpp', 'python', 'javascript'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setHasRun(false);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                      selectedLang === lang
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {SNIPPETS[lang].lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[220px] bg-slate-900/95">
              {activeSnippet.code.map((line, i) => (
                <div key={i} className="flex items-start">
                  <span className="w-7 text-right pr-3 select-none text-slate-600 text-xs">
                    {i + 1}
                  </span>
                  <span
                    className={
                      line.startsWith('#') || line.startsWith('//')
                        ? 'text-slate-500 italic'
                        : line.includes('function') || line.includes('return') || line.includes('for')
                        ? 'text-amber-400'
                        : line.includes('int') || line.includes('def') || line.includes('const')
                        ? 'text-blue-400'
                        : line.includes('twoSum') || line.includes('two_sum')
                        ? 'text-emerald-400 font-semibold'
                        : 'text-slate-200'
                    }
                  >
                    {line || ' '}
                  </span>
                </div>
              ))}
            </div>

            {/* Execution / Output Section */}
            <div className="p-3 bg-slate-950/95 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Judge Environment
                </span>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-sm transition-all duration-150 disabled:opacity-60 cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Testcases</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output Preview */}
              <div className="rounded-lg bg-slate-900 border border-slate-800/80 p-2.5 font-mono text-xs">
                {isRunning ? (
                  <div className="flex items-center gap-2 text-amber-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Running against hidden test cases...</span>
                  </div>
                ) : hasRun ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {activeSnippet.output.status}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {activeSnippet.output.cases}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 text-[11px]">
                      <span>
                        Runtime: <strong className="text-white">{activeSnippet.output.runtime}</strong>
                      </span>
                      <span>
                        Memory: <strong className="text-white">{activeSnippet.output.memory}</strong>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 flex items-center justify-between">
                    <span>Click &quot;Run Testcases&quot; to test this solution.</span>
                    <span className="text-slate-600 text-[10px]">Ready</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
