import React, { useState } from 'react';
import DocumentUpload from '../components/DocumentUpload';
import ChatbotPopup from '../components/ChatbotPopup';

function DocumentUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDocumentsUpload = (files) => {
    setUploadedFiles(files);
    console.log('Uploaded files:', files);
  };

  return (
    <div>
      <DocumentUpload onDocumentsUpload={handleDocumentsUpload} />
      <div>
        {/* <h3>Uploaded Documents:</h3> */}
        <ul>
          {uploadedFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
      <div>
      <p>Click the chat icon to talk with our GenAI Agent.</p>
      {/* Add Chatbot Popup */}
      <ChatbotPopup />
    </div>
    </div>
  );
}

export default DocumentUploadPage;
