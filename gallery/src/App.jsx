import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // 👈 новый импорт
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import ImageView from './pages/ImageView';
import OfflineStatus from './components/OfflineStatus';

function App() {
  return (
    <Router>
      {/* Displays network connection status (online/offline) */}
      <OfflineStatus />

      {/* Site header with navigation */}
      <Header />

      {/* Main content area where different pages are rendered based on URL */}
      <main>
        <Routes>
          {/* Route for home page */}
          <Route path="/" element={<Home />} />

          {/* Route for gallery page */}
          <Route path="/gallery" element={<Gallery />} />

          {/* Route for image detail page with dynamic ID */}
          <Route path="/image/:id" element={<ImageView />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;