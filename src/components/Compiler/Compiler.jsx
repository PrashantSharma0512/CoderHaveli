'use client';

import React, { useEffect, useState, useRef } from "react";
import toast from '@/components/common/CoderHaveliToast';
import AceEditor from "react-ace";
import { CgFormatLeft } from "react-icons/cg";
import { LuFullscreen, LuMinimize2 } from "react-icons/lu";
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
import { CheckCircleIcon, PlayIcon, XCircleIcon, ClockIcon, CpuIcon, ChevronUp, ChevronDown } from "lucide-react";
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

function Compiler({ testcase, quesId, starterCodes }) {
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
    (testcase || []).map((tc, index) => ({ ...tc, id: index }))
  );

  useEffect(() => {
    if (Array.isArray(testcase) && testcase.length > 0) {
      setTestcases(testcase.map((tc, index) => ({ ...tc, id: index })));
    }
  }, [testcase]);

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
  const [isFullscreenConsoleOpen, setIsFullscreenConsoleOpen] = useState(false);
  const compilerRootRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const fontSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

  const [editorInstance, setEditorInstance] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const containerRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const isHydratingCodeRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !editorInstance) return;
    const resizeObserver = new ResizeObserver(() => {
      if (typeof editorInstance?.resize === 'function') {
        editorInstance.resize();
      } else if (typeof editorInstance?.editor?.resize === 'function') {
        editorInstance.editor.resize();
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [editorInstance]);

  // Fullscreen open/exit handler
  const toggleFullScreen = async () => {
    if (!isFullScreen) {
      setIsFullScreen(true);
      try {
        if (compilerRootRef.current && !document.fullscreenElement) {
          if (compilerRootRef.current.requestFullscreen) {
            await compilerRootRef.current.requestFullscreen();
          } else if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        }
      } catch (err) {
        // Fallback gracefully to fixed viewport overlay
      }
    } else {
      setIsFullScreen(false);
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (err) {
        // ignore
      }
    }
  };

  // Keyboard shortcut (Escape to exit) and browser fullscreen sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullScreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen]);

  // Lock body scroll and trigger Ace editor redraw when fullscreen toggles
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const timer = setTimeout(() => {
      if (typeof editorInstance?.resize === 'function') {
        editorInstance.resize();
      } else if (typeof editorInstance?.editor?.resize === 'function') {
        editorInstance.editor.resize();
      }
    }, 100);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [isFullScreen, isFullscreenConsoleOpen, editorInstance]);

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
      if (isFullScreen) {
        setIsFullscreenConsoleOpen(true);
      }
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
      setSaveStatus('saved');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent("coderhaveli-submission-saved", {
          detail: { quesId, isFullyPassed: !!response.data?.isFullyPassed }
        }));
      }
      const ds = response.data?.dailyStreak;
      if (ds?.isDailyProblem && ds?.isNewSolve) {
        if (ds.newCoinBalance !== null && ds.newCoinBalance !== undefined) {
          window.dispatchEvent(new CustomEvent("haveli-coins-updated", { detail: { balance: ds.newCoinBalance } }));
        }
        const totalCoins = (ds.coinsEarned || 0) + (ds.bonusCoinsEarned || 0);
        if (totalCoins > 0) {
          toast.success(`AajKaSawal Solved! +${totalCoins} Haveli Coin${totalCoins === 1 ? '' : 's'} earned!`, { duration: 5000 });
        } else {
          toast.success(`AajKaSawal Solved! ${ds.currentStreak} Day Streak!`, { duration: 4000 });
        }
      }
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
    if (!quesId) return;

    const langKey = (selectedLang || 'javascript').toLowerCase();
    const draftKey = `coderhaveli_code_${userId || 'guest'}_${quesId}_${langKey}`;
    let isCancelled = false;
    isHydratingCodeRef.current = true;

    // 1. Check localStorage draft immediately (0ms)
    let localDraft = null;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.code === 'string') {
          localDraft = parsed;
        }
      }
    } catch {
      // ignore corrupted local draft
    }

    const starterFallback = starterCodes?.[langKey] || null;
    if (localDraft) {
      setCode(localDraft.code);
      setSaveStatus('saved');
      setIsEditorLoading(false);
    } else if (starterFallback) {
      setCode(starterFallback);
      setSaveStatus('idle');
      setIsEditorLoading(false);
    }

    // 2. Sync with cloud saved code (if logged in) and/or fetch starter code
    const loadSavedOrStarter = async () => {
      if (!localDraft && !starterFallback) {
        setIsEditorLoading(true);
      }
      try {
        if (userId) {
          const savedRes = await axiosInstance
            .get(`/api/problem/code/${quesId}?language=${langKey}`)
            .catch(() => null);
          const cloudCode = savedRes?.data?.code;
          const cloudTime = savedRes?.data?.modifiedAt ? new Date(savedRes.data.modifiedAt).getTime() : 0;

          if (!isCancelled && typeof cloudCode === 'string') {
            if (!localDraft || cloudTime > (localDraft.updatedAt || 0)) {
              setCode(cloudCode);
              setSaveStatus('saved');
              try {
                localStorage.setItem(draftKey, JSON.stringify({ code: cloudCode, updatedAt: cloudTime || Date.now() }));
              } catch {
                // ignore storage quota errors
              }
              isHydratingCodeRef.current = false;
              setIsEditorLoading(false);
              return;
            }
          }
        }

        if (!localDraft && !starterFallback) {
          const response = await axiosInstance.get(
            `/api/problem/get-starter-code?quesId=${quesId}&language=${selectedLang}`
          );
          if (!isCancelled) {
            setCode(response.data.code || "");
          }
        }
      } catch (error) {
        console.error("Error loading saved/starter code:", error);
        if (!isCancelled && !localDraft && !starterFallback) {
          setCode("");
        }
      } finally {
        if (!isCancelled) {
          isHydratingCodeRef.current = false;
          setIsEditorLoading(false);
        }
      }
    };

    loadSavedOrStarter();
    return () => {
      isCancelled = true;
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [quesId, selectedLang, starterCodes, userId]);

  // Listen for submission restore events from Submission tab
  useEffect(() => {
    const handleLoadSubmissionCode = (e) => {
      const { quesId: targetQuesId, language, sourceCode } = e.detail || {};
      if (String(targetQuesId) !== String(quesId) || typeof sourceCode !== 'string') return;
      const langKey = (language || selectedLang).toLowerCase();
      if (langKey !== selectedLang.toLowerCase()) {
        setSelectedLang(langKey);
      }
      setCode(sourceCode);
      setSaveStatus('saved');
      try {
        const draftKey = `coderhaveli_code_${userId || 'guest'}_${quesId}_${langKey}`;
        localStorage.setItem(draftKey, JSON.stringify({ code: sourceCode, updatedAt: Date.now() }));
      } catch {
        // ignore
      }
      toast.success('Loaded submitted code into editor');
    };
    window.addEventListener('coderhaveli-load-code', handleLoadSubmissionCode);
    return () => window.removeEventListener('coderhaveli-load-code', handleLoadSubmissionCode);
  }, [quesId, selectedLang, userId]);

  const persistCodeToCloud = async (codeToSave, langToSave) => {
    if (!userId || !quesId) return;
    try {
      setSaveStatus('saving');
      await axiosInstance.post('/api/problem/save-code', {
        quesId,
        language: langToSave,
        code: codeToSave
      });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  };

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    if (isHydratingCodeRef.current || !quesId) return;

    const langKey = (selectedLang || 'javascript').toLowerCase();
    const draftKey = `coderhaveli_code_${userId || 'guest'}_${quesId}_${langKey}`;
    try {
      localStorage.setItem(draftKey, JSON.stringify({ code: newValue, updatedAt: Date.now() }));
    } catch {
      // ignore storage quota errors
    }

    if (userId) {
      setSaveStatus('saving');
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      autosaveTimerRef.current = setTimeout(() => {
        persistCodeToCloud(newValue, langKey);
      }, 1500);
    } else {
      setSaveStatus('saved');
    }
  };

  const handleResetToStarter = () => {
    const langKey = (selectedLang || 'javascript').toLowerCase();
    const draftKey = `coderhaveli_code_${userId || 'guest'}_${quesId}_${langKey}`;
    const starter = starterCodes?.[langKey] || '';
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
    setCode(starter);
    if (userId) {
      persistCodeToCloud(starter, langKey);
    } else {
      setSaveStatus('idle');
    }
    toast.success('Reset to starter code');
  };

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

  // Output Panel Component with Tab Switcher & Clean Scrolling
  const renderOutputPanel = (isDrawer = false) => (
    <Tabs index={selectedTabIndex} onChange={(index) => setSelectedTabIndex(index)}>
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <TabList className="flex border-b-0">
          <Tab
            _selected={{
              color: 'amber.600',
              borderBottom: '2px solid',
              borderColor: 'amber.600'
            }}
            className="flex items-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
          >
            <GrTest /> Test Cases
          </Tab>
          <Tab
            _selected={{
              color: 'amber.600',
              borderBottom: '2px solid',
              borderColor: 'amber.600'
            }}
            className="flex items-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
          >
            <HiOutlineCode /> Results
          </Tab>
        </TabList>
        {isDrawer && (
          <button
            type="button"
            onClick={() => setIsFullscreenConsoleOpen(false)}
            className="text-xs px-2.5 py-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded cursor-pointer transition-colors"
            title="Minimize console"
          >
            ✕ Close
          </button>
        )}
      </div>

      <TabPanels>
        {/* Test Cases Tab */}
        <TabPanel className="p-2">
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar" style={{
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
                  className="flex-shrink-0 w-[82vw] max-w-xs sm:w-64 bg-zinc-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-md"
                >
                  {editIndex === index ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editTest.input}
                        placeholder="Input"
                        onChange={(e) => setEditTest({ ...editTest, input: e.target.value })}
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs sm:text-sm"
                      />
                      <input
                        type="text"
                        value={editTest.output}
                        placeholder="Output"
                        onChange={(e) => setEditTest({ ...editTest, output: e.target.value })}
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs sm:text-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditIndex(null)}
                          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleUpdate}
                          className="px-3 py-1 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded flex items-center gap-1 cursor-pointer"
                        >
                          <FiSave size={14} /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 text-xs">Input:</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs font-mono break-all">{test.input}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(index)}
                            className="p-1 text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
                            aria-label="Edit test case"
                          >
                            <GrFormEdit size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(test.id)}
                            className="p-1 text-gray-500 hover:text-red-500 cursor-pointer"
                            aria-label="Delete test case"
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 text-xs">Output:</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs font-mono break-all">{test.output}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabPanel>

        {/* Results Tab */}
        <TabPanel>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-3 sm:p-5 min-h-32 shadow-xs border border-gray-200 dark:border-gray-700">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-32 space-y-3 text-amber-600 dark:text-amber-400">
                <div className="relative">
                  <Spinner size="lg" />
                </div>
                <p className="text-sm font-medium text-center">Executing your code, please wait...</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 max-w-xs">
                  <div
                    className="bg-amber-600 h-1.5 rounded-full transition-all duration-300 animate-pulse"
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
                        <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar pr-2">
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
                <PlayIcon className="h-6 w-6 text-amber-400" />
                <p className="text-center">Run your code to see results</p>
              </div>
            )}
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );

  return (
    <>
      <div
        ref={compilerRootRef}
        className={`flex flex-col w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg ${
          isFullScreen
            ? "fixed inset-0 z-50 w-screen h-screen rounded-none border-none overflow-hidden m-0 p-0"
            : "overflow-hidden"
        }`}
      >
        {/* Editor Header */}
        <div className="flex flex-wrap justify-between items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 gap-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <HiOutlineCode size={22} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />

            {/* Language Selector */}
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="py-1 px-2.5 text-xs sm:text-sm font-medium rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  {option.name}
                </option>
              ))}
            </select>

            {/* Theme Selector */}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className={`py-1 px-2 text-xs rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ${
                isFullScreen ? 'block' : 'hidden sm:block'
              }`}
            >
              {aceThemes.map((t) => (
                <option
                  key={t.name}
                  value={t.name}
                  className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  {t.name}
                </option>
              ))}
            </select>

            {/* Font Size Selector */}
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(Number(e.target.value))}
              className={`py-1 px-2 text-xs rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ${
                isFullScreen ? 'block' : 'hidden md:block'
              }`}
            >
              {fontSizes.map((size) => (
                <option
                  key={size}
                  value={size}
                  className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  {size}px
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Autosave Status Indicator */}
            {saveStatus !== 'idle' && (
              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold ${
                  saveStatus === 'saving'
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                    : saveStatus === 'error'
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                      : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                }`}
                title="Code is automatically saved locally and to your account"
              >
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Local Draft' : 'Saved'}
              </span>
            )}

            {/* Reset to Starter Code */}
            <button
              type="button"
              onClick={handleResetToStarter}
              className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-xs text-gray-700 dark:text-gray-300 cursor-pointer"
              title="Reset to starter code"
            >
              Reset
            </button>

            {/* Word Wrap Toggle */}
            <button
              type="button"
              onClick={() => setWrapEnabled(!wrapEnabled)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                wrapEnabled
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50'
              }`}
              title={wrapEnabled ? "Wrap enabled" : "Wrap disabled"}
              aria-label="Toggle word wrap"
            >
              <CgFormatLeft size={18} />
              <span className="hidden sm:inline">Wrap</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullScreen}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                isFullScreen
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              title={isFullScreen ? "Exit fullscreen (Esc)" : "Open editor in fullscreen"}
              aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullScreen ? (
                <>
                  <LuMinimize2 size={18} />
                  <span className="hidden sm:inline font-medium">Exit Fullscreen</span>
                  <kbd className="hidden md:inline text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-mono">Esc</kbd>
                </>
              ) : (
                <>
                  <LuFullscreen size={18} />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 w-full min-h-0 overflow-hidden relative" ref={containerRef}>
          <ErrorBoundary>
            {isEditorLoading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner size="lg" className="text-amber-500" />
              </div>
            ) : (
              <AceEditor
                onLoad={(editor) => setEditorInstance(editor)}
                mode={selectedLang === "cpp" ? "c_cpp" : selectedLang}
                theme={selectedTheme || "monokai"}
                value={code || ""}
                onChange={handleCodeChange}
                fontSize={selectedFont}
                width="100%"
                height={isFullScreen ? "100%" : "min(52vh, 460px)"}
                wrapEnabled={wrapEnabled}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  highlightActiveLine: true,
                  highlightGutterLine: true,
                  tabSize: 4,
                  useSoftTabs: true,
                  showPrintMargin: false,
                }}
              />
            )}
          </ErrorBoundary>
        </div>

        {/* Fullscreen Docked Console Drawer */}
        {isFullScreen && isFullscreenConsoleOpen && (
          <div className="h-64 sm:h-72 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:p-4 overflow-y-auto no-scrollbar flex-shrink-0">
            {renderOutputPanel(true)}
          </div>
        )}

        {/* Action Buttons - Fully Responsive for Mobile & Desktop */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-4 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          {isFullScreen && (
            <button
              type="button"
              onClick={() => setIsFullscreenConsoleOpen(!isFullscreenConsoleOpen)}
              className="mr-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            >
              <span>Console & Tests</span>
              {isFullscreenConsoleOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={handleRun}
            disabled={loading}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white'
            }`}
          >
            <PlayIcon className="h-4 w-4 fill-current" />
            <span>{loading ? "Running..." : "Run Code"}</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 active:scale-98 text-white'
            }`}
          >
            <CheckCircleIcon className="h-4 w-4" />
            <span>{loading ? "Submitting..." : "Submit Solution"}</span>
          </button>
        </div>

        {/* Output Panel for Standard (non-fullscreen) View */}
        {!isFullScreen && (
          <div className="bg-white dark:bg-gray-900 p-4">
            {renderOutputPanel(false)}
          </div>
        )}
      </div>

      <SubmissionReportModal
        isOpen={isOpen}
        onClose={onClose}
        output={output}
        loading={loading}
        onSubmitAgain={handleSubmit}
      />
    </>
  );
}

export default Compiler;
