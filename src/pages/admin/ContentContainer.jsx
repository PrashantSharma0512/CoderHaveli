// components/ContentContainer.js
import React from 'react';
import DashboardContent from './DashboardContent';
import QuestionsContent from './QuestionsContent';
import StudentsContent from './StudentContent';
import SubmissionsContent from './SubmissionContent';
import AnalyticsContent from './AnalyticsContent';
import UploadContent from './UploadContent';
import ApproachesContent from './ApproachesContent'; // Add this import

const ContentContainer = ({
  activeTab,
  loading,
  error,
  dashboardData,
  questions,
  setQuestions,
  students,
  submissions,
  approaches, // Add this prop
  setApproaches // Add this prop
}) => {
  const renderContent = () => {
    if (loading && activeTab === 'dashboard') {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading dashboard data...</div>
        </div>
      );
    }

    if (error && activeTab === 'dashboard') {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
        </div>
      );
    }

    const components = {
      dashboard: () => <DashboardContent data={dashboardData} />,
      questions: () => <QuestionsContent questions={questions} setQuestions={setQuestions} />,
      students: () => <StudentsContent students={students} />,
      submissions: () => <SubmissionsContent submissions={submissions} />,
      analytics: () => <AnalyticsContent
        dashboardData={dashboardData}
        submissions={submissions}
        questions={questions}
      />,
      upload: () => <UploadContent />,
      approaches: () => <ApproachesContent
        questions={questions}
        approaches={approaches}
        setApproaches={setApproaches}
      /> // Add this component
    };

    return components[activeTab] ? components[activeTab]() : components.dashboard();
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto">
      {renderContent()}
    </div>
  );
};

export default ContentContainer;