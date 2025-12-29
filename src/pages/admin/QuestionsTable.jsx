// components/admin/QuestionsTable.js
import React from 'react';

const QuestionsTable = ({ questions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Languages</th>
              <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Difficulty</th>
              <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tags</th>
              <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {questions.map(question => (
              <QuestionRow key={question._id} question={question} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const QuestionRow = ({ question }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
      {question.quesId}
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
      <span className="truncate max-w-[120px] md:max-w-none inline-block">
        {question.quesName}
      </span>
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4">
      <div className="flex flex-wrap gap-1">
        {question.languages && question.languages.map(lang => (
          <span key={lang} className="inline-flex px-1 md:px-2 py-1 text-xs font-medium rounded bg-amber-100 dark:bg-indigo-900 text-amber-800 dark:text-indigo-200">
            {lang.charAt(0).toUpperCase() + lang.slice(1).substring(0, 2)}
          </span>
        ))}
      </div>
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">
      <DifficultyBadge difficulty={question.difficulty} />
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4">
      <div className="flex flex-wrap gap-1">
        {question.tags && question.tags.slice(0, 2).map(tag => (
          <span key={tag} className="inline-flex px-1 md:px-2 py-1 text-xs rounded bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
            {tag}
          </span>
        ))}
        {question.tags && question.tags.length > 2 && (
          <span className="inline-flex px-1 md:px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            +{question.tags.length - 2}
          </span>
        )}
      </div>
    </td>
    <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex space-x-2">
        <button className="text-amber-600 dark:text-indigo-400 hover:text-amber-800 dark:hover:text-indigo-300 text-xs md:text-sm">Edit</button>
        <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs md:text-sm">Delete</button>
      </div>
    </td>
  </tr>
);

const DifficultyBadge = ({ difficulty }) => (
  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${difficulty === 'easy'
    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    : difficulty === 'medium'
      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    }`}>
    {difficulty}
  </span>
);

export default QuestionsTable;