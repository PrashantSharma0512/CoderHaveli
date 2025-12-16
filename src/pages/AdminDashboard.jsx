// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/helper/axiosInstance';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for other tabs (you can replace these with actual API calls)
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const { user } = useSelector(state => state.login);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/admin/dashboard');
        setDashboardData(response.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    const fetchSubmissions = async () => {
      try {
        const response = await axiosInstance.get('/admin/submissions');
        setSubmissions(response.data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions");
      }
    }
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get('/admin/questions');
        setQuestions(response.data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions");
      }
    }
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');
        setStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions");
      }
    }

    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
    if (activeTab === 'submissions') {
      fetchSubmissions();
    }
    if (activeTab === 'questions') {
      fetchQuestions();
    }
    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [activeTab]);

  // Dashboard Stats from API
  const dashboardStats = dashboardData ? {
    totalStudents: dashboardData.totalUsers,
    totalQuestions: dashboardData.totalQuestions,
    totalSubmissions: dashboardData.totalSubmissions,
    acceptedSubmissions: dashboardData.acceptedSubmissions,
    successRate: parseFloat(dashboardData.submissionSuccessPercentage) || 0,
    recentSubmissions: dashboardData.RecentSubmission || []
  } : {
    totalStudents: 0,
    totalQuestions: 0,
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    successRate: 0,
    recentSubmissions: []
  };

  // Render different content based on active tab
  const renderContent = () => {
    if (loading && activeTab === 'dashboard') {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading dashboard data...</div>
        </div>
      );
    }

    if (error && activeTab === 'dashboard') {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent stats={dashboardStats} recentSubmissions={dashboardStats.recentSubmissions} />;
      case 'questions':
        return <QuestionsContent questions={questions} setQuestions={setQuestions} />;
      case 'students':
        return <StudentsContent students={students} />;
      case 'submissions':
        return <SubmissionsContent submissions={submissions} />;
      case 'analytics':
        return <AnalyticsContent stats={dashboardStats} submissions={submissions} questions={questions} />;
      case 'upload':
        return <UploadContent />;
      default:
        return <DashboardContent stats={dashboardStats} recentSubmissions={dashboardStats.recentSubmissions} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 dark:bg-gray-800 text-white">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">CoderHaveli <span className="text-amber-400">Admin</span></h2>
            <p className="text-xs text-amber-500">Welcome back, {user?.name || 'Admin'}!</p>
          </div>
          <nav className="p-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'questions', label: 'Manage Questions', icon: '❓' },
              { id: 'students', label: 'Students', icon: '👥' },
              { id: 'submissions', label: 'Submissions', icon: '📝' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'upload', label: 'Upload Content', icon: '📤' }
            ].map(item => (
              <button
                key={item.id}
                className={`w-full flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${activeTab === item.id
                  ? 'bg-amber-600 dark:bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </div>
      </div>
        <div className="container mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Admin Dashboard • Secure Access • Last login: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    </div>
  );
};

// Dashboard Component - Updated to use API data
const DashboardContent = ({ stats, recentSubmissions }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
      Admin <span className="text-amber-600 dark:text-indigo-400">Dashboard</span>
    </h1>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="text-3xl mr-4">👥</div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Students</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalStudents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="text-3xl mr-4">❓</div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Questions</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalQuestions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="text-3xl mr-4">📝</div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Submissions</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalSubmissions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="text-3xl mr-4">✅</div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Success Rate</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.successRate}%</p>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Submissions */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Submissions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {recentSubmissions.map(sub => (
              <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sub.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{sub.question}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">{sub.codelanguage}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sub.status === 'Accepted'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Questions Component with Modal
const QuestionsContent = ({ questions, setQuestions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [newQuestion, setNewQuestion] = useState({
    quesId: '',
    title: '',
    description: '',
    languages: ['javascript', 'python', 'java', 'cpp'],
    difficulty: 'easy',
    tags: [],
    problemExample: '',
    code: {
      javascript: '',
      python: '',
      java: '',
      cpp: ''
    }
  });

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' }
  ];

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

  // Handle language selection (toggle in array)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = {
      _id: Date.now().toString(),
      quesId: newQuestion.quesId,
      quesName: newQuestion.title,
      quesDesc: newQuestion.description,
      languages: newQuestion.languages,
      difficulty: newQuestion.difficulty,
      tags: newQuestion.tags,
      problemExample: newQuestion.problemExample || `example_${Date.now()}`,
      code: newQuestion.code,
      createdAt: new Date().toISOString()
    };
    setQuestions(prev => [...prev, question]);
    setIsModalOpen(false);
    setNewQuestion({
      quesId: '',
      title: '',
      description: '',
      languages: ['javascript', 'python', 'java', 'cpp'],
      difficulty: 'easy',
      tags: [],
      problemExample: '',
      code: {
        javascript: '',
        python: '',
        java: '',
        cpp: ''
      }
    });
  };

  const renderMathJax = () => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  };

  useEffect(() => {
    // Load KaTeX CSS and MathJax
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
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Manage <span className="text-amber-600 dark:text-indigo-400">Questions</span>
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Add New Question
        </button>
      </div>

      {/* Questions Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Question</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                <button
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${activeTab === 'edit'
                    ? 'border-amber-500 dark:border-indigo-400 text-amber-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  onClick={() => setActiveTab('edit')}
                >
                  <span className="mr-2">📝</span>
                  Edit Question
                </button>
                <button
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${activeTab === 'preview'
                    ? 'border-amber-500 dark:border-indigo-400 text-amber-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  onClick={() => {
                    setActiveTab('preview');
                    setTimeout(renderMathJax, 100);
                  }}
                >
                  <span className="mr-2">👁️</span>
                  Preview
                </button>
              </nav>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {activeTab === 'edit' ? (
                <div className="grid grid-cols-2 gap-6 h-full">
                  {/* Left Column - Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question ID *</label>
                        <input
                          type="text"
                          value={newQuestion.quesId}
                          onChange={(e) => handleInputChange('quesId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., Q001"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Example ID</label>
                        <input
                          type="text"
                          value={newQuestion.problemExample}
                          onChange={(e) => handleInputChange('problemExample', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., 507f1f77bcf86cd799439081"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Title *</label>
                      <input
                        type="text"
                        value={newQuestion.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter question title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Supports LaTeX) *</label>
                      <textarea
                        value={newQuestion.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows="8"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        placeholder="Enter question description with LaTeX math expressions..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newQuestion.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-indigo-900 text-amber-800 dark:text-indigo-200">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-amber-600 dark:text-indigo-400 hover:text-amber-800 dark:hover:text-indigo-200"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        onKeyDown={handleTagInput}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Type tag and press Enter or comma"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Press Enter or comma to add tags</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty *</label>
                      <select
                        value={newQuestion.difficulty}
                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column - Code Editors */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supported Languages *</label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {languageOptions.map(lang => (
                          <button
                            key={lang.value}
                            type="button"
                            onClick={() => handleLanguageToggle(lang.value)}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${newQuestion.languages.includes(lang.value)
                              ? 'bg-amber-100 dark:bg-indigo-900 text-amber-800 dark:text-indigo-200 border-2 border-amber-300 dark:border-indigo-700'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                          >
                            <span className="mr-2">{lang.icon}</span>
                            {lang.label}
                            {newQuestion.languages.includes(lang.value) && ' ✓'}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Selected: {newQuestion.languages.map(l =>
                          languageOptions.find(lo => lo.value === l)?.label || l
                        ).join(', ')}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {languageOptions.map(lang => (
                        newQuestion.languages.includes(lang.value) && (
                          <div key={lang.value} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <span className="mr-2">{lang.icon}</span>
                              {lang.label} Starter Code
                            </label>
                            <textarea
                              value={newQuestion.code[lang.value]}
                              onChange={(e) => handleCodeChange(lang.value, e.target.value)}
                              rows="8"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-gray-900 text-gray-100 font-mono text-sm"
                              placeholder={`Enter ${lang.label} starter code...`}
                            />
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Preview Tab */
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          {newQuestion.quesId ? `[${newQuestion.quesId}] ` : ''}
                          {newQuestion.title || 'Question Title'}
                        </h3>
                        {newQuestion.problemExample && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Example ID: {newQuestion.problemExample}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${newQuestion.difficulty === 'easy'
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
                            <span key={lang} className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-amber-100 dark:bg-indigo-900 text-amber-800 dark:text-indigo-200">
                              {langInfo?.icon} {langInfo?.label || lang}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {newQuestion.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {newQuestion.tags.map(tag => (
                            <span key={tag} className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="prose max-w-none dark:prose-invert">
                      <div id="math-preview" className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
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

                      <div className="space-y-4">
                        {languageOptions.map(lang => (
                          newQuestion.languages.includes(lang.value) && newQuestion.code[lang.value] && (
                            <div key={lang.value} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                              <div className="bg-gray-800 dark:bg-gray-900 text-white px-4 py-2 flex items-center">
                                <span className="mr-2">{lang.icon}</span>
                                <span className="font-medium">{lang.label} Starter Code</span>
                              </div>
                              <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 overflow-x-auto text-sm">
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
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Refresh Math Rendering
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newQuestion.quesId || !newQuestion.title || !newQuestion.description || newQuestion.languages.length === 0}
                className="px-4 py-2 bg-amber-500 dark:bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-amber-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Languages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {questions.map(question => (
                <tr key={question._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{question.quesId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{question.quesName}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {question.languages && question.languages.map(lang => (
                        <span key={lang} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-amber-100 dark:bg-indigo-900 text-amber-800 dark:text-indigo-200">
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${question.difficulty === 'easy'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : question.difficulty === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {question.tags && question.tags.map(tag => (
                        <span key={tag} className="inline-flex px-2 py-1 text-xs rounded bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-amber-600 dark:text-indigo-400 hover:text-amber-800 dark:hover:text-indigo-300 mr-4">Edit</button>
                    <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Students Component
const StudentsContent = ({ students }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
      Registered <span className="text-amber-600 dark:text-indigo-400">Students</span>
    </h1>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Registration Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Submissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Solved Questions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {students.map(student => (
              <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {new Date(student.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{student.totalSubmissions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{student.totalQuestionsAttempted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Submissions Component
const SubmissionsContent = ({ submissions }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
      All <span className="text-amber-600 dark:text-indigo-400">Submissions</span>
    </h1>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Execution Time</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {submissions.map(submission => (
              <tr key={submission._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{submission.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{submission.question}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{submission.codelanguage}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${submission.status === 'Accepted'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                    {submission.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {new Date(submission.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{submission.executionTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Analytics Component
const AnalyticsContent = ({ stats, submissions, questions }) => {
  const languageStats = submissions.reduce((acc, sub) => {
    const lang = sub.codelanguage || 'unknown';
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});

  const difficultyStats = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Platform <span className="text-amber-600 dark:text-indigo-400">Analytics</span>
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Submission Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Accepted</span>
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {submissions.filter(s => s.status === 'Accepted').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rejected</span>
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {submissions.filter(s => s.status !== 'Accepted').length}
              </span>
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Language Distribution</h3>
          <div className="space-y-3">
            {Object.entries(languageStats).map(([lang, count]) => (
              <div key={lang} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{lang}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Question Difficulty</h3>
          <div className="space-y-3">
            {Object.entries(difficultyStats).map(([difficulty, count]) => (
              <div key={difficulty} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{difficulty}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Overall Performance</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-600 dark:text-indigo-400 mb-2">{stats.successRate}%</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Upload Component
const UploadContent = () => {
  const [activeUploadTab, setActiveUploadTab] = useState('course');
  const [uploadData, setUploadData] = useState({
    course: {
      title: '',
      description: '',
      category: '',
      duration: '',
      level: 'beginner'
    },
    video: {
      title: '',
      description: '',
      course: '',
      videoUrl: '',
      duration: ''
    }
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    alert(`${activeUploadTab.charAt(0).toUpperCase() + activeUploadTab.slice(1)} uploaded successfully!`);
  };

  const handleInputChange = (section, field, value) => {
    setUploadData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleReset = () => {
    setUploadData({
      course: {
        title: '',
        description: '',
        category: '',
        duration: '',
        level: 'beginner'
      },
      video: {
        title: '',
        description: '',
        course: '',
        videoUrl: '',
        duration: ''
      }
    });
  };

  const renderUploadForm = () => {
    switch (activeUploadTab) {
      case 'course':
        return (
          <div className="">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
              <input
                type="text"
                value={uploadData.course.title}
                onChange={(e) => handleInputChange('course', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter course title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={uploadData.course.description}
                onChange={(e) => handleInputChange('course', 'description', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter course description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  value={uploadData.course.category}
                  onChange={(e) => handleInputChange('course', 'category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Web Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                <input
                  type="text"
                  value={uploadData.course.duration}
                  onChange={(e) => handleInputChange('course', 'duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 8 weeks"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
              <select
                value={uploadData.course.level}
                onChange={(e) => handleInputChange('course', 'level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video Title</label>
              <input
                type="text"
                value={uploadData.video.title}
                onChange={(e) => handleInputChange('video', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter video title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={uploadData.video.description}
                onChange={(e) => handleInputChange('video', 'description', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter video description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
                <select
                  value={uploadData.video.course}
                  onChange={(e) => handleInputChange('video', 'course', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a course</option>
                  <option value="web-dev">Web Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="mobile-dev">Mobile Development</option>
                  <option value="machine-learning">Machine Learning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                <input
                  type="text"
                  value={uploadData.video.duration}
                  onChange={(e) => handleInputChange('video', 'duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 15:30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL</label>
              <input
                type="url"
                value={uploadData.video.videoUrl}
                onChange={(e) => handleInputChange('video', 'videoUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Video File</label>
              <input
                type="file"
                accept="video/*"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supported formats: MP4, MOV, AVI, MKV (Max 500MB)</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Upload <span className="text-amber-600 dark:text-indigo-400">Content</span>
      </h1>

      {/* Upload Type Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {[
              { id: 'course', label: 'Course Upload', icon: '📚' },
              { id: 'video', label: 'Video Upload', icon: '🎥' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${activeUploadTab === tab.id
                  ? 'border-amber-500 dark:border-indigo-400 text-amber-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                onClick={() => setActiveUploadTab(tab.id)}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Upload Form */}
        <div className="p-6">
          <form onSubmit={handleUploadSubmit}>
            {renderUploadForm()}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 dark:bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-amber-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500"
              >
                Upload {activeUploadTab.charAt(0).toUpperCase() + activeUploadTab.slice(1)}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📚</div>
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Courses Created</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🎥</div>
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Videos Uploaded</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;