import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axiosInstance';
import { useSelector } from 'react-redux';

function Submission({ quesId }) {
    const [submission, setSubmission] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useSelector((state) => state.login.userId);
    const darkMode = localStorage.getItem('token') // Get current theme state

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axiosInstance.get(`/api/problem/get-submission/${userId}/${quesId}`);
                setSubmission(response.data);
            } catch (error) {
                console.error("Error fetching submission data", error);
                setError("Failed to load submissions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (userId && quesId) {
            fetchSubmission();
        }
    }, [userId, quesId]);

    const getStatusBadge = (status) => {
        const statusClass = {
            'Accepted': darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
            'Wrong Answer': darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800',
            'compilation error': darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
            'run time error': darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800',
            'Time Limit Exceeded': darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
        }[status] || (darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800');

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                {status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-64 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex justify-center items-center h-64 ${darkMode ? 'bg-gray-900 text-red-400' : 'bg-gray-50 text-red-600'}`}>
                <p className="text-lg">{error}</p>
            </div>
        );
    }

    if (!submission || submission.length === 0) {
        return (
            <div className={`flex justify-center items-center h-64 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                <p className="text-lg">No submissions found</p>
            </div>
        );
    }

    return (
        <div className={`container mx-auto p-2 sm:p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                            <tr>
                                {submission.length > 0 &&
                                    Object.keys(submission[0]).map((key, index) => (
                                        <th
                                            key={index}
                                            className={`px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                                        >
                                            <div className="whitespace-nowrap">
                                                {key.replace('_', ' ')}
                                            </div>
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {submission.map((data, index) => (
                                <tr key={index} className={darkMode ? (index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800') : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                                    {Object.entries(data).map(([key, value], i) => (
                                        <td key={i} className={`px-3 sm:px-6 py-6 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <div className="flex items-center">
                                                {key === 'Status' ? (
                                                    getStatusBadge(value)
                                                ) : key === 'Submission Time' ? (
                                                    <span className="whitespace-nowrap">{formatDate(value)}</span>
                                                ) : key === 'Execution Time' ? (
                                                    `${value} ms`
                                                ) : (
                                                    value
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>Showing {submission.length} submission{submission.length !== 1 ? 's' : ''}</p>
            </div>
        </div>
    );
}

export default Submission;