// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/helper/axiosInstance';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for other tabs (you can replace these with actual API calls)
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);

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

    if (activeTab === 'dashboard') {
      fetchDashboardData();
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
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
        </div>
      );
    }

    if (error && activeTab === 'dashboard') {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">CoderHaveli Admin</h2>
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
                ? 'bg-blue-600 text-white'
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
  );
};

// Dashboard Component - Updated to use API data
const DashboardContent = ({ stats, recentSubmissions }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="text-3xl mr-4">👥</div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="text-3xl mr-4">❓</div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Total Questions</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalQuestions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="text-3xl mr-4">📝</div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Total Submissions</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalSubmissions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="text-3xl mr-4">✅</div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Success Rate</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.successRate}%</p>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Submissions */}
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Recent Submissions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentSubmissions.map(sub => (
              <tr key={sub._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.question}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{sub.codelanguage}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sub.status === 'Accepted'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

// Questions Component with Modal (Keep the same as before)
const QuestionsContent = ({ questions, setQuestions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    language: 'javascript',
    difficulty: 'easy',
    code: ''
  });

  const handleInputChange = (field, value) => {
    setNewQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = {
      _id: Date.now().toString(),
      quesId: (questions.length + 1).toString(),
      ...newQuestion,
      createdAt: new Date().toISOString()
    };
    setQuestions(prev => [...prev, question]);
    setIsModalOpen(false);
    setNewQuestion({
      title: '',
      description: '',
      language: 'javascript',
      difficulty: 'easy',
      code: ''
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
        <h1 className="text-3xl font-bold text-gray-800">Manage Questions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Add New Question
        </button>
      </div>

      {/* Questions Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Add New Question</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${activeTab === 'edit'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  onClick={() => setActiveTab('edit')}
                >
                  <span className="mr-2">📝</span>
                  Edit Question
                </button>
                <button
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${activeTab === 'preview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
                      <input
                        type="text"
                        value={newQuestion.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter question title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Supports LaTeX)</label>
                      <textarea
                        value={newQuestion.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows="12"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder="Enter question description with LaTeX math expressions..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select
                          value={newQuestion.language}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                        <select
                          value={newQuestion.difficulty}
                          onChange={(e) => handleInputChange('difficulty', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Starter Code</label>
                      <textarea
                        value={newQuestion.code}
                        onChange={(e) => handleInputChange('code', e.target.value)}
                        rows="8"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder="Enter starter code"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Preview Tab */
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{newQuestion.title || 'Question Title'}</h3>
                  <div className="prose max-w-none">
                    <div id="math-preview" className="text-gray-700 leading-relaxed">
                      {newQuestion.description ? (
                        <div dangerouslySetInnerHTML={{
                          __html: newQuestion.description
                            .replace(/\\\(/g, '\\( ')
                            .replace(/\\\)/g, ' \\)')
                            .replace(/\$\$(.*?)\$\$/g, '\\[$1\\]')
                        }}
                        />
                      ) : (
                        <p className="text-gray-500 italic">No description provided</p>
                      )}
                    </div>

                    {newQuestion.code && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Starter Code:</h4>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          <code>{newQuestion.code}</code>
                        </pre>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${newQuestion.difficulty === 'easy'
                        ? 'bg-green-100 text-green-800'
                        : newQuestion.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {newQuestion.difficulty || 'Difficulty'}
                      </span>
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                        {newQuestion.language || 'Language'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={renderMathJax}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Refresh Math Rendering
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newQuestion.title || !newQuestion.description}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions.map(question => (
                <tr key={question._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{question.quesId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.language}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${question.difficulty === 'easy'
                      ? 'bg-green-100 text-green-800'
                      : question.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
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

// Students Component (Keep the same as before)
const StudentsContent = ({ students }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 mb-8">Registered Students</h1>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Submissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solved Questions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map(student => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(student.registrationDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.totalSubmissions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.solvedQuestions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Submissions Component (Keep the same as before)
const SubmissionsContent = ({ submissions }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 mb-8">All Submissions</h1>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Execution Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map(submission => (
              <tr key={submission._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.questionTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.language}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${submission.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {submission.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(submission.submittedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.executionTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Analytics Component (Keep the same as before)
const AnalyticsContent = ({ stats, submissions, questions }) => {
  const languageStats = submissions.reduce((acc, sub) => {
    acc[sub.language] = (acc[sub.language] || 0) + 1;
    return acc;
  }, {});

  const difficultyStats = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Platform Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Submission Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium">Accepted</span>
              </div>
              <span className="text-sm font-semibold">
                {submissions.filter(s => s.status === 'accepted').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium">Rejected</span>
              </div>
              <span className="text-sm font-semibold">
                {submissions.filter(s => s.status === 'rejected').length}
              </span>
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Language Distribution</h3>
          <div className="space-y-3">
            {Object.entries(languageStats).map(([lang, count]) => (
              <div key={lang} className="flex justify-between items-center">
                <span className="text-sm font-medium">{lang}</span>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Difficulty</h3>
          <div className="space-y-3">
            {Object.entries(difficultyStats).map(([difficulty, count]) => (
              <div key={difficulty} className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{difficulty}</span>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Performance</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.successRate}%</div>
            <p className="text-sm text-gray-500">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Upload Component (Keep the same as before)
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
              <input
                type="text"
                value={uploadData.course.title}
                onChange={(e) => handleInputChange('course', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={uploadData.course.description}
                onChange={(e) => handleInputChange('course', 'description', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={uploadData.course.category}
                  onChange={(e) => handleInputChange('course', 'category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Web Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={uploadData.course.duration}
                  onChange={(e) => handleInputChange('course', 'duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 8 weeks"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={uploadData.course.level}
                onChange={(e) => handleInputChange('course', 'level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
              <input
                type="text"
                value={uploadData.video.title}
                onChange={(e) => handleInputChange('video', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter video title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={uploadData.video.description}
                onChange={(e) => handleInputChange('video', 'description', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter video description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  value={uploadData.video.course}
                  onChange={(e) => handleInputChange('video', 'course', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a course</option>
                  <option value="web-dev">Web Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="mobile-dev">Mobile Development</option>
                  <option value="machine-learning">Machine Learning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={uploadData.video.duration}
                  onChange={(e) => handleInputChange('video', 'duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 15:30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input
                type="url"
                value={uploadData.video.videoUrl}
                onChange={(e) => handleInputChange('video', 'videoUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Video File</label>
              <input
                type="file"
                accept="video/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Supported formats: MP4, MOV, AVI, MKV (Max 500MB)</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Content</h1>

      {/* Upload Type Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'course', label: 'Course Upload', icon: '📚' },
              { id: 'video', label: 'Video Upload', icon: '🎥' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${activeUploadTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Upload {activeUploadTab.charAt(0).toUpperCase() + activeUploadTab.slice(1)}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📚</div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Courses Created</h3>
              <p className="text-2xl font-bold text-gray-800">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🎥</div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Videos Uploaded</h3>
              <p className="text-2xl font-bold text-gray-800">45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;