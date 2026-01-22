import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import SquadList from './pages/SquadList';
import SquadDashboard from './pages/SquadDashboard';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<SquadList />} />
          <Route path="/squad/:squadId" element={<SquadDashboard />} />
          <Route path="/all-experiments" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
