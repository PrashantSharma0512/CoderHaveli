import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/monokai.css";
import { FaRegCopy } from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";



const MiniCompiler = ({ code, language = "javascript" }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success("Code Copied", {
        position: "top-center",
        autoClose: 1000, // Closes in 2 seconds
      });
    });
  };

  return (
    <div className="relative bg-gray-900 text-white rounded-lg">
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-2 cursor-pointer rounded bg-zinc-400 px-2 py-1 opacity-25 hover:opacity-100"
      >
        <FaRegCopy size={30} />
      </button>
      <pre>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

const CodeDisplay = ({code}) => {
  // console.log("code",code);
  return (
    <div className='w-[100%] bg-[#101828] rounded-lg'>
      <Tabs variant="enclosed" sx={{
        "& .chakra-tabs__tablist": { borderBottom: "" },
        "& .chakra-tabs__tab": { border: "none" }
      }}>
        <TabList>
          <Tab className='cursor-pointer'>JavaScript</Tab>
          <Tab className='cursor-pointer'>Python</Tab>
          <Tab className='cursor-pointer'>Java</Tab>
          <Tab>C++</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MiniCompiler code={code.javascript} language='javascript' />
          </TabPanel>
          <TabPanel>
            <MiniCompiler code={code.python} language='python' />
          </TabPanel>
          <TabPanel>
            <MiniCompiler code={code.java} language='java' />
          </TabPanel>
          <TabPanel>
            <MiniCompiler code={code.cpp} language='cpp' />
          </TabPanel>
        </TabPanels>
      </Tabs>

    </div>
  )
}
export default CodeDisplay;
