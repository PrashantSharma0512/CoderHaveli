// components/admin/PreviewQuestionTab.js
import React from 'react';

const PreviewQuestionTab = ({ newQuestion, languageOptions, renderMathJax }) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
              {newQuestion.quesId ? `[${newQuestion.quesId}] ` : ''}
              {newQuestion.title || 'Question Title'}
            </h3>
            {newQuestion.problemExample && (
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Example ID: {newQuestion.problemExample}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-1 md:gap-2">
            <span className={`inline-flex px-2 md:px-3 py-1 text-xs md:text-sm font-semibold rounded-full ${newQuestion.difficulty === 'easy'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : newQuestion.difficulty === 'medium'
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
              {newQuestion.difficulty || 'Difficulty'}
            </span>
            {newQuestion.languages && newQuestion.languages.map(lang => {
              const langInfo = languageOptions.find(l => l.value === lang);
              return (
                <span key={lang} className="inline-flex items-center px-2 md:px-3 py-1 text-xs md:text-sm font-semibold rounded-full bg-amber-100 dark:bg-indigo-900 text-amber-800 dark:text-indigo-200">
                  <span className="mr-1">{langInfo?.icon}</span>
                  <span className="hidden sm:inline">{langInfo?.label || lang}</span>
                  <span className="sm:hidden">{lang.substring(0, 2)}</span>
                </span>
              );
            })}
          </div>
        </div>

        {newQuestion.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 md:gap-2">
              {newQuestion.tags.map(tag => (
                <span key={tag} className="inline-flex px-2 md:px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="prose max-w-none dark:prose-invert prose-sm md:prose-base">
          <div id="math-preview" className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 md:mb-6">
            {newQuestion.description ? (
              <div dangerouslySetInnerHTML={{
                __html: newQuestion.description
                  .replace(/\\\(/g, '\\( ')
                  .replace(/\\\)/g, ' \\)')
                  .replace(/\$\$(.*?)\$\$/g, '\\[$1\\]')
              }}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No description provided</p>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
            {languageOptions.map(lang => (
              newQuestion.languages.includes(lang.value) && newQuestion.code[lang.value] && (
                <div key={lang.value} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 dark:bg-gray-900 text-white px-3 md:px-4 py-2 flex items-center">
                    <span className="mr-2">{lang.icon}</span>
                    <span className="font-medium text-sm md:text-base">{lang.label} Starter Code</span>
                  </div>
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-3 md:p-4 overflow-x-auto text-xs md:text-sm">
                    <code>{newQuestion.code[lang.value]}</code>
                  </pre>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={renderMathJax}
        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors"
      >
        Refresh Math Rendering
      </button>
    </div>
  );
};

export default PreviewQuestionTab;