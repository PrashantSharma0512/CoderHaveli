import React, { useEffect, useState, useRef } from "react";
import AceEditor from "react-ace";
import { CgFormatLeft } from "react-icons/cg";
import { LuFullscreen } from "react-icons/lu";
import { GrFormEdit } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { GrTest } from "react-icons/gr";
import { HiOutlineCode } from "react-icons/hi";
import { FiSave } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Code,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../helper/axiosInstance";
import { CheckCircleIcon, PlayIcon, XCircleIcon, ClockIcon, CpuIcon } from "lucide-react";
import { MdCelebration as CelebrationIcon } from 'react-icons/md';
import Confetti from "react-confetti";
import SubmissionReportModal from "./SubmissionModal";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={4} bg="red.50" border="1px" borderColor="red.200" borderRadius="md">
          <Text color="red.600">Something went wrong with the editor. Please try refreshing the page.</Text>
        </Box>
      );
    }
    return this.props.children;
  }
}

// Theme imports
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-clouds";

// Language modes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-rust";

import "ace-builds/src-noconflict/worker-javascript";
// autocomplete
import "ace-builds/src-noconflict/ext-language_tools";

// 🔥 WORKER FIX FOR VITE
ace.config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.32.3/src-noconflict/"
);

ace.config.set(
  "workerPath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.32.3/src-noconflict/"
);

function Compiler({ testcase, quesId }) {
  // Language options
  const options = [
    { name: "JavaScript", value: "javascript" },
    { name: "Python", value: "python" },
    { name: "C++", value: "cpp" },
    { name: "Java", value: "java" },
  ];

  // Editor themes
  const aceThemes = [
    { name: "monokai", type: "dark" },
    { name: "dracula", type: "dark" },
    { name: "tomorrow_night", type: "dark" },
    { name: "twilight", type: "dark" },
    { name: "gruvbox", type: "dark" },
    { name: "chaos", type: "dark" },
    { name: "github", type: "light" },
    { name: "solarized_light", type: "light" },
    { name: "xcode", type: "light" },
    { name: "clouds", type: "light" },
    { name: "terminal", type: "dark" },
  ];

  // Test cases
  const [testcases, setTestcases] = useState(
    testcase.map((tc, index) => ({ ...tc, id: index }))
  );

  const [selectedLang, setSelectedLang] = useState('javascript');
  const [selectedFont, setSelectedFont] = useState(18);
  const [selectedTheme, setSelectedTheme] = useState("xcode");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [wrapEnabled, setWrapEnabled] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editTest, setEditTest] = useState({ input: "", output: "" });
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const fontSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

  const [editorInstance, setEditorInstance] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !editorInstance) return;
    const resizeObserver = new ResizeObserver(() => {
      if (editorInstance) {
        editorInstance.editor.resize();
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [editorInstance]);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditTest(testcases[index]);
  };

  const handleUpdate = () => {
    if (editTest.input.trim() && editTest.output.trim()) {
      setTestcases(prev =>
        prev.map((test, i) => (i === editIndex ? editTest : test))
      );
      setEditIndex(null);
      setEditTest({ input: "", output: "" });
    }
  };

  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const handleDelete = (id) => {
    setTestcases(prev => prev.filter(test => test.id !== id));
  };

  const userId = useSelector((state) => state.login.userId);

  const handleRun = async () => {
    try {
      setLoading(true);
      setSelectedTabIndex(1);
      const response = await axiosInstance.post("/api/problem/run", {
        quesId: quesId,
        userId: userId,
        lang: selectedLang,
        code: code,
        testcases: testcases.map(test => ({
          input: test.input,
          output: test.output
        }))
      });
      setLoading(false);
      setOutput(response.data);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setOutput({
        error: error.response?.data?.message || error.message || "An error occurred while running the code",
        isFullyPassed: false,
        passedTestCases: 0,
        totalTestCases: testcases.length
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setOverlay(<OverlayOne />);
      setLoading(true);
      setOutput(null);
      onOpen();

      const response = await axiosInstance.post("/api/problem/submit", {
        quesId: quesId,
        lang: selectedLang,
        code: code,
        userId: userId
      });

      setOutput(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setOutput({
        error: error.response?.data?.message || error.message || "An error occurred while submitting the code",
        isFullyPassed: false,
        passedTestCases: 0,
        totalTestCases: testcases.length
      });
    }
  };

  useEffect(() => {
    const fetchStarterCode = async () => {
      setIsEditorLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/problem/get-starter-code?quesId=${quesId}&language=${selectedLang}`
        );
        setCode(response.data.code || "");

      } catch (error) {
        console.error("Error in Fetching Starter Code", error);
        setCode("");
      } finally {
        setIsEditorLoading(false);
      }
    };
    fetchStarterCode();
  }, [quesId, selectedLang]);

  const confettiColors = useColorModeValue(
    ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
    ['#ff8a80', '#ff80ab', '#ea80fc', '#b388ff', '#8c9eff', '#82b1ff', '#80d8ff', '#84ffff', '#a7ffeb', '#b9f6ca', '#ccff90', '#f4ff81', '#ffff8d', '#ffe57f', '#ffd180', '#ff9e80']
  );

  // Helper function to check if any test case has an error
  const hasAnyError = (output) => {
    if (!output) return false;
    if (output.error) return true;
    if (output.testResults) {
      return output.testResults.some(test => test.error);
    }
    return false;
  };

  // Helper function to get the first error from test results
  const getFirstError = (output) => {
    if (output.error) return output.error;
    if (output.testResults) {
      const failedTest = output.testResults.find(test => test.error);
      return failedTest?.error || null;
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Editor Header */}
        <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <HiOutlineCode size={24} className="text-amber-600 dark:text-indigo-400" />

            {/* Language Selector */}
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="p-1.5 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500"
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-white dark:bg-gray-800"
                >
                  {option.name}
                </option>
              ))}
            </select>

            {/* Theme Selector */}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="p-1.5 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 hidden md:block"
            >
              {aceThemes.map((t) => (
                <option
                  key={t.name}
                  value={t.name}
                  className="bg-white dark:bg-gray-800"
                >
                  {t.name} ({t.type})
                </option>
              ))}
            </select>

            {/* Font Size Selector */}
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(Number(e.target.value))}
              className="p-1.5 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 hidden md:block"
            >
              {fontSizes.map((size) => (
                <option
                  key={size}
                  value={size}
                  className="bg-white dark:bg-gray-800"
                >
                  {size}px
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            {/* Word Wrap Toggle */}
            <button
              onClick={() => setWrapEnabled(!wrapEnabled)}
              className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={wrapEnabled ? "Disable word wrap" : "Enable word wrap"}
            >
              <CgFormatLeft size={20} className="text-gray-700 dark:text-gray-300" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <LuFullscreen size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1" ref={containerRef}>
          <ErrorBoundary>
            {isEditorLoading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
              </div>
            ) : (
              <AceEditor
                onLoad={(editor) => setEditorInstance(editor)}
                mode={selectedLang === "cpp" ? "c_cpp" : selectedLang}
                theme={selectedTheme || "monokai"}
                value={code || ""}
                onChange={(newValue) => setCode(newValue)}
                fontSize={selectedFont}
                width="100%"
                height={isFullScreen ? "80vh" : "45vh"}
                wrapEnabled={wrapEnabled}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  highlightActiveLine: true,
                  highlightGutterLine: true,
                }}
              />
            )}
          </ErrorBoundary>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 p-3 bg-gray-100 dark:bg-gray-800">
          <button
            onClick={handleRun}
            disabled={loading}
            className={`px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md transition-colors`}
          >
            {loading ? "Running..." : "Run"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded-md transition-colors`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-white dark:bg-gray-900 p-4">
          <Tabs index={selectedTabIndex} onChange={(index) => setSelectedTabIndex(index)}>
            <TabList className="">
              <Tab
                _selected={{
                  color: 'amber.600',
                  borderBottom: '2px solid',
                  borderColor: 'amber.600'
                }}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400"
              >
                <GrTest /> Test Cases
              </Tab>
              <Tab
                _selected={{
                  color: 'amber.600',
                  borderBottom: '2px solid',
                  borderColor: 'amber.600'
                }}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400"
              >
                <HiOutlineCode /> Results
              </Tab>
            </TabList>

            <TabPanels>
              {/* Test Cases Tab */}
              <TabPanel className="p-2" >
                <div className="flex gap-4 overflow-x-auto pb-2" style={{
                  overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none'
                }}>
                  <AnimatePresence>
                    {testcases.map((test, index) => (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 w-64 bg-zinc-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-md"
                      >
                        {editIndex === index ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editTest.input}
                              placeholder="Input"
                              onChange={(e) => setEditTest({ ...editTest, input: e.target.value })}
                              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            />
                            <input
                              type="text"
                              value={editTest.output}
                              placeholder="Output"
                              onChange={(e) => setEditTest({ ...editTest, output: e.target.value })}
                              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditIndex(null)}
                                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleUpdate}
                                className="px-3 py-1 text-sm bg-amber-500 dark:bg-indigo-600 text-white rounded flex items-center gap-1"
                              >
                                <FiSave size={14} /> Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-800 dark:text-gray-200">Input:</h4>
                                <p className="text-gray-600 dark:text-gray-400">{test.input}</p>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEdit(index)}
                                  className="p-1 text-gray-500 hover:text-amber-600 dark:hover:text-indigo-400"
                                >
                                  <GrFormEdit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(test.id)}
                                  className="p-1 text-gray-500 hover:text-red-500"
                                >
                                  <MdDelete size={18} />
                                </button>
                              </div>
                            </div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">Output:</h4>
                            <p className="text-gray-600 dark:text-gray-400">{test.output}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </TabPanel>

              {/* Results Tab */}
              <TabPanel>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 md:p-6 min-h-32 shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-32 space-y-3 text-indigo-600 dark:text-indigo-400">
                      <div className="relative">
                        <Spinner size="lg" />
                      </div>
                      <p className="text-sm font-medium text-center">Executing your code, please wait...</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 max-w-xs">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 animate-pulse"
                          style={{ width: `70%` }}
                        ></div>
                      </div>
                    </div>
                  ) : output ? (
                    <div className="space-y-4">
                      {/* Status Badge */}
                      <div
                        className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-semibold w-fit transition-colors duration-300
                          ${output.isFullyPassed
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 shadow-sm'
                            : hasAnyError(output) ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 shadow-sm'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 shadow-sm'
                          }`}
                      >
                        {output.isFullyPassed ? (
                          <>
                            <CheckCircleIcon className="h-5 w-5" />
                            Accepted
                          </>
                        ) : hasAnyError(output) ? (
                          <>
                            <XCircleIcon className="h-5 w-5" />
                            Error
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-5 w-5" />
                            Wrong Answer
                          </>
                        )}
                      </div>

                      {/* Error Display Section - Only show if there's an error */}
                      {hasAnyError(output) && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Compilation/Runtime Error</h4>
                              <pre className="text-xs bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded overflow-x-auto whitespace-pre-wrap break-words text-yellow-800 dark:text-yellow-200 font-mono">
                                {getFirstError(output)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Testcase Summary - Only show if no error */}
                      {!hasAnyError(output) && (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium text-base bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md w-fit">
                              {output.passedTestCases || 0} / {output.totalTestCases || 0}
                            </span>
                            <span>test cases passed</span>
                          </div>

                          {/* Execution Metrics */}
                          {(output.totalExecutionTime || output.memoryUsage) && (
                            <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                              {output.totalExecutionTime && (
                                <div className="flex items-center gap-1">
                                  <ClockIcon className="h-4 w-4" />
                                  <span>Time: {output.totalExecutionTime}ms</span>
                                </div>
                              )}
                              {output.memoryUsage && (
                                <div className="flex items-center gap-1">
                                  <CpuIcon className="h-4 w-4" />
                                  <span>Memory: {output.memoryUsage}MB</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Test Case Details - Failed Cases */}
                          {output.testResults && output.testResults.some(test => !test.isPassed) && (
                            <div className="space-y-3 mt-4">
                              <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">Failed Test Cases:</h4>
                              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {output.testResults.filter(test => !test.isPassed).map((test, index) => (
                                  <div key={index} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                                      <span className="font-medium text-red-700 dark:text-red-300 text-sm">
                                        Test Case #{index + 1} - Failed
                                      </span>
                                      {test.executionTime && (
                                        <span className="text-xs text-red-600 dark:text-red-400">
                                          {(test.executionTime).toFixed(1)}s
                                        </span>
                                      )}
                                    </div>

                                    {/* Input */}
                                    <div className="mb-3">
                                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Input</div>
                                      <pre className="text-sm bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-pre-wrap break-words">
                                        {typeof test.input === 'object' ? JSON.stringify(test.input, null, 2) : test.input}
                                      </pre>
                                    </div>

                                    {/* Expected Output */}
                                    <div className="mb-3">
                                      <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">Expected Output</div>
                                      <pre className="text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800/50 overflow-x-auto whitespace-pre-wrap break-words text-green-800 dark:text-green-200">
                                        {typeof test.output === 'object' ? JSON.stringify(test.output, null, 2) : test.output}
                                      </pre>
                                    </div>

                                    {/* Actual Output */}
                                    <div>
                                      <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1"> Your Output:</div>
                                      <pre className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800/50 overflow-x-auto whitespace-pre-wrap break-words text-red-800 dark:text-red-200">
                                        {typeof test.actualOutput === 'object' ? JSON.stringify(test.actualOutput, null, 2) : test.actualOutput || 'No output'}
                                      </pre>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Success Message */}
                          {output.isFullyPassed && (
                            <div className="flex items-center gap-3 mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                                  🎉 Congratulations! All test cases passed successfully.
                                </p>
                                {output.totalExecutionTime && (
                                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                    Total execution time: {output.totalExecutionTime}ms
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 text-gray-500 dark:text-gray-400 italic space-y-2">
                      <PlayIcon className="h-6 w-6 text-indigo-400" />
                      <p className="text-center">Run your code to see results</p>
                    </div>
                  )}
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>

      <SubmissionReportModal
        isOpen={isOpen}
        onClose={onClose}
        output={output}
        loading={loading}
        onSubmitAgain={() => setCode(code)} // or whatever "submit again" should do
      />
    </>
  );
}

export default Compiler;