// components/ApproachesContent.js
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Code, Play, Copy, Check, 
  ChevronUp, ChevronDown, Eye, EyeOff, Search,
  Youtube, Clock, HardDrive
} from 'lucide-react';

const languageOptions = [
  { value: 'javascript', label: 'JavaScript', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'python', label: 'Python', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'java', label: 'Java', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  { value: 'cpp', label: 'C++', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
];

const approachTypeOptions = [
  { value: 'Brute Force', label: 'Brute Force', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
  { value: 'Optimized', label: 'Optimized', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: 'Improved', label: 'Improved', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'Alternative', label: 'Alternative', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { value: 'Recursive', label: 'Recursive', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
];

const ApproachesContent = ({ questions, approaches, setApproaches }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingApproach, setEditingApproach] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [formData, setFormData] = useState({
    quesId: '',
    approachName: '',
    approachDesc: '',
    approachType: 'Optimized',
    code: {
      javascript: '',
      python: '',
      java: '',
      cpp: '',
    },
    time_complexity: 'O(n)',
    space_complexity: 'O(1)',
    videoUrl: '',
  });

  // Filter approaches based on search and selected question
  const filteredApproaches = approaches?.filter(approach => {
    const matchesSearch = approach.approachName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approach.approachDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuestion = !selectedQuestion || approach.quesId === selectedQuestion;
    return matchesSearch && matchesQuestion;
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal) {
      setFormData({
        quesId: '',
        approachName: '',
        approachDesc: '',
        approachType: 'Optimized',
        code: {
          javascript: '',
          python: '',
          java: '',
          cpp: '',
        },
        time_complexity: 'O(n)',
        space_complexity: 'O(1)',
        videoUrl: '',
      });
      setEditingApproach(null);
    }
  }, [showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newApproach = {
      _id: editingApproach?._id || `approach_${Date.now()}`,
      ...formData,
      order: editingApproach?.order || (approaches?.length || 0) + 1,
      createdAt: editingApproach?.createdAt || new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };

    if (editingApproach) {
      setApproaches(prev => 
        prev.map(approach => 
          approach._id === editingApproach._id ? newApproach : approach
        )
      );
    } else {
      setApproaches(prev => [...prev, newApproach]);
    }

    setShowModal(false);
  };

  const handleEdit = (approach) => {
    setEditingApproach(approach);
    setFormData({
      quesId: approach.quesId,
      approachName: approach.approachName,
      approachDesc: approach.approachDesc,
      approachType: approach.approachType,
      code: { ...approach.code },
      time_complexity: approach.time_complexity,
      space_complexity: approach.space_complexity,
      videoUrl: approach.videoUrl || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this approach?')) {
      setApproaches(prev => prev.filter(approach => approach._id !== id));
    }
  };

  const handleMove = (index, direction) => {
    const newApproaches = [...approaches];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newApproaches.length) {
      [newApproaches[index], newApproaches[newIndex]] = 
      [newApproaches[newIndex], newApproaches[index]];
      setApproaches(newApproaches);
    }
  };

  const handleCopyCode = (code, language) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(`${language}_${Date.now()}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getQuestionTitle = (quesId) => {
    const question = questions?.find(q => q.id === quesId);
    return question ? question.title : `Question ${quesId}`;
  };

  const ApproachCard = ({ approach, index }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                #{approach.order}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${approachTypeOptions.find(t => t.value === approach.approachType)?.color}`}>
                {approach.approachType}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                Q{approach.quesId}: {getQuestionTitle(approach.quesId)}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {approach.approachName}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {approach.approachDesc}
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Time: {approach.time_complexity}</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                <span>Space: {approach.space_complexity}</span>
              </div>
              {approach.videoUrl && (
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <a 
                    href={approach.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Video Tutorial
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMove(index, 'up')}
              disabled={index === 0}
              className={`p-2 rounded ${index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleMove(index, 'down')}
              disabled={index === approaches.length - 1}
              className={`p-2 rounded ${index === approaches.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {expanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleEdit(approach)}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded text-blue-600 dark:text-blue-400"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(approach._id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                Code Implementation
              </h4>
              
              {/* Language Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setSelectedLanguage(lang.value)}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      selectedLanguage === lang.value
                        ? `${lang.color} border-t-2 border-l-2 border-r-2 border-gray-300 dark:border-gray-600`
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Code Display */}
              {approach.code[selectedLanguage] && (
                <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center bg-gray-800 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-mono text-gray-300">
                        {languageOptions.find(l => l.value === selectedLanguage)?.label}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(approach.code[selectedLanguage], selectedLanguage)}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300"
                    >
                      {copiedCode?.startsWith(selectedLanguage) ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm text-gray-100">
                    <code>{approach.code[selectedLanguage]}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Approaches Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Add, edit, and organize problem-solving approaches with multiple language implementations
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Approach
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search approaches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Questions</option>
            {questions?.map(q => (
              <option key={q.id} value={q.id}>
                Q{q.id}: {q.title}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span>
              Showing {filteredApproaches?.length || 0} of {approaches?.length || 0} approaches
            </span>
          </div>
        </div>
      </div>

      {/* Approaches List */}
      <div className="space-y-4">
        {filteredApproaches?.length > 0 ? (
          filteredApproaches.map((approach, index) => (
            <ApproachCard 
              key={approach._id} 
              approach={approach} 
              index={approaches.findIndex(a => a._id === approach._id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Code className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              No approaches found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedQuestion 
                ? 'Try changing your search criteria' 
                : 'Get started by adding your first approach'}
            </p>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Approach */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {editingApproach ? 'Edit Approach' : 'Add New Approach'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Question *
                    </label>
                    <select
                      required
                      value={formData.quesId}
                      onChange={(e) => setFormData({...formData, quesId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a question</option>
                      {questions?.map(q => (
                        <option key={q.id} value={q.id}>
                          Q{q.id}: {q.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Approach Type *
                    </label>
                    <select
                      required
                      value={formData.approachType}
                      onChange={(e) => setFormData({...formData, approachType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {approachTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Approach Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.approachName}
                      onChange={(e) => setFormData({...formData, approachName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Reverse String - Two Pointer Approach"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.approachDesc}
                      onChange={(e) => setFormData({...formData, approachDesc: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the approach, its advantages, and when to use it..."
                    />
                  </div>
                </div>

                {/* Complexity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time Complexity *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.time_complexity}
                      onChange={(e) => setFormData({...formData, time_complexity: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., O(n), O(n log n), O(1)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Space Complexity *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.space_complexity}
                      onChange={(e) => setFormData({...formData, space_complexity: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., O(1), O(n), O(n^2)"
                    />
                  </div>
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Video Tutorial URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Use YouTube embed URLs (starts with https://www.youtube.com/embed/)
                  </p>
                </div>

                {/* Code Editors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Code Implementation
                  </label>
                  <div className="space-y-4">
                    {languageOptions.map(lang => (
                      <div key={lang.value} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${lang.color}`}>
                            {lang.label}
                          </span>
                        </div>
                        <textarea
                          value={formData.code[lang.value]}
                          onChange={(e) => setFormData({
                            ...formData,
                            code: {
                              ...formData.code,
                              [lang.value]: e.target.value
                            }
                          })}
                          rows="6"
                          className="w-full px-4 py-3 bg-transparent font-mono text-sm focus:outline-none resize-y"
                          placeholder={`Enter ${lang.label} code here...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingApproach ? 'Update Approach' : 'Add Approach'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproachesContent;