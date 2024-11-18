import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserInfoPage from './pages/UserInfoPage';
import DocumentUploadPage from './pages/DocumentUploadPage';
import FinalPage from './pages/FinalPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user-info" element={<UserInfoPage />} />
        <Route path="/upload-documents" element={<DocumentUploadPage />} />
        <Route path="/final" element={<FinalPage />} />
        <Route path="/" element={<UserInfoPage />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;
