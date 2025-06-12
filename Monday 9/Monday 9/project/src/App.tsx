import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ElectionProvider } from './context/ElectionContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Results from './pages/Results';
import About from './pages/About';
import AdminPanel from './pages/AdminPanel';
import Footer from './components/Footer';

const App = () => {
  return (
    <ElectionProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<Results />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ElectionProvider>
  );
};

export default App;