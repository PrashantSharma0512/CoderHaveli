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
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateCode } from "../../store/slice";

function Compiler() {

  // these field comes from backend
  const options = [
    { name: "JavaScript", value: "javascript" },
    { name: "Python", value: "python" },
    { name: "C++", value: "c_cpp" },
    { name: "Java", value: "java" },
    { name: "Rust", value: "rust" },
  ];

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
  const testcases = [
    {
      id: 1,
      input: "1 2",
      output: "3",
    },
    {
      id: 2,
      input: "2 3",
      output: "5",
    },
    {
      id: 3,
      input: "3 4",
      output: "7",
    },

  ]
  const dispatch = useDispatch();
  const { code: storedCode = "print('hello world')", mode: storedMode = "python" } =
    useSelector((state) => state.compiler) || {};



  // const extractedMode = typeof firstCodeEntry.mode === "string" ? firstCodeEntry.mode : "python";
  const [selectedLang, setSelectedLang] = useState(storedMode);
  const [selectedFont, setSelectedFont] = useState(18);
  const [selectedTheme, setSelectedTheme] = useState("monokai");
  const [code, setCode] = useState(storedCode);
  const [output, setOutput] = useState("");
  const [Wrap, setWrap] = useState(false);
  const fontSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
  const [testcase, setTestcase] = useState(testcases);
  const [editIndex, setEditIndex] = useState(null);
  const [editTest, setEditTest] = useState({ input: "", output: "" });
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    setCode(storedCode);
    setSelectedLang(storedMode);
  }, [storedCode, storedMode]);
  // Function to enable edit mode
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditTest(testcase[index]);
  };

  // Function to update a test case
  const handleUpdate = () => {
    if (editTest.input.trim() && editTest.output.trim()) {
      setTestcase((prev) =>
        prev.map((test, i) => (i === editIndex ? editTest : test))
      );
      setEditIndex(null);
      setEditTest({ input: "", output: "" });
    }
  };

  // Function to delete a test case
  const handleDelete = (id) => {
    setTestcase((prevTestcases) => prevTestcases.filter((test) => test.id !== id));
  };

  return (
    <div className={"flex flex-col items-center justify-center w-full bg-gray-950 text-white"}>
      
        <div className="flex gap-2 justify-between w-full px-4 text-black'">
          <ul className="flex gap-4 justify-between items-center">
            <li><HiOutlineCode size={25} /></li>
            <li>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="p-2 outline-none cursor-pointer"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800 cursor-pointer">
                    {option.name}
                  </option>
                ))}
              </select>
            </li>
            <li className="max-md:hidden">
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="p-2 outline-none capitalize cursor-pointer"
              >
                {aceThemes.map((t) => (
                  <option key={t.name} value={t.name} className="bg-gray-800 capitalize cursor-pointer">
                    {t.name} ({t.type})
                  </option>
                ))}
              </select>
            </li>
            <li className="max-md:hidden">
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(Number(e.target.value))}
                className="p-2 outline-none font-bold cursor-pointer"
              >
                {fontSizes.map((size) => (
                  <option key={size} value={size} className="bg-gray-800 px-6 cursor-pointer">
                    {size}
                  </option>
                ))}
              </select>
            </li>
          </ul>
          <ul className="flex gap-4">
            <li>
              <button className="cursor-pointer" onClick={() => setWrap(!Wrap)}>
                <CgFormatLeft size={30} />
              </button>
            </li>
            <li>
              <button className={`cursor-pointer`}
                onClick={() => setIsFullScreen(!isFullScreen)}
              >
                <LuFullscreen size={30} />
              </button>
            </li>
          </ul>
        </div>

        {/* Code Editor */}
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
          height="45vh"
          wrapEnabled={Wrap}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            highlightActiveLine: true,
            highlightGutterLine: true,
          }}
        />

      {/* Buttons */}
      <div className="flex gap-4 justify-end w-full items-center py-1.5 pr-4">
        <button className="px-4 py-1 bg-gray-700 text-white rounded-lg cursor-pointer"
          onClick={() => setSelectedTabIndex(1)}
        >
          Run
        </button>
        <button className="px-4 py-1 text-white bg-green-600 rounded-lg cursor-pointer"
          onClick={() => setSelectedTabIndex(1)}
        >
          Submit
        </button>
      </div>

      {/* Output Panel */}
      <div className="p-3 bg-gray-900 text-white w-full rounded h-[36.1vh]">
        {/* <h3 className="font-bold">Output:</h3> */}
        <div>
          <Tabs className="gap-3" index={selectedTabIndex} onChange={(index) => setSelectedTabIndex(index)}>
            <TabList>
              <Tab _selected={{ color: 'white', textColor: 'green.300' }} className="cursor-pointer"><GrTest values="testcase" /> &nbsp;TestCase</Tab>
              <Tab _selected={{ color: 'white', textColor: 'green.300' }} className="cursor-pointer"> <HiOutlineCode size={20} values="result" />&nbsp; Result</Tab>
              {/* <Tab>Three</Tab> */}
            </TabList>
            {/* <hr /> */}
            <TabPanels>
              <TabPanel className="space-y-4 flex" values="testcase">
                <div className="p-2 w-full">
                  {/* Test Case List */}
                  <div className="space-y-2 flex justify-start gap-4 max-md:overflow-y-scroll">
                    <AnimatePresence>
                      {testcase.map((test, index) => (
                        <motion.div
                          key={test.id} // ✅ Using unique ID instead of index
                          initial={{ opacity: 0, scale: 0.8, y: 10 }} // Enter animation
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -10 }} // Exit animation
                          transition={{ duration: 0.3 }}
                          className="flex items-start justify-between gap-4 p-4 border bg-gray-800 rounded-lg shadow-lg w-[26vh] h-[18vh]"
                        >
                          {editIndex === index ? (
                            <div className="w-full text-white">
                              <input
                                type="text"
                                value={editTest.input}
                                placeholder="Input"
                                onChange={(e) =>
                                  setEditTest({ ...editTest, input: e.target.value })
                                }
                                className="border p-1 rounded-md w-full mb-1 outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Output"
                                value={editTest.output}
                                onChange={(e) =>
                                  setEditTest({ ...editTest, output: e.target.value })
                                }
                                className="border p-1 rounded-md w-full outline-none"
                              />
                              <button
                                onClick={handleUpdate}
                                className="mt-1 py-1 rounded-lg transition cursor-pointer hover:scale-110 "
                              >
                                <FiSave size={25} />
                              </button>
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-semibold text-white">Input:</h3>
                              <p className="text-gray-600">{test.input}</p>
                              <h3 className="font-semibold text-white">Output:</h3>
                              <p className="text-gray-600">{test.output}</p>
                            </div>
                          )}
                          <div className="flex gap-1">
                            {editIndex === index ? null : (
                              <>
                                <button
                                  onClick={() => handleEdit(index)}
                                  className="p-2 text-white rounded-lg hover:scale-125 transition cursor-pointer"
                                >
                                  <GrFormEdit size={25} />
                                </button>
                                <button
                                  onClick={() => handleDelete(test.id)} // ✅ Delete by ID
                                  className="p-2 text-white rounded-lg hover:scale-125 transition cursor-pointer"
                                >
                                  <MdDelete size={20} />
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>

            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Compiler;
