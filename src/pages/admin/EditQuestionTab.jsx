// components/admin/EditQuestionTab.js
import React from 'react';

const EditQuestionTab = ({ newQuestion, setNewQuestion, languageOptions }) => {
  const handleInputChange = (field, value) => {
    setNewQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCodeChange = (language, value) => {
    setNewQuestion(prev => ({
      ...prev,
      code: {
        ...prev.code,
        [language]: value
      }
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag && !newQuestion.tags.includes(tag)) {
        setNewQuestion(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setNewQuestion(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleLanguageToggle = (language) => {
    setNewQuestion(prev => {
      const currentLanguages = prev.languages || [];
      if (currentLanguages.includes(language)) {
        return {
          ...prev,
          languages: currentLanguages.filter(lang => lang !== language)
        };
      } else {
        return {
          ...prev,
          languages: [...currentLanguages, language]
        };
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="space-y-3 md:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Title *</label>
          <input
            type="text"
            value={newQuestion.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
            placeholder="Enter question title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
          <textarea
            value={newQuestion.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            placeholder="Enter question description..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
          <div className="flex flex-wrap gap-1 md:gap-2 mb-2">
            {newQuestion.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-indigo-900 text-amber-800 dark:text-indigo-200">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 md:ml-2 text-amber-600 dark:text-indigo-400 hover:text-amber-800 dark:hover:text-indigo-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            onKeyDown={handleTagInput}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
            placeholder="Type tag and press Enter or comma"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Press Enter or comma to add tags</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty *</label>
          <select
            value={newQuestion.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supported Languages *</label>
          <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
            {languageOptions.map(lang => (
              <button
                key={lang.value}
                type="button"
                onClick={() => handleLanguageToggle(lang.value)}
                className={`flex items-center px-2 md:px-3 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${newQuestion.languages.includes(lang.value)
                  ? 'bg-amber-100 dark:bg-indigo-900 text-amber-800 dark:text-indigo-200 border-2 border-amber-300 dark:border-indigo-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                <span className="mr-1 md:mr-2">{lang.icon}</span>
                <span className="hidden sm:inline">{lang.label}</span>
                <span className="sm:hidden">{lang.value.substring(0, 2)}</span>
                {newQuestion.languages.includes(lang.value) && <span className="ml-1">✓</span>}
              </button>
            ))}
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Selected: {newQuestion.languages.map(l =>
              languageOptions.find(lo => lo.value === l)?.label || l
            ).join(', ')}
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {languageOptions.map(lang => (
            newQuestion.languages.includes(lang.value) && (
              <div key={lang.value} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4 bg-gray-50 dark:bg-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="mr-1 md:mr-2">{lang.icon}</span>
                  <span className="hidden sm:inline">{lang.label}</span>
                  <span className="sm:hidden">{lang.value}</span> Starter Code
                </label>
                <textarea
                  value={newQuestion.code[lang.value]}
                  onChange={(e) => handleCodeChange(lang.value, e.target.value)}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-gray-900 text-gray-100 font-mono text-sm"
                  placeholder={`Enter ${lang.label} starter code...`}
                />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditQuestionTab;