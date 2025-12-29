// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../components/helper/axiosInstance';
import Sidebar from './admin/Sidebar';
import ContentContainer from './admin/ContentContainer';
import MobileHeader from './admin/MobileHeader';
import DashboardFooter from './admin/DashboardFooter';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.login);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      const endpoints = {
        dashboard: '/admin/dashboard',
        submissions: '/admin/submissions',
        questions: '/admin/questions',
        students: '/admin/users'
      };

      const stateSetters = {
        dashboard: setDashboardData,
        submissions: setSubmissions,
        questions: setQuestions,
        students: setStudents
      };

      if (endpoints[activeTab]) {
        try {
          setLoading(true);
          const response = await axiosInstance.get(endpoints[activeTab]);
          const data = response.data.data;
          
          if (activeTab === 'dashboard') {
            setDashboardData(data);
          } else {
            stateSetters[activeTab](data);
          }
          setError(null);
        } catch (error) {
          console.error(`Error fetching ${activeTab} data:`, error);
          setError(`Failed to load ${activeTab} data`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [activeTab]);

  // Close mobile menu on tab change
  useEffect(() => {
    if (mobileMenuOpen && window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <MobileHeader 
        user={user}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex flex-col md:flex-row">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          user={user}
        />

        <ContentContainer
          activeTab={activeTab}
          loading={loading}
          error={error}
          dashboardData={dashboardData}
          questions={questions}
          setQuestions={setQuestions}
          students={students}
          submissions={submissions}
        />
      </div>
      
      <DashboardFooter />
    </div>
  );
};

export default AdminDashboard;