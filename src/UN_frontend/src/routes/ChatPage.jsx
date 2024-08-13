import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./chatpage.css";
import { FaArrowLeft } from "react-icons/fa";

const ChatPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const courseTitle = location.state?.title || `Course ${courseId}`;
  
  const [messages, setMessages] = useState([
    { sender: "system", text: "Welcome! How can I assist you today?" }
  ]);

  const handlePromptClick = (prompt) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: prompt },
      { sender: "system", text: `You selected: ${prompt}` }
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <FaArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h1>{courseTitle}</h1>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user-message" : "system-message"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-prompts">
        <button onClick={() => handlePromptClick("Continue")}>Continue</button>
        <button onClick={() => handlePromptClick("Got it")}>Got it</button>
        <button onClick={() => handlePromptClick("Tell me more")}>Tell me more</button>
      </div>
    </div>
  );
};

export default ChatPage;
