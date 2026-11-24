import React, { useState, useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/monokai.css";
import { FaRegCopy, FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";

const LANGUAGE_LABELS = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
};

const MiniCompiler = ({ code, language = "javascript" }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      delete codeRef.current.dataset.highlighted;
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <pre className="m-0 p-4 font-mono text-sm leading-relaxed overflow-x-auto text-gray-100 bg-[#0d1117] rounded-b-lg">
      <code ref={codeRef} className={`language-${language}`}>
        {code || "// No code available for this language"}
      </code>
    </pre>
  );
};

const CodeDisplay = ({ code, language = "python" }) => {
  const [copied, setCopied] = useState(false);

  // Normalize code input: handle both object { javascript, python, ... } and raw string
  const isMultiLang = code && typeof code === "object" && !Array.isArray(code);

  const availableLangs = isMultiLang
    ? Object.keys(code).filter((k) => typeof code[k] === "string" && code[k].trim().length > 0)
    : [];

  const defaultLang = isMultiLang
    ? (code.python ? "python" : (code.javascript ? "javascript" : (availableLangs[0] || "python")))
    : (language || "python");

  const [activeLang, setActiveLang] = useState(defaultLang);

  useEffect(() => {
    if (isMultiLang && !code[activeLang] && availableLangs.length > 0) {
      setActiveLang(availableLangs[0]);
    }
  }, [code, isMultiLang, activeLang, availableLangs]);

  const currentCode = isMultiLang ? (code[activeLang] || "") : (typeof code === "string" ? code : "");

  const copyToClipboard = () => {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode).then(() => {
      setCopied(true);
      toast.success("Code copied to clipboard!", {
        duration: 2000,
        position: "top-center",
        style: {
          background: "#1e293b",
          color: "#f8fafc",
          border: "1px solid #334155",
        },
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const displayLangs = isMultiLang && availableLangs.length > 0 ? availableLangs : ["javascript", "python", "java", "cpp"];

  return (
    <div className="w-full bg-[#161b22] border border-gray-700/60 rounded-xl overflow-hidden shadow-lg my-3">
      {/* Header bar with Language Tabs and Copy Button */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0d1117] border-b border-gray-800">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          {isMultiLang ? (
            displayLangs.map((langKey) => {
              const isActive = activeLang === langKey;
              return (
                <button
                  key={langKey}
                  type="button"
                  onClick={() => setActiveLang(langKey)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
                  }`}
                >
                  {LANGUAGE_LABELS[langKey] || langKey.toUpperCase()}
                </button>
              );
            })
          ) : (
            <span className="px-3 py-1 text-xs font-semibold text-amber-400 bg-amber-500/10 rounded-md border border-amber-500/30">
              {LANGUAGE_LABELS[language] || language.toUpperCase()}
            </span>
          )}
        </div>

        <button
          onClick={copyToClipboard}
          type="button"
          aria-label="Copy code"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors cursor-pointer border border-gray-700"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <FaCheck className="text-emerald-400" size={13} />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <FaRegCopy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <MiniCompiler code={currentCode} language={activeLang} />
    </div>
  );
};

export default CodeDisplay;
