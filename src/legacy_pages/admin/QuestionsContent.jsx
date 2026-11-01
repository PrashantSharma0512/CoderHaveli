// components/admin/QuestionsContent.js
import React, { useState, useEffect } from 'react';
import QuestionsTable from './QuestionsTable';
import QuestionModal from './QuestionModal';
import toast from 'react-hot-toast';
import axiosInstance from '../../components/helper/axiosInstance';

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
    hints: [],
    constraints: [],
    testCases: [],
    code: {
      javascript: '',
      python: '',
      java: '',
      cpp: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = {
      quesId: newQuestion.quesId,
      quesName: newQuestion.title,
      quesDesc: newQuestion.description,
      languages: newQuestion.languages,
      hints: newQuestion.hints,
      testcases: newQuestion.testCases,
      constraints: newQuestion.constraints,
      difficulty: newQuestion.difficulty,
      tags: newQuestion.tags,
      code: newQuestion.code,
      createdAt: new Date().toISOString()
    };
    const response = await axiosInstance.post('/api/problem/add-question', {
      question: question
    });
    
    if (!response.data.success) {
      toast.error('Failed to add question');
      return;
    }
    toast.success('Question added successfully');
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
          Manage <span className="text-amber-600 dark:text-amber-400">Questions</span>
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-all text-sm md:text-base w-full sm:w-auto shadow-md shadow-amber-500/20 cursor-pointer"
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