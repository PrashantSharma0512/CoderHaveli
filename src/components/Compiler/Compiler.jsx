import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { CgFormatLeft } from "react-icons/cg";
import { LuFullscreen } from "react-icons/lu";
import { GrFormEdit } from "react-icons/gr";
import { MdDelete } from "react-icons/md"
import { GrTest } from "react-icons/gr";
import { HiOutlineCode } from "react-icons/hi";
import { FiSave } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Button, CircularProgress, CircularProgressLabel, Code, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateCode } from "../../store/slice/slice";
import Confettii from "react-confetti"
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
import axiosInstance from "../helper/axiosInstance";
import { CheckCircleIcon, StarIcon, XCircleIcon } from "lucide-react";
import {
  MdCelebration as CelebrationIcon,
  MdWarning as ExclamationIcon
} from 'react-icons/md';
function Compiler({ testcase, quesId }) {
  // Language options
  const options = [
    { name: "JavaScript", value: "javascript" },
    { name: "Python", value: "python" },
    { name: "C++", value: "c_cpp" },
    { name: "Java", value: "java" },
    { name: "Rust", value: "rust" },
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


  const dispatch = useDispatch();
  const { code: storedCode = "console.log('hello javascript')", mode: storedMode = "javascript" } =
    useSelector((state) => state.compiler) || {};

  const [selectedLang, setSelectedLang] = useState(storedMode);
  const [selectedFont, setSelectedFont] = useState(18);
  const [selectedTheme, setSelectedTheme] = useState("monokai");
  const [code, setCode] = useState(storedCode);
  const [output, setOutput] = useState("");
  const [wrapEnabled, setWrapEnabled] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editTest, setEditTest] = useState({ input: "", output: "" });
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false)
  const fontSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

  useEffect(() => {
    setCode(storedCode);
    setSelectedLang(storedMode);
  }, [storedCode, storedMode]);

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
  )


  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = React.useState(<OverlayOne />)
  const handleDelete = (id) => {
    setTestcases(prev => prev.filter(test => test.id !== id));
  };
  const userId = useSelector((state) => (state.login.userId))

  const handleRun = async () => {
    try {
      setLoading(true)
      setSelectedTabIndex(1)
      const response = await axiosInstance.post("/api/problem/run", {
        quesId: quesId,
        userId: userId,
        lang: selectedLang,
        code: code,
        testcases: testcases.map(test => ({
          input: test.input,
          output: test.output
        }))
      })
      setLoading(false)
      setOutput(response.data)
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  }
  const handleSubmit = async () => {
    try {
      setOverlay(<OverlayOne />);
      setLoading(true);
      setOutput(null);  // Reset output state
      onOpen();

      const response = await axiosInstance.post("/api/problem/submit", {
        quesId: quesId,
        lang: selectedLang,
        code: code,
        userId:userId
      });

      setOutput(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }
  const confettiColors = useColorModeValue(
    // Light mode colors
    ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
    // Dark mode colors (brighter versions)
    ['#ff8a80', '#ff80ab', '#ea80fc', '#b388ff', '#8c9eff', '#82b1ff', '#80d8ff', '#84ffff', '#a7ffeb', '#b9f6ca', '#ccff90', '#f4ff81', '#ffff8d', '#ffe57f', '#ffd180', '#ff9e80']
  );

  return (
    <>
      <div className="flex flex-col w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Editor Header */}
        <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 ">
          <div className="flex items-center gap-4">
            <HiOutlineCode size={24} className="text-amber-600 dark:text-indigo-400" />

            {/* Language Selector */}
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="p-1.5 rounded-md bg-white dark:bg-gray-700  text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500"
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
              className="p-1.5 rounded-md bg-white dark:bg-gray-700  text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 hidden md:block"
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
              className="p-1.5 rounded-md bg-white dark:bg-gray-700  text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 hidden md:block"
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
        <div className="flex-1">
          <AceEditor
            mode={selectedLang}
            theme={selectedTheme}
            value={code}
            onChange={(newCode) => {
              setCode(newCode);
              dispatch(updateCode({ id: 1, code: newCode }));
            }}
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
            className=""
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 p-3 bg-gray-100 dark:bg-gray-800">
          <button
            onClick={handleRun}
            className="px-4 py-2 bg-green-500 text-white hover:bg-green-300 dark:bg-green-500 dark:hover:bg-gray-600  dark:text-gray-200 rounded-md transition-colors"
          >
            Run
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Submit
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-white dark:bg-gray-900 p-4 ">
          <Tabs index={selectedTabIndex} onChange={(index) => setSelectedTabIndex(index)}>
            <TabList className=" ">
              <Tab
                _selected={{
                  color: 'amber.600 dark:indigo.400',
                  borderBottom: '2px solid',
                  borderColor: 'amber.600 dark:indigo.400'
                }}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400"
              >
                <GrTest /> Test Cases
              </Tab>
              <Tab
                _selected={{
                  color: 'amber.600 dark:indigo.400',
                  borderBottom: '2px solid',
                  borderColor: 'amber.600 dark:indigo.400'
                }}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400"
              >
                <HiOutlineCode /> Results
              </Tab>
            </TabList>

            <TabPanels>
              {/* Test Cases Tab */}
              <TabPanel className="p-2">
                <div className="flex gap-4 overflow-x-auto pb-2">
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
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 min-h-32 shadow-md transition-all duration-300">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-32 space-y-3 text-indigo-600 dark:text-indigo-400">
                      <svg
                        className="animate-spin h-8 w-8 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <p className="text-sm font-medium">Executing your code, please wait...</p>
                    </div>
                  ) : output ? (
                    <div className="space-y-4">
                      {/* Status Badge */}
                      <div
                        className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-semibold w-fit transition-colors duration-300
            ${output.isFullyPassed
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}
                      >
                        {output.isFullyPassed ? (
                          <>
                            <CheckCircleIcon className="h-5 w-5" />
                            Accepted
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-5 w-5" />
                            Wrong Answer
                          </>
                        )}
                      </div>

                      {/* Testcase Summary */}
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-base">
                          {output.passedTestCases} / {output.totalTestCases}
                        </span>{' '}
                        test cases passed
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400 italic">
                      Run your code to see results
                    </div>
                  )}
                </div>
              </TabPanel>

            </TabPanels>
          </Tabs>
        </div>
      </div >
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "xl" }} // Full screen on mobile, xl on desktop
        motionPreset="slideInBottom" // Better for mobile
        scrollBehavior="inside"
      >
        {overlay}
        <ModalContent
          bg="white"
          borderRadius={{ base: 0, md: "xl" }} // No border radius on mobile
          boxShadow={{ base: "none", md: "xl" }}
          minH={{ base: "100vh", md: "auto" }} // Full height on mobile
          maxH={{ base: "100vh", md: "90vh" }}
        >
          {output?.isFullyPassed && (
            <Confettii
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={300} // Slightly fewer for mobile performance
              gravity={0.15}
              colors={['#FFC700', '#FF0000', '#2E3191', '#41BBC7']}
              opacity={0.8}
              tweenDuration={5000}
              confettiSource={{
                x: window.innerWidth / 4,
                y: window.innerHeight / 3,
                w: 10,
                h: 5
              }}
              initialVelocityX={10}
              initialVelocityY={15}
            />
          )}

          <ModalHeader
            bg={output?.isFullyPassed ? 'green.50' : 'red.50'}
            borderBottomWidth="1px"
            borderColor={output?.isFullyPassed ? 'green.100' : 'red.100'}
            py={3}
            px={4}
          >
            <Flex align="center">
              <Box
                mr={3}
                p={1.5}
                rounded="full"
                bg={output?.isFullyPassed ? 'green.100' : 'red.100'}
                color={output?.isFullyPassed ? 'green.600' : 'red.600'}
              >
                {output?.isFullyPassed ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  <XCircleIcon className="h-5 w-5" />
                )}
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold">Submission Result</Text>
                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                  {output ? (output.isFullyPassed ? "All tests passed!" : "Some tests failed") : "Processing..."}
                </Text>
              </Box>
            </Flex>
          </ModalHeader>

          <ModalCloseButton
            size="md"
            top={3}
            right={3}
            _hover={{ bg: 'gray.100' }}
          />

          <ModalBody py={4} px={4}>
            {output ? (
              <Box>
                {/* Progress Section - Stacked on mobile */}
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  align="center"
                  justify="space-between"
                  mb={6}
                  gap={4}
                >
                  <Box position="relative">
                    <CircularProgress
                      value={(output.passedTestCases / output.totalTestCases) * 100}
                      color={output.isFullyPassed ? 'green.400' : 'red.400'}
                      size={{ base: "90px", md: "120px" }}
                      thickness="8px"
                      trackColor="gray.100"
                      capIsRound
                    >
                      <CircularProgressLabel>
                        <Box textAlign="center">
                          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                            {output.passedTestCases}/{output.totalTestCases}
                          </Text>
                          <Text fontSize="2xs" color="gray.500">PASSED</Text>
                        </Box>
                      </CircularProgressLabel>
                    </CircularProgress>
                  </Box>

                  <Box flex={1} w="full">
                    <Text fontSize={{ base: "md", md: "lg" }} mb={2}>
                      {output.isFullyPassed ? "🎉 All tests passed!" : `Passed ${output.passedTestCases}/${output.totalTestCases}`}
                    </Text>

                    <Progress
                      value={(output.passedTestCases / output.totalTestCases) * 100}
                      size="sm"
                      colorScheme={output.isFullyPassed ? 'green' : 'red'}
                      borderRadius="full"
                      mb={1}
                    />

                    <Flex justify="space-between" fontSize="xs" color="gray.600">
                      <Text>Progress</Text>
                      <Text fontWeight="medium">
                        {Math.round((output.passedTestCases / output.totalTestCases) * 100)}%
                      </Text>
                    </Flex>
                  </Box>
                </Flex>

                {/* Failed Test Cases - Simplified for mobile */}
                {output.failedTestCases && output.failedTestCases.length > 0 && (
                  <Box
                    borderTopWidth="1px"
                    borderColor="gray.100"
                    pt={4}
                  >
                    <Text fontSize="sm" fontWeight="bold" mb={3}>
                      ❌ Failed Test Cases
                    </Text>

                    <Box
                      maxH={{ base: "200px", md: "300px" }}
                      overflowY="auto"
                      pr={1}
                      className="custom-scrollbar"
                    >
                      {output.failedTestCases.map((testCase, index) => (
                        <Box
                          key={index}
                          mb={3}
                          p={3}
                          bg="gray.50"
                          borderRadius="md"
                          borderLeftWidth="3px"
                          borderColor="red.400"
                        >
                          <VStack align="stretch" spacing={2}>
                            <Box>
                              <Text fontSize="xs" color="gray.500" mb={1}>Input:</Text>
                              <Code
                                p={2}
                                fontSize="xs"
                                borderRadius="md"
                                bg="white"
                                display="block"
                                whiteSpace="pre-wrap"
                                overflowX="auto"
                              >
                                {testCase.input}
                              </Code>
                            </Box>

                            <Box>
                              <Text fontSize="xs" color="gray.500" mb={1}>Expected:</Text>
                              <Code
                                p={2}
                                fontSize="xs"
                                borderRadius="md"
                                bg="green.50"
                                color="green.700"
                                display="block"
                                whiteSpace="pre-wrap"
                              >
                                {testCase.expectedOutput}
                              </Code>
                            </Box>

                            <Box>
                              <Text fontSize="xs" color="gray.500" mb={1}>Actual:</Text>
                              <Code
                                p={2}
                                fontSize="xs"
                                borderRadius="md"
                                bg="red.50"
                                color="red.700"
                                display="block"
                                whiteSpace="pre-wrap"
                              >
                                {testCase.actualOutput}
                              </Code>
                            </Box>
                          </VStack>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Flex direction="column" align="center" justify="center" py={8}>
                <Spinner
                  size="lg"
                  color="blue.500"
                  thickness="3px"
                  speed="0.65s"
                  mb={3}
                />
                <Text fontSize="md" color="gray.600">Evaluating solution...</Text>
              </Flex>
            )}
          </ModalBody>

          <ModalFooter
            borderTopWidth="1px"
            borderColor="gray.100"
            py={3}
            px={4}
          >
            <Button
              colorScheme={output?.isFullyPassed ? 'green' : 'blue'}
              size="md"
              onClick={onClose}
              width="full" // Full width on mobile
              rightIcon={output?.isFullyPassed ? <CelebrationIcon className="h-4 w-4" /> : null}
            >
              {output?.isFullyPassed ? "Done" : "Close"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>

  );
}
export default Compiler;