// components/admin/QuestionModal.js
import React, { useState, useEffect } from 'react';
import EditQuestionTab from './EditQuestionTab';
import PreviewQuestionTab from './PreviewQuestionTab';

const QuestionModal = ({ isModalOpen, setIsModalOpen, newQuestion, setNewQuestion, handleSubmit }) => {
  const [activeTab, setActiveTab] = useState('edit');

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' }
  ];

  const renderMathJax = () => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      const katexLink = document.createElement('link');
      katexLink.rel = 'stylesheet';
      katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(katexLink);

      const mathjaxScript = document.createElement('script');
      mathjaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      mathjaxScript.async = true;
      document.head.appendChild(mathjaxScript);

      return () => {
        document.head.removeChild(katexLink);
        document.head.removeChild(mathjaxScript);
      };
    }
  }, [isModalOpen]);

  // Function to add a new test case
  const addTestCase = () => {
    const newTestCase = {
      input: '',
      output: '',
      explanation: '',
      timeLimit: 1000,
      memoryLimit: 256
    };

    setNewQuestion(prev => ({
      ...prev,
      testCases: [...(prev.testCases || []), newTestCase]
    }));
  };

  // Function to update a test case
  const updateTestCase = (index, field, value) => {
    setNewQuestion(prev => ({
      ...prev,
      testCases: prev.testCases.map((testCase, i) => 
        i === index ? { ...testCase, [field]: value } : testCase
      )
    }));
  };

  // Function to remove a test case
  const removeTestCase = (index) => {
    setNewQuestion(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-auto md:h-[90vh] flex flex-col my-4 md:my-0">
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">Add New Question</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              className={`flex-1 flex items-center justify-center px-2 md:px-6 py-3 md:py-4 border-b-2 font-medium text-sm ${activeTab === 'edit'
                ? 'border-amber-500 dark:border-indigo-400 text-amber-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              onClick={() => setActiveTab('edit')}
            >
              <span className="mr-2">📝</span>
              <span className="hidden sm:inline">Edit Question</span>
              <span className="sm:hidden">Edit</span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center px-2 md:px-6 py-3 md:py-4 border-b-2 font-medium text-sm ${activeTab === 'preview'
                ? 'border-amber-500 dark:border-indigo-400 text-amber-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              onClick={() => {
                setActiveTab('preview');
                setTimeout(renderMathJax, 100);
              }}
            >
              <span className="mr-2">👁️</span>
              <span className="hidden sm:inline">Preview</span>
              <span className="sm:hidden">Preview</span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center px-2 md:px-6 py-3 md:py-4 border-b-2 font-medium text-sm ${activeTab === 'testcases'
                ? 'border-amber-500 dark:border-indigo-400 text-amber-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              onClick={() => setActiveTab('testcases')}
            >
              <span className="mr-2">🧪</span>
              <span className="hidden sm:inline">Test Cases</span>
              <span className="sm:hidden">Tests</span>
            </button>
          </nav>
        </div>

        <div className="flex-1 overflow-auto p-3 md:p-6">
          {activeTab === 'edit' ? (
            <EditQuestionTab 
              newQuestion={newQuestion} 
              setNewQuestion={setNewQuestion}
              languageOptions={languageOptions}
            />
          ) : activeTab === 'preview' ? (
            <PreviewQuestionTab 
              newQuestion={newQuestion}
              languageOptions={languageOptions}
              renderMathJax={renderMathJax}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Test Cases</h3>
                <button
                  onClick={addTestCase}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
                >
                  <span className="mr-2">+</span> Add Test Case
                </button>
              </div>

              {(!newQuestion.testCases || newQuestion.testCases.length === 0) ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No test cases added yet. Click "Add Test Case" to add one.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {newQuestion.testCases.map((testCase, index) => (
                    <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-800 dark:text-white">Test Case #{index + 1}</h4>
                        <button
                          onClick={() => removeTestCase(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={newQuestion.testCases.length === 1}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Input
                          </label>
                          <textarea
                            value={testCase.input}
                            onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                            placeholder="Enter input data (e.g., '5 10' or JSON)"
                            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 dark:focus:ring-indigo-500 focus:border-amber-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expected Output
                          </label>
                          <textarea
                            value={testCase.output}
                            onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                            placeholder="Enter expected output"
                            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 dark:focus:ring-indigo-500 focus:border-amber-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Explanation (Optional)
                        </label>
                        <textarea
                          value={testCase.explanation}
                          onChange={(e) => updateTestCase(index, 'explanation', e.target.value)}
                          placeholder="Explain what this test case validates"
                          className="w-full h-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 dark:focus:ring-indigo-500 focus:border-amber-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Time Limit (ms)
                          </label>
                          <input
                            type="number"
                            min="100"
                            step="100"
                            value={testCase.timeLimit}
                            onChange={(e) => updateTestCase(index, 'timeLimit', parseInt(e.target.value) || 1000)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 dark:focus:ring-indigo-500 focus:border-amber-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Memory Limit (MB)
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={testCase.memoryLimit}
                            onChange={(e) => updateTestCase(index, 'memoryLimit', parseInt(e.target.value) || 256)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 dark:focus:ring-indigo-500 focus:border-amber-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!newQuestion.quesId || !newQuestion.title || !newQuestion.description || newQuestion.languages.length === 0}
            className="px-3 md:px-4 py-2 bg-amber-500 dark:bg-indigo-600 border border-transparent rounded-md text-xs md:text-sm font-medium text-white hover:bg-amber-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;