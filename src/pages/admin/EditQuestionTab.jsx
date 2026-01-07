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

  // Hints related functions
  const addHint = () => {
    setNewQuestion(prev => ({
      ...prev,
      hints: [...(prev.hints || []), '']
    }));
  };

  const updateHint = (index, value) => {
    setNewQuestion(prev => {
      const updatedHints = [...(prev.hints || [])];
      updatedHints[index] = value;
      return {
        ...prev,
        hints: updatedHints
      };
    });
  };

  const removeHint = (index) => {
    setNewQuestion(prev => {
      const updatedHints = [...(prev.hints || [])];
      updatedHints.splice(index, 1);
      return {
        ...prev,
        hints: updatedHints
      };
    });
  };

  const moveHintUp = (index) => {
    if (index === 0) return;
    setNewQuestion(prev => {
      const updatedHints = [...(prev.hints || [])];
      const temp = updatedHints[index];
      updatedHints[index] = updatedHints[index - 1];
      updatedHints[index - 1] = temp;
      return {
        ...prev,
        hints: updatedHints
      };
    });
  };

  const moveHintDown = (index) => {
    setNewQuestion(prev => {
      const updatedHints = [...(prev.hints || [])];
      if (index >= updatedHints.length - 1) return prev;
      const temp = updatedHints[index];
      updatedHints[index] = updatedHints[index + 1];
      updatedHints[index + 1] = temp;
      return {
        ...prev,
        hints: updatedHints
      };
    });
  };

  // Constraints related functions
  const addConstraint = () => {
    setNewQuestion(prev => ({
      ...prev,
      constraints: [...(prev.constraints || []), '']
    }));
  };

  const updateConstraint = (index, value) => {
    setNewQuestion(prev => {
      const updatedConstraints = [...(prev.constraints || [])];
      updatedConstraints[index] = value;
      return {
        ...prev,
        constraints: updatedConstraints
      };
    });
  };

  const removeConstraint = (index) => {
    setNewQuestion(prev => {
      const updatedConstraints = [...(prev.constraints || [])];
      updatedConstraints.splice(index, 1);
      return {
        ...prev,
        constraints: updatedConstraints
      };
    });
  };

  const moveConstraintUp = (index) => {
    if (index === 0) return;
    setNewQuestion(prev => {
      const updatedConstraints = [...(prev.constraints || [])];
      const temp = updatedConstraints[index];
      updatedConstraints[index] = updatedConstraints[index - 1];
      updatedConstraints[index - 1] = temp;
      return {
        ...prev,
        constraints: updatedConstraints
      };
    });
  };

  const moveConstraintDown = (index) => {
    setNewQuestion(prev => {
      const updatedConstraints = [...(prev.constraints || [])];
      if (index >= updatedConstraints.length - 1) return prev;
      const temp = updatedConstraints[index];
      updatedConstraints[index] = updatedConstraints[index + 1];
      updatedConstraints[index + 1] = temp;
      return {
        ...prev,
        constraints: updatedConstraints
      };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="space-y-3 md:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Id*</label>
          <input
            type="text"
            value={newQuestion.quesId}
            onChange={(e) => handleInputChange('quesId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
            placeholder="Enter question Id"
            required
          />
        </div>
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

        {/* Constraints Section */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Constraints *
            </label>
            <button
              type="button"
              onClick={addConstraint}
              className="px-3 py-1 text-sm bg-amber-500 dark:bg-indigo-600 text-white rounded-md hover:bg-amber-600 dark:hover:bg-indigo-700 transition-colors"
            >
              + Add Constraint
            </button>
          </div>

          <div className="space-y-3">
            {(newQuestion.constraints || []).map((constraint, index) => (
              <div key={index} className="relative group">
                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-1 mt-2">
                    <button
                      type="button"
                      onClick={() => moveConstraintUp(index)}
                      disabled={index === 0}
                      className={`px-2 py-1 text-xs ${index === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400'}`}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveConstraintDown(index)}
                      disabled={index === (newQuestion.constraints || []).length - 1}
                      className={`px-2 py-1 text-xs ${index === (newQuestion.constraints || []).length - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400'}`}
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Constraint {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeConstraint(index)}
                        className="text-gray-400 hover:text-red-500 text-sm"
                        title="Remove constraint"
                      >
                        ×
                      </button>
                    </div>
                    <input
                      type="text"
                      value={constraint}
                      onChange={(e) => updateConstraint(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder={`Enter constraint ${index + 1}...`}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {(newQuestion.constraints || []).length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No constraints added yet. Click "Add Constraint" to add constraints for this question.
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Add constraints that define the problem boundaries (e.g., "1 ≤ n ≤ 10^5", "str contains only lowercase letters")
          </p>
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
      </div>

      <div className="space-y-3 md:space-y-4">
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

        {/* Hints Section */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hints
            </label>
            <button
              type="button"
              onClick={addHint}
              className="px-3 py-1 text-sm bg-amber-500 dark:bg-indigo-600 text-white rounded-md hover:bg-amber-600 dark:hover:bg-indigo-700 transition-colors"
            >
              + Add Hint
            </button>
          </div>

          <div className="space-y-3">
            {(newQuestion.hints || []).map((hint, index) => (
              <div key={index} className="relative group">
                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-1 mt-2">
                    <button
                      type="button"
                      onClick={() => moveHintUp(index)}
                      disabled={index === 0}
                      className={`px-2 py-1 text-xs ${index === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400'}`}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveHintDown(index)}
                      disabled={index === (newQuestion.hints || []).length - 1}
                      className={`px-2 py-1 text-xs ${index === (newQuestion.hints || []).length - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400'}`}
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Hint {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeHint(index)}
                        className="text-gray-400 hover:text-red-500 text-sm"
                        title="Remove hint"
                      >
                        ×
                      </button>
                    </div>
                    <textarea
                      value={hint}
                      onChange={(e) => updateHint(index, e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder={`Enter hint ${index + 1}...`}
                    />
                  </div>
                </div>
              </div>
            ))}

            {(newQuestion.hints || []).length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No hints added yet. Click "Add Hint" to add helpful hints for this question.
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Add progressive hints to help users solve the problem. Hints are shown in the order they appear.
          </p>
        </div>

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