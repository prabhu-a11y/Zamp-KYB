import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import ProcessList from './components/ProcessList';
import PeoplePage from './components/People';
import ProcessDetails from './components/ProcessDetails';
import KnowledgeBase from './components/KnowledgeBase'; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/done" element={<DashboardLayout />}>
          <Route index element={<ProcessList />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="people" element={<PeoplePage />} />
          {/* Dynamic process detail route */}
          <Route path="process/:id" element={<ProcessDetails />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;