// components/admin/QuestionsContent.js
import React, { useState, useEffect } from 'react';
import QuestionsTable from './QuestionsTable';
import QuestionModal from './QuestionModal';

const QuestionsContent = ({ questions, setQuestions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Manage <span className="text-amber-600 dark:text-indigo-400">Questions</span>
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full sm:w-auto"
        >
          Add New Question
        </button>
      </div>

      <QuestionModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        handleSubmit={handleSubmit}
      />

      <QuestionsTable questions={questions} />
    </div>
  );
};

export default QuestionsContent;