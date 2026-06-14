import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Spinner,
  useColorModeValue,
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
} from "lucide-react";

/* ─────────────────────────────────────────────
   Helper utilities
───────────────────────────────────────────── */
const fmt = (v, unit = "") => (v != null ? `${v}${unit}` : "—");

const computeStats = (output) => {
  if (!output) return {};
  const { passedTestCases = 0, failedTestCases = 0, totalTestCases = 0, totalExecutionTime = 0, testResults = [], code = "" } = output;
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
    <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: colorMap[color] }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}

// ── Summary card
function StatCard({ icon, label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07 }}
      className="flex flex-col gap-1 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-gray-400 dark:text-gray-500">{icon}</div>
      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </motion.div>
  );
}

// ── Expandable test case row
function TestCaseRow({ test, index }) {
  const [open, setOpen] = useState(false);
  const passed = test.isPassed;
  const hasError = !!test.error;

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-lg border overflow-hidden ${
        passed
          ? "border-gray-200 dark:border-gray-700"
          : "border-red-200 dark:border-red-800/50"
      }`}
    >
      {/* Collapsed header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
          passed
            ? "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750"
            : "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
        }`}
      >
        <div className="flex items-center gap-2">
          {passed ? (
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          ) : (
            <XCircleIcon className="h-4 w-4 text-red-500" />
          )}
          <span className="text-gray-800 dark:text-gray-200">Test Case #{index + 1}</span>
          {hasError && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded">
              Error
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          {test.executionTime != null && (
            <span className="text-xs">{test.executionTime}ms</span>
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
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 space-y-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
              {hasError ? (
                <div>
                  <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Runtime Error</div>
                  <pre className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded font-mono whitespace-pre-wrap">
                    {test.error}
                  </pre>
                </div>
              ) : (
                <>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Input</div>
                    <pre className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2.5 rounded font-mono whitespace-pre-wrap border border-gray-200 dark:border-gray-700">
                      {typeof test.input === "object" ? JSON.stringify(test.input, null, 2) : test.input}
                    </pre>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Expected</div>
                      <pre className="text-xs bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-2.5 rounded font-mono whitespace-pre-wrap border border-green-200 dark:border-green-800/50">
                        {typeof test.output === "object" ? JSON.stringify(test.output, null, 2) : test.output}
                      </pre>
                    </div>
                    <div>
                      <div className={`text-xs font-semibold mb-1 ${passed ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                        Actual
                      </div>
                      <pre className={`text-xs p-2.5 rounded font-mono whitespace-pre-wrap border ${
                        passed
                          ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800/50"
                          : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800/50"
                      }`}>
                        {typeof test.actualOutput === "object"
                          ? JSON.stringify(test.actualOutput, null, 2)
                          : test.actualOutput || "No output"}
                      </pre>
                    </div>
                  </div>
                  {test.executionTime != null && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <ClockIcon className="h-3.5 w-3.5" />
                      Execution time: {test.executionTime}ms
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
   Main Modal
───────────────────────────────────────────── */
function SubmissionReportModal({ isOpen, onClose, output, loading, onSubmitAgain }) {
  const status = statusMeta(output);
  const stats = computeStats(output);
  const hasError = !!(output?.error || output?.testResults?.some((t) => t.error));
  const firstError = output?.error || output?.testResults?.find((t) => t.error)?.error;

  const colorMap = { green: "#22c55e", red: "#ef4444", yellow: "#f59e0b", gray: "#6b7280" };
  const statusColor = colorMap[status.color];

  const accentClass = "text-amber-600 dark:text-indigo-400";
  const accentBg = "bg-amber-500 dark:bg-indigo-600";
  const accentBorder = "border-amber-500 dark:border-indigo-500";

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "full", md: "2xl" }}
      motionPreset="slideInBottom"
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(8px)" />
      <ModalContent
        bg="white"
        _dark={{ bg: "gray.900" }}
        borderRadius={{ base: 0, md: "xl" }}
        boxShadow="2xl"
        minH={{ base: "100vh", md: "auto" }}
        maxH={{ base: "100vh", md: "90vh" }}
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
        _dark2={{ borderColor: "gray.700" }}
      >
        {/* ── Sticky header */}
        <ModalHeader
          position="sticky"
          top={0}
          zIndex={10}
          bg="white"
          className="dark:bg-gray-900"
          borderBottomWidth="1px"
          borderColor="gray.100"
          _dark={{ borderColor: "gray.800" }}
          py={4}
          px={5}
        >
          <div className="flex items-start gap-4">
            {/* Status icon */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: `${statusColor}18`, border: `2px solid ${statusColor}` }}
            >
              {loading ? (
                <Spinner size="sm" color={status.color === "green" ? "green.500" : "red.500"} />
              ) : status.icon === "pass" ? (
                <CheckCircleIcon className="h-5 w-5" style={{ color: statusColor }} />
              ) : status.icon === "error" ? (
                <ZapIcon className="h-5 w-5" style={{ color: statusColor }} />
              ) : status.icon === "fail" ? (
                <XCircleIcon className="h-5 w-5" style={{ color: statusColor }} />
              ) : null}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-gray-900 dark:text-white">{status.label}</span>
                {output?.language && (
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-mono">
                    {output.language}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {output?.submissionId && <span>ID: {output.submissionId}</span>}
                {output?.totalExecutionTime != null && <span>{output.totalExecutionTime}ms total</span>}
                {output?.totalTestCases != null && (
                  <span>{output.passedTestCases}/{output.totalTestCases} passed</span>
                )}
              </div>
            </div>
          </div>
        </ModalHeader>

        <ModalCloseButton top={4} right={4} _hover={{ bg: "gray.100" }} _dark={{ _hover: { bg: "gray.800" } }} />

        {/* ── Body */}
        <ModalBody py={5} px={5} className="space-y-6">
          {loading ? (
            /* Skeleton loading */
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="relative w-16 h-16">
                <Spinner size="xl" color="blue.400" thickness="3px" speed="0.7s" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Evaluating solution…</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Running all test cases</p>
              </div>
              {/* Skeleton cards */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                ))}
              </div>
            </div>
          ) : output ? (
            <div className="space-y-6">
              {/* ── Error panel */}
              {hasError && firstError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/50 bg-yellow-50 dark:bg-yellow-900/15"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ZapIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                      {status.label}
                    </span>
                  </div>
                  <pre className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 p-3 rounded font-mono whitespace-pre-wrap overflow-x-auto">
                    {firstError}
                  </pre>
                </motion.div>
              )}

              {/* ── Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  index={0}
                  icon={<CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  label="Passed"
                  value={fmt(output.passedTestCases)}
                />
                <StatCard
                  index={1}
                  icon={<XCircleIcon className="h-5 w-5 text-red-400" />}
                  label="Failed"
                  value={fmt(output.failedTestCases ?? (output.totalTestCases - output.passedTestCases))}
                />
                <StatCard
                  index={2}
                  icon={<ClockIcon className="h-5 w-5 text-amber-500 dark:text-indigo-400" />}
                  label="Execution"
                  value={output.totalExecutionTime != null ? `${output.totalExecutionTime}ms` : "—"}
                />
                <StatCard
                  index={3}
                  icon={<TrendingUpIcon className="h-5 w-5 text-blue-400" />}
                  label="Success Rate"
                  value={`${stats.successRate}%`}
                />
              </div>

              {/* ── Progress bar */}
              {!hasError && output.totalTestCases > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="space-y-2">
                  <ProgressBar
                    value={stats.successRate}
                    color={output.isFullyPassed ? "green" : "red"}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {output.passedTestCases} of {output.totalTestCases} test cases passed
                  </p>
                </motion.div>
              )}

              {/* ── Performance metrics */}
              {!hasError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
                    Performance
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-sm">
                    {[
                      { icon: <CpuIcon className="h-4 w-4" />, label: "Language", value: output.language || "—" },
                      { icon: <ClockIcon className="h-4 w-4" />, label: "Total Time", value: fmt(output.totalExecutionTime, "ms") },
                      { icon: <ZapIcon className="h-4 w-4" />, label: "Avg / Test", value: stats.avgExecution ? `${stats.avgExecution}ms` : "—" },
                      { icon: <TrendingUpIcon className="h-4 w-4" />, label: "Fastest", value: stats.fastestTest != null ? `${stats.fastestTest}ms` : "—" },
                      { icon: <ClockIcon className="h-4 w-4" />, label: "Slowest", value: stats.slowestTest != null ? `${stats.slowestTest}ms` : "—" },
                      { icon: <HashIcon className="h-4 w-4" />, label: "Total Tests", value: fmt(output.totalTestCases) },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="flex items-start gap-2">
                        <span className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0">{icon}</span>
                        <div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">{label}</div>
                          <div className="font-medium text-gray-800 dark:text-gray-200">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Test case accordion */}
              {output.testResults && output.testResults.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
                    Test Cases
                  </h3>
                  <div className="space-y-2">
                    {output.testResults.map((test, i) => (
                      <TestCaseRow key={i} test={test} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Code info */}
              {(output.submissionId || output.codeId || output.code) && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5">
                    <CodeIcon className="h-3.5 w-3.5" /> Code Info
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {output.submissionId && (
                      <>
                        <span className="text-gray-500 dark:text-gray-400">Submission ID</span>
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate">{output.submissionId}</span>
                      </>
                    )}
                    {output.codeId && (
                      <>
                        <span className="text-gray-500 dark:text-gray-400">Code ID</span>
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate">{output.codeId}</span>
                      </>
                    )}
                    {output.language && (
                      <>
                        <span className="text-gray-500 dark:text-gray-400">Language</span>
                        <span className="text-gray-700 dark:text-gray-300">{output.language}</span>
                      </>
                    )}
                    {output.code && (
                      <>
                        <span className="text-gray-500 dark:text-gray-400">Lines</span>
                        <span className="text-gray-700 dark:text-gray-300">{stats.linesOfCode}</span>
                        <span className="text-gray-500 dark:text-gray-400">Characters</span>
                        <span className="text-gray-700 dark:text-gray-300">{stats.characterCount}</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 gap-3">
              <Spinner size="lg" color="blue.400" />
              <p className="text-sm">Waiting for evaluation…</p>
            </div>
          )}
        </ModalBody>

        {/* ── Sticky footer */}
        <ModalFooter
          position="sticky"
          bottom={0}
          zIndex={10}
          bg="white"
          className="dark:bg-gray-900"
          borderTopWidth="1px"
          borderColor="gray.100"
          _dark={{ borderColor: "gray.800" }}
          py={3}
          px={5}
          gap={3}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
          >
            <CodeIcon className="h-4 w-4" />
            View Code
          </button>
          <button
            onClick={() => { onClose(); onSubmitAgain?.(); }}
            className="px-4 py-2 text-sm rounded-lg bg-amber-500 dark:bg-indigo-600 hover:bg-amber-600 dark:hover:bg-indigo-700 text-white transition-colors ml-auto"
          >
            Submit Again
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SubmissionReportModal;
