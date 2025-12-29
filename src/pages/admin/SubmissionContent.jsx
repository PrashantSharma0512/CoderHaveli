// components/admin/SubmissionsContent.js
import React from 'react';

const SubmissionsContent = ({ submissions }) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-8">
        All <span className="text-amber-600 dark:text-indigo-400">Submissions</span>
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Question</th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lang</th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {submissions.map(submission => (
                <SubmissionRow key={submission._id} submission={submission} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SubmissionRow = ({ submission }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
      <span className="truncate max-w-[80px] md:max-w-none inline-block">
        {submission.user}
      </span>
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      <span className="truncate max-w-[100px] md:max-w-none inline-block">
        {submission.question}
      </span>
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      {submission.codelanguage}
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">
      <StatusBadge status={submission.status} />
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      {new Date(submission.createdAt).toLocaleDateString()}
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      {submission.executionTime}
    </td>
  </tr>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status === 'Accepted'
    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    }`}>
    {status}
  </span>
);

export default SubmissionsContent;