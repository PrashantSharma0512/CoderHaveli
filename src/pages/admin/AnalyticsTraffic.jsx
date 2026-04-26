// src/components/admin/AnalyticsTraffic.js
import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../components/helper/axiosInstance';
import {  
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { 
  TrendingUp, Users, Eye, Activity, Zap, Code, 
  Server, Clock, RefreshCw, AlertCircle, Loader2,
  ChevronLeft, ChevronRight, Download, FileText, Filter
} from 'lucide-react';

const AnalyticsTraffic = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartTab, setChartTab] = useState('overview');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterMethod, setFilterMethod] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const COLORS = {
    primary: '#10B981',
    secondary: '#3B82F6',
    accent: '#8B5CF6',
    warning: '#F59E0B',
    danger: '#EF4444',
  };

  const CHART_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/analytics/get-analytics');
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterMethod, searchTerm]);

  const processedData = useMemo(() => {
    if (!data?.recentEvents) return null;

    const events = data.recentEvents;
    
    // Route statistics
    const routeStats = {};
    const hourlyStats = {};
    const methodStats = { GET: 0, POST: 0, PUT: 0, DELETE: 0, PATCH: 0 };
    
    events.forEach(event => {
      let basePath = event.path.split('?')[0];
      basePath = basePath.replace('/api/', '').substring(0, 35);
      
      routeStats[basePath] = (routeStats[basePath] || 0) + 1;
      
      const hour = new Date(event.createdAt).getHours();
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
      
      if (methodStats[event.method] !== undefined) {
        methodStats[event.method]++;
      }
    });
    
    const routeData = Object.entries(routeStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
    
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      calls: hourlyStats[i] || 0
    }));
    
    const methodData = Object.entries(methodStats)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
    
    return { 
      routeData, 
      hourlyData, 
      methodData, 
      totalEvents: events.length,
      uniqueUsers: data.uniqueUsers,
      totalViews: data.totalViews,
      allEvents: events
    };
  }, [data]);

  // Filter and paginate events
  const getFilteredEvents = () => {
    if (!processedData?.allEvents) return [];
    
    let filtered = [...processedData.allEvents];
    
    // Filter by method
    if (filterMethod !== 'All') {
      filtered = filtered.filter(event => event.method === filterMethod);
    }
    
    // Filter by search term (path or user agent)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.path.toLowerCase().includes(term) ||
        event.userAgent?.toLowerCase().includes(term) ||
        event.method.toLowerCase().includes(term)
      );
    }
    
    // Sort by createdAt descending (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return filtered;
  };

  const filteredEvents = getFilteredEvents();
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Time', 'Method', 'Endpoint', 'User Agent', 'IP Address', 'Event Type'];
    const csvData = filteredEvents.map(event => [
      new Date(event.createdAt).toLocaleString(),
      event.method,
      event.path,
      event.userAgent || 'N/A',
      event.ip || 'N/A',
      event.eventType || 'API CALL'
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Stats Cards Component
  const StatCard = ({ icon, title, value, subtitle, color }) => {
    const colorClasses = {
      emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
    };

    return (
      <div className={`rounded-xl border p-6 transition-all hover:scale-105 ${colorClasses[color]}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-800">{icon}</div>
          <span className="text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
        </div>
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{subtitle}</p>
      </div>
    );
  };

  // Pagination Component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                currentPage === number
                  ? 'bg-emerald-600 text-white'
                  : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px] p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📊 API Traffic Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Real-time monitoring and insights</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          title="Total Views"
          value={processedData?.totalViews || 0}
          subtitle="API calls tracked"
          color="emerald"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          title="Unique Users"
          value={processedData?.uniqueUsers || 0}
          subtitle="Active developers"
          color="blue"
        />
        <StatCard
          icon={<Server className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          title="Total Events"
          value={processedData?.totalEvents || 0}
          subtitle="Last 24 hours"
          color="purple"
        />
        <StatCard
          icon={<Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
          title="Active Endpoints"
          value={processedData?.routeData?.length || 0}
          subtitle="Unique routes"
          color="amber"
        />
      </div>

      {/* Chart Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {['overview', 'routes', 'methods', 'detailed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setChartTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
              chartTab === tab
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tab === 'detailed' ? '📋 Detailed Report' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart Content */}
      <div className="space-y-6">
        {chartTab === 'overview' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Hourly API Activity
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={processedData?.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    color: '#F3F4F6'
                  }} 
                />
                <Area type="monotone" dataKey="calls" fill="#10B981" fillOpacity={0.3} stroke="#10B981" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartTab === 'routes' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-500" />
              Most Accessed Routes
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={processedData?.routeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={10} width={150} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    color: '#F3F4F6'
                  }} 
                />
                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]}>
                  {processedData?.routeData?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Route List */}
            <div className="mt-6 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Route Details</h4>
              {processedData?.routeData?.map((route, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{route.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(route.value / (processedData?.routeData[0]?.value || 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{route.value} calls</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {chartTab === 'methods' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                HTTP Methods Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={processedData?.methodData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {processedData?.methodData?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#374151',
                      color: '#F3F4F6'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Method Summary</h3>
              <div className="space-y-4">
                {processedData?.methodData?.map((method, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{method.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{method.value} requests</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        ({((method.value / (processedData?.totalEvents || 1)) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Insight Box */}
              <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 mb-2">💡 Insight</h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  GET requests dominate the traffic pattern. Consider implementing caching for frequently accessed endpoints to improve performance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Report Tab */}
        {chartTab === 'detailed' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                Detailed API Report
              </h3>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Export to CSV
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filterMethod}
                    onChange={(e) => setFilterMethod(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="All">All Methods</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by endpoint, method, or user agent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="sm:w-32">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{filteredEvents.length}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Filtered Records</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{currentEvents.length}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Unique IPs</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {new Set(filteredEvents.map(e => e.ip)).size}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Date Range</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {filteredEvents.length > 0 ? 
                    `${new Date(filteredEvents[filteredEvents.length - 1]?.createdAt).toLocaleDateString()} - ${new Date(filteredEvents[0]?.createdAt).toLocaleDateString()}` : 
                    'N/A'}
                </p>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">#</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Time</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Method</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Endpoint</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">IP Address</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">User Agent</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Event Type</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEvents.length > 0 ? (
                    currentEvents.map((event, index) => (
                      <tr key={event._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
                          {startIndex + index + 1}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">
                          {new Date(event.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            event.method === 'GET' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                            event.method === 'POST' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                            event.method === 'PUT' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                            event.method === 'DELETE' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                            'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            {event.method}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-xs break-all font-mono max-w-md">
                          {event.path}
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs font-mono">
                          {event.ip || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs max-w-xs truncate">
                          {event.userAgent?.substring(0, 50)}...
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {event.eventType || 'API CALL'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No records found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredEvents.length > 0 && <Pagination />}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsTraffic;