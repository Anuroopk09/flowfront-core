import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import Courses from '../components/Courses';
import Students from '../components/Students';
import Attendance from '../components/Attendance';
import Performance from '../components/Performance';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('/dashboard');

  useEffect(() => {
    const handleNavigate = (event: any) => {
      setCurrentPage(event.detail);
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case '/courses':
        return <Courses />;
      case '/students':
        return <Students />;
      case '/attendance':
        return <Attendance />;
      case '/performance':
        return <Performance />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;