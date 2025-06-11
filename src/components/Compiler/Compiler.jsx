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
import { Box, Button, CircularProgress, CircularProgressLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateCode } from "../../store/slice";

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
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

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

  const OverlayTwo = () => (
    <ModalOverlay
      bg='none'
      backdropFilter='auto'
      backdropInvert='80%'
      backdropBlur='2px'
    />
  )

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = React.useState(<OverlayOne />)
  const handleDelete = (id) => {
    setTestcases(prev => prev.filter(test => test.id !== id));
  };
  const handleRun = async () => {
    try {
      setLoading(true)
      setSelectedTabIndex(1)
      const response = await axiosInstance.post("/api/problem/run", {
        quesId: quesId,
        lang: selectedLang,
        code: code,
        testcases: testcases.map(test => ({
          input: test.input,
          output: test.output
        }))
      })
      setOutput(response.data)
      console.log(response, " chacha ji ");
    } catch (error) {
      console.log(error);
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
      });

      setOutput(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

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
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
        {overlay}
        <ModalContent>
          <ModalHeader>Submission Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {output ? (
              <Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap="3"
                  px="4"
                  py="2"
                  borderRadius="full"
                  bg={output.isFullyPassed ? 'green.100' : 'red.100'}
                  color={output.isFullyPassed ? 'green.700' : 'red.700'}
                  w="fit-content"
                  mb="4"
                >
                  {output.isFullyPassed ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      <Text fontWeight="semibold">Accepted</Text>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-5 w-5" />
                      <Text fontWeight="semibold">Wrong Answer</Text>
                    </>
                  )}
                </Box>

                <Box display="flex" alignItems="center" gap="4" mb="4">
                  <CircularProgress
                    value={(output.passedTestCases / output.totalTestCases) * 100}
                    color={output.isFullyPassed ? 'green.500' : 'red.500'}
                    size="80px"
                  >
                    <CircularProgressLabel>
                      {output.passedTestCases}/{output.totalTestCases}
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text>
                    {output.passedTestCases} out of {output.totalTestCases} test cases passed
                  </Text>
                </Box>

                {output.failedTestCases && output.failedTestCases.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" mb="2">Failed Test Cases:</Text>
                    {output.failedTestCases.map((testCase, index) => (
                      <Box key={index} mb="3" p="3" bg="gray.100" borderRadius="md">
                        <Text><strong>Input:</strong> {testCase.input}</Text>
                        <Text><strong>Expected:</strong> {testCase.expectedOutput}</Text>
                        <Text><strong>Actual:</strong> {testCase.actualOutput}</Text>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Box display="flex" justifyContent="center" py="8">
                <CircularProgress isIndeterminate color="blue.500" />
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>

  );
}
export default Compiler;