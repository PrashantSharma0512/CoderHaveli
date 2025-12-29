// components/admin/StudentsContent.js
import React from 'react';

const StudentsContent = ({ students }) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-8">
        Registered <span className="text-amber-600 dark:text-indigo-400">Students</span>
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reg Date</th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submissions</th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Solved</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {students.map(student => (
                <StudentRow key={student._id} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StudentRow = ({ student }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
      <span className="truncate max-w-[100px] md:max-w-none inline-block">
        {student.name}
      </span>
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      <span className="truncate max-w-[120px] md:max-w-none inline-block">
        {student.email}
      </span>
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      {new Date(student.createdAt).toLocaleDateString()}
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      {student.totalSubmissions}
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      {student.totalQuestionsAttempted}
    </td>
  </tr>
);

export default StudentsContent;