import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axiosInstance';
import { useSelector } from 'react-redux';

function Submission({ quesId }) {
    const [submission, setSubmission] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useSelector((state) => state.login.userId);

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
            'Accepted': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'Wrong Answer': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'compilation error': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'run time error': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            'Time Limit Exceeded': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        }[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

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
            <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 bg-gray-50 text-red-600 dark:bg-gray-900 dark:text-red-400">
                <p className="text-lg">{error}</p>
            </div>
        );
    }

    if (!submission || submission.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                <p className="text-lg">No submissions found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-2 sm:p-4 bg-gray-50 dark:bg-gray-900">
            <div className="rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                {submission.length > 0 &&
                                    Object.keys(submission[0]).map((key, index) => (
                                        <th
                                            key={index}
                                            className="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300"
                                        >
                                            <div className="whitespace-nowrap">
                                                {key.replace('_', ' ')}
                                            </div>
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {submission.map((data, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800'}>
                                    {Object.entries(data).map(([key, value], i) => (
                                        <td key={i} className="px-3 sm:px-6 py-6 whitespace-nowrap capitalize font-semibold text-sm text-gray-700 dark:text-gray-300">
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

            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <p>Showing {submission.length} submission{submission.length !== 1 ? 's' : ''}</p>
            </div>
        </div>
    );
}

export default Submission;