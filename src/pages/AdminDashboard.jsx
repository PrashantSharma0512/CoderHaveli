// AdminDashboard.js
import React, { useState } from 'react';

// Initial JSON Data
const initialQuestions = [
  {
    _id: "687546f0ebe5d29269d84296",
    quesId: "1",
    title: "Reverse a String",
    description: "Write a function to reverse a string",
    language: "javascript",
    difficulty: "easy",
    code: "function reverse_a_string(s) {\n  // write the code \n}",
    createdAt: "2025-07-14T17:48:46.148118"
  },
  {
    _id: "687546f0ebe5d29269d8429f",
    quesId: "3",
    title: "Binary Search",
    description: "Implement binary search algorithm",
    language: "python",
    difficulty: "medium",
    code: "def binary_search(arr, target):\n    # write code here\n    pass",
    createdAt: "2025-07-14T17:48:46.148118"
  },
  {
    _id: "687546f0ebe5d29269d842a0",
    quesId: "3",
    title: "Binary Search",
    description: "Implement binary search algorithm",
    language: "java",
    difficulty: "medium",
    code: "public static int binary_search(int[] arr, int target) {\n    // write code here\n    return -1;\n}",
    createdAt: "2025-07-14T17:48:46.148118"
  },
  {
    _id: "687546f0ebe5d29269d842a1",
    quesId: "3",
    title: "Binary Search",
    description: "Implement binary search algorithm",
    language: "cpp",
    difficulty: "medium",
    code: "int binary_search(vector<int>& arr, int target) {\n    // write code here\n    return -1;\n}",
    createdAt: "2025-07-14T17:48:46.148118"
  }
];
const initialStudents = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    registrationDate: "2024-01-15",
    totalSubmissions: 15,
    solvedQuestions: 8
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    registrationDate: "2024-01-20",
    totalSubmissions: 22,
    solvedQuestions: 12
  },
  {
    _id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    registrationDate: "2024-02-01",
    totalSubmissions: 8,
    solvedQuestions: 5
  },
  {
    _id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    registrationDate: "2024-02-15",
    totalSubmissions: 30,
    solvedQuestions: 18
  }
];

const initialSubmissions = [
  {
    _id: "1",
    studentName: "John Doe",
    questionTitle: "Reverse a String",
    language: "javascript",
    status: "accepted",
    submittedAt: "2024-03-20T10:30:00Z",
    executionTime: "120ms"
  },
  {
    _id: "2",
    studentName: "Jane Smith",
    questionTitle: "Binary Search",
    language: "python",
    status: "rejected",
    submittedAt: "2024-03-20T09:15:00Z",
    executionTime: "200ms"
  },
  {
    _id: "3",
    studentName: "Mike Johnson",
    questionTitle: "Reverse a String",
    language: "java",
    status: "accepted",
    submittedAt: "2024-03-19T14:20:00Z",
    executionTime: "150ms"
  },
  {
    _id: "4",
    studentName: "Sarah Wilson",
    questionTitle: "Binary Search",
    language: "cpp",
    status: "accepted",
    submittedAt: "2024-03-19T16:45:00Z",
    executionTime: "180ms"
  }
];
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [questions, setQuestions] = useState(initialQuestions);
  const [students, setStudents] = useState(initialStudents);
  const [submissions, setSubmissions] = useState(initialSubmissions);



  // Dashboard Stats
  const dashboardStats = {
    totalStudents: students.length,
    totalQuestions: questions.length,
    totalSubmissions: submissions.length,
    acceptedSubmissions: submissions.filter(s => s.status === 'accepted').length,
    successRate: Math.round((submissions.filter(s => s.status === 'accepted').length / submissions.length) * 100) || 0
  };

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent stats={dashboardStats} recentSubmissions={submissions.slice(0, 5)} />;
      case 'questions':
        return <QuestionsContent questions={questions} />;
      case 'students':
        return <StudentsContent students={students} />;
      case 'submissions':
        return <SubmissionsContent submissions={submissions} />;
      case 'analytics':
        return <AnalyticsContent stats={dashboardStats} submissions={submissions} questions={questions} />;
      default:
        return <DashboardContent stats={dashboardStats} recentSubmissions={submissions.slice(0, 5)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">CodePlatform Admin</h2>
        </div>
        <nav className="p-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'questions', label: 'Manage Questions', icon: '❓' },
            { id: 'students', label: 'Students', icon: '👥' },
            { id: 'submissions', label: 'Submissions', icon: '📝' },
            { id: 'analytics', label: 'Analytics', icon: '📈' }
          ].map(item => (
            <button
              key={item.id}
              className={`w-full flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id 
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

// Dashboard Component
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.questionTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.language}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    sub.status === 'accepted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Questions Component
const QuestionsContent = ({ questions }) => (
  <div>
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Manage Questions</h1>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
        Add New Question
      </button>
    </div>

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
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    question.difficulty === 'easy' 
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

// Students Component
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

// Submissions Component
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
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    submission.status === 'accepted' 
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

// Analytics Component
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

export default AdminDashboard;