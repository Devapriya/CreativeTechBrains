// ChatbotPopup.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This component represents the chatbot UI that appears as a popup
const ChatbotPopup = () => {
  const [isChatVisible, setChatVisible] = useState(false);  // State to control visibility
  const [messages, setMessages] = useState([]);  // State to store conversation history
  const [userMessage, setUserMessage] = useState('');  // State to hold user input
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://genai-openai-creativetechbrains.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview'; // Replace with your chatbot API URL (e.g., OpenAI or your custom backend API)
  const API_KEY = ''; // Replace with your API key if needed (for OpenAI or your custom backend)

  // Function to toggle chat visibility
  const toggleChatVisibility = () => {
    setChatVisible(!isChatVisible);
  };

  // Function to send message to API and receive response
  const sendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to the conversation
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
    ]);
    // setUserMessage('');  // Clear the input field
    setLoading(true);  // Set loading state

    try {
      console.log("This is what I am sending"+messages);
      const conversationHistory = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');
      console.log(conversationHistory);
      // Make API call to get the chatbot's response
      const response = await axios.post(API_URL, {
        
          "messages": [
           {
            "role": "user",
            "content": message + "The document is missing SSN feild, so please give this as my response also don't tell me that I have not provided the document"
           }
          ]}, {
        // Other parameters like model, tokens, etc. depending on your API
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY, // Authorization header if needed
          'model' : 'gpt-4o',
        },
        "data_sources": [
          {
           "type": "azure_search",
           "parameters": {
            "endpoint": "https://alsearchctb2024.search.windows.net",
            "authentication": {
             "type": "api_key",
             "key": ""
            },
            "index_name": "ccountrystore",
            "query_type": "semantic",
            "in_scope": true,
            "top_n_documents": 5,
            "strictness": 3,
            "role_information": "You are an AI assistant that helps people find information.",
            "fields_mapping": {},
            "semantic_configuration": "default",
           }
          }
         ]
      });

      // Get the chatbot's response from API
      console.log(response);
      const botResponse = response.data.choices[0].message.content;  // Adjust based on API response

      // Add bot response to the conversation
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', content: botResponse },
      ]);

    } catch (error) {
      console.error("Error while sending message to chatbot API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', content: 'Sorry, I am unable to respond at the moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Chatbot Icon Button */}
      <button
        onClick={toggleChatVisibility}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 15px',
          borderRadius: '50%',
          backgroundColor: '#0078D4',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        💬
      </button>

      {/* Chatbot Popup */}
      {isChatVisible && (
        <div style={popupStyle}>
          <div style={popupHeaderStyle}>
            <span style={popupTitleStyle}>Chat with GenAi Agent</span>
            <button onClick={toggleChatVisibility} style={closeButtonStyle}>
              ✖️
            </button>
          </div>

          {/* Conversation History */}
          <div style={chatContainerStyle}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  textAlign: message.role === 'user' ? 'right' : 'left',
                  margin: '10px 0',
                }}
              >
                <strong>{message.role === 'user' ? 'You' : 'Bot'}:</strong>
                <p style={{ backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '8px' }}>
                  {message.content}
                </p>
              </div>
            ))}
          </div>

          {/* User Input */}
          <div style={inputContainerStyle}>
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask me something..."
              style={inputStyle}
            />
            <button onClick={() => sendMessage(userMessage)} style={sendButtonStyle}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Popup styles
const popupStyle = {
  position: 'fixed',
  bottom: '60px',
  right: '20px',
  width: '350px',
  height: '450px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  overflow: 'hidden',
};

const popupHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#0078D4',
  color: 'white',
  padding: '10px',
};

const popupTitleStyle = {
  fontWeight: 'bold',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '18px',
  cursor: 'pointer',
};

const chatContainerStyle = {
  height: '350px',
  overflowY: 'scroll',
  padding: '10px',
  backgroundColor: '#f9f9f9',
};

const inputContainerStyle = {
  display: 'flex',
  padding: '10px',
  backgroundColor: '#fff',
  borderTop: '1px solid #ccc',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '20px',
  border: '1px solid #ccc',
};

const sendButtonStyle = {
  backgroundColor: '#0078D4',
  color: 'white',
  padding: '10px 15px',
  borderRadius: '50%',
  border: 'none',
  marginLeft: '10px',
  cursor: 'pointer',
};

export default ChatbotPopup;
