import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CpuIcon,
  ZapIcon,
  TrendingUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CodeIcon,
  HashIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Helper utilities
───────────────────────────────────────────── */
const fmt = (v, unit = "") => (v != null ? `${v}${unit}` : "—");

const computeStats = (output) => {
  if (!output) return {};
  const {
    passedTestCases = 0,
    failedTestCases = 0,
    totalTestCases = 0,
    totalExecutionTime = 0,
    testResults = [],
    code = "",
  } = output;
  const times = testResults.map((t) => t.executionTime).filter(Boolean);
  return {
    successRate: totalTestCases ? Math.round((passedTestCases / totalTestCases) * 100) : 0,
    avgExecution: totalTestCases && totalExecutionTime ? Math.round(totalExecutionTime / totalTestCases) : 0,
    fastestTest: times.length ? Math.min(...times) : null,
    slowestTest: times.length ? Math.max(...times) : null,
    linesOfCode: code ? code.split("\n").length : 0,
    characterCount: code ? code.length : 0,
  };
};

const statusMeta = (output) => {
  if (!output) return { label: "Evaluating…", color: "gray", icon: null };
  if (output.error) {
    const isRuntime = /runtime|traceback|error/i.test(output.error);
    return { label: isRuntime ? "Runtime Error" : "Compilation Error", color: "yellow", icon: "error" };
  }
  if (output.isFullyPassed) return { label: "Accepted", color: "green", icon: "pass" };
  return { label: "Wrong Answer", color: "red", icon: "fail" };
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

// ── Animated horizontal progress bar
function ProgressBar({ value, color = "green" }) {
  const colorMap = { green: "#22c55e", red: "#ef4444", yellow: "#f59e0b", gray: "#9ca3af" };
  return (
    <div className="w-full h-2.5 sm:h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: colorMap[color] }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

// ── Summary stat card
function StatCard({ icon, label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.05 }}
      className="flex flex-col gap-1 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 shadow-sm"
    >
      <div className="text-gray-400 dark:text-gray-500">{icon}</div>
      <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{label}</div>
    </motion.div>
  );
}

// ── Expandable test case row
function TestCaseRow({ test, index }) {
  const [open, setOpen] = useState(index === 0 && !test.isPassed); // Auto-open first failed test
  const [copied, setCopied] = useState(false);
  const passed = test.isPassed;
  const hasError = !!test.error;

  const handleCopyInput = (e) => {
    e.stopPropagation();
    const val = typeof test.input === "object" ? JSON.stringify(test.input, null, 2) : String(test.input);
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`rounded-xl border overflow-hidden transition-colors ${
        passed
          ? "border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800/60"
          : "border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20"
      }`}
    >
      {/* Collapsed header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm font-medium transition-colors ${
          passed
            ? "hover:bg-gray-50 dark:hover:bg-gray-750"
            : "hover:bg-red-100/40 dark:hover:bg-red-900/30"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {passed ? (
            <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
          ) : (
            <XCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
          )}
          <span className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 truncate">
            Test Case #{index + 1}
          </span>
          <span
            className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
              passed
                ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
            }`}
          >
            {passed ? "Passed" : "Failed"}
          </span>
          {hasError && (
            <span className="text-[10px] sm:text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded font-medium">
              Error
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-gray-500 dark:text-gray-400 flex-shrink-0">
          {test.executionTime != null && (
            <span className="text-xs font-mono">{test.executionTime}ms</span>
          )}
          {open ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 sm:px-4 py-3 space-y-3 bg-white dark:bg-gray-900/90 border-t border-gray-100 dark:border-gray-700/80">
              {hasError ? (
                <div>
                  <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                    Runtime / Compilation Error
                  </div>
                  <pre className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg font-mono whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                    {test.error}
                  </pre>
                </div>
              ) : (
                <>
                  {/* Input */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      <span>Input</span>
                      <button
                        type="button"
                        onClick={handleCopyInput}
                        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {copied ? <CheckIcon className="h-3 w-3 text-green-500" /> : <CopyIcon className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2.5 rounded-lg font-mono whitespace-pre-wrap break-words border border-gray-200 dark:border-gray-700 max-h-36 overflow-y-auto overflow-x-auto">
                      {typeof test.input === "object" ? JSON.stringify(test.input, null, 2) : test.input}
                    </pre>
                  </div>

                  {/* Expected vs Actual Outputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                        <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" /> Expected Output
                      </div>
                      <pre className="text-xs bg-green-50/70 dark:bg-green-950/20 text-green-800 dark:text-green-200 p-2.5 rounded-lg font-mono whitespace-pre-wrap break-words border border-green-200 dark:border-green-800/60 max-h-36 overflow-y-auto overflow-x-auto">
                        {typeof test.output === "object" ? JSON.stringify(test.output, null, 2) : test.output}
                      </pre>
                    </div>
                    <div>
                      <div
                        className={`text-xs font-semibold mb-1 flex items-center gap-1 ${
                          passed ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                        }`}
                      >
                        {passed ? (
                          <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-3.5 w-3.5 text-red-500" />
                        )}
                        Your Output
                      </div>
                      <pre
                        className={`text-xs p-2.5 rounded-lg font-mono whitespace-pre-wrap break-words border max-h-36 overflow-y-auto overflow-x-auto ${
                          passed
                            ? "bg-green-50/70 dark:bg-green-950/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800/60"
                            : "bg-red-50/70 dark:bg-red-950/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800/60"
                        }`}
                      >
                        {typeof test.actualOutput === "object"
                          ? JSON.stringify(test.actualOutput, null, 2)
                          : test.actualOutput || "No output"}
                      </pre>
                    </div>
                  </div>

                  {test.executionTime != null && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 pt-1">
                      <ClockIcon className="h-3.5 w-3.5" />
                      <span>Execution time: {test.executionTime}ms</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Modal Component
───────────────────────────────────────────── */
function SubmissionReportModal({ isOpen, onClose, output, loading, onSubmitAgain }) {
  const status = statusMeta(output);
  const stats = computeStats(output);
  const hasError = !!(output?.error || output?.testResults?.some((t) => t.error));
  const firstError = output?.error || output?.testResults?.find((t) => t.error)?.error;

  const colorMap = { green: "#22c55e", red: "#ef4444", yellow: "#f59e0b", gray: "#6b7280" };
  const statusColor = colorMap[status.color];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <ModalContent className="max-w-4xl mx-2 sm:mx-4 w-full">
        {/* ── Sticky header */}
        <ModalHeader className="relative">
          <div className="flex items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-3 min-w-0">
              {/* Status icon */}
              <div
                className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xs"
                style={{ background: `${statusColor}18`, border: `2px solid ${statusColor}` }}
              >
                {loading ? (
                  <Spinner size="sm" color={status.color === "green" ? "green.500" : "red.500"} />
                ) : status.icon === "pass" ? (
                  <CheckCircleIcon className="h-5 w-5" style={{ color: statusColor }} />
                ) : status.icon === "error" ? (
                  <ZapIcon className="h-5 w-5" style={{ color: statusColor }} />
                ) : (
                  <XCircleIcon className="h-5 w-5" style={{ color: statusColor }} />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                    {loading ? "Evaluating Submission..." : status.label}
                  </h2>
                  {output?.language && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono font-medium">
                      {output.language}
                    </span>
                  )}
                </div>
                {!loading && output && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {output.totalTestCases != null && (
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {output.passedTestCases || 0}/{output.totalTestCases} Test Cases Passed
                      </span>
                    )}
                    {output.totalExecutionTime != null && <span>• {output.totalExecutionTime}ms Total</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>

        {/* ── Scrollable Body */}
        <ModalBody className="space-y-5">
          {loading ? (
            /* Loading Spinner & Skeleton */
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 gap-4">
              <Spinner size="xl" className="text-amber-500" />
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Evaluating your solution…</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Executing across all test cases</p>
              </div>
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-18 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                ))}
              </div>
            </div>
          ) : output ? (
            <div className="space-y-5">
              {/* ── Error panel */}
              {hasError && firstError && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 sm:p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/60 bg-yellow-50/70 dark:bg-yellow-950/20"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <ZapIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                      {status.label}
                    </span>
                  </div>
                  <pre className="text-xs bg-yellow-100/70 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-200 p-3 rounded-lg font-mono whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                    {firstError}
                  </pre>
                </motion.div>
              )}

              {/* ── Summary Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <StatCard
                  index={0}
                  icon={<CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />}
                  label="Passed"
                  value={`${output.passedTestCases || 0} / ${output.totalTestCases || 0}`}
                />
                <StatCard
                  index={1}
                  icon={<XCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />}
                  label="Failed"
                  value={String(output.failedTestCases ?? Math.max(0, (output.totalTestCases || 0) - (output.passedTestCases || 0)))}
                />
                <StatCard
                  index={2}
                  icon={<ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />}
                  label="Execution Time"
                  value={output.totalExecutionTime != null ? `${output.totalExecutionTime}ms` : "—"}
                />
                <StatCard
                  index={3}
                  icon={<TrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
                  label="Success Rate"
                  value={`${stats.successRate}%`}
                />
              </div>

              {/* ── Progress bar */}
              {!hasError && output.totalTestCases > 0 && (
                <div className="space-y-1.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                    <span>Test Case Completion</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.successRate}%</span>
                  </div>
                  <ProgressBar value={stats.successRate} color={output.isFullyPassed ? "green" : "red"} />
                </div>
              )}

              {/* ── Performance metrics */}
              {!hasError && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 p-3.5 sm:p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Performance Details
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs sm:text-sm">
                    {[
                      { icon: <CpuIcon className="h-4 w-4" />, label: "Language", value: output.language || "—" },
                      { icon: <ClockIcon className="h-4 w-4" />, label: "Total Runtime", value: fmt(output.totalExecutionTime, "ms") },
                      { icon: <ZapIcon className="h-4 w-4" />, label: "Avg / Test", value: stats.avgExecution ? `${stats.avgExecution}ms` : "—" },
                      { icon: <TrendingUpIcon className="h-4 w-4" />, label: "Fastest Case", value: stats.fastestTest != null ? `${stats.fastestTest}ms` : "—" },
                      { icon: <ClockIcon className="h-4 w-4" />, label: "Slowest Case", value: stats.slowestTest != null ? `${stats.slowestTest}ms` : "—" },
                      { icon: <HashIcon className="h-4 w-4" />, label: "Total Tests", value: fmt(output.totalTestCases) },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="flex items-start gap-2 min-w-0">
                        <span className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0">{icon}</span>
                        <div className="min-w-0">
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{label}</div>
                          <div className="font-semibold text-gray-800 dark:text-gray-200 truncate">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Test case breakdown */}
              {output.testResults && output.testResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
                    Detailed Test Cases ({output.testResults.length})
                  </h3>
                  <div className="space-y-2">
                    {output.testResults.map((test, i) => (
                      <TestCaseRow key={i} test={test} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Code metadata */}
              {(output.submissionId || output.code) && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 p-3.5 sm:p-4 text-xs">
                  <h3 className="font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5 flex items-center gap-1.5">
                    <CodeIcon className="h-3.5 w-3.5" /> Submission Meta
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {output.submissionId && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Submission ID</span>
                        <span className="font-mono text-gray-800 dark:text-gray-200 truncate block">{output.submissionId}</span>
                      </div>
                    )}
                    {stats.linesOfCode > 0 && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Source Lines</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{stats.linesOfCode} lines</span>
                      </div>
                    )}
                    {stats.characterCount > 0 && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Source Size</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{stats.characterCount} chars</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500 gap-3">
              <Spinner size="lg" className="text-amber-500" />
              <p className="text-sm">Awaiting evaluation response…</p>
            </div>
          )}
        </ModalBody>

        {/* ── Sticky Footer */}
        <ModalFooter>
          <div className="w-full flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-center"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSubmitAgain?.();
              }}
              className="w-full sm:w-auto px-5 py-2 text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer text-center shadow-xs"
            >
              Edit & Try Again
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SubmissionReportModal;
