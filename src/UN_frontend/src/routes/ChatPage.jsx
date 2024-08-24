import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./chatpage.css";
import { FaArrowLeft } from "react-icons/fa";
import { UN_backend } from "../../../declarations/UN_backend";
import Layout from "../components/Layout";

const ChatPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const courseTitle = location.state?.title || `Course ${courseId}`;
  const [courseDetails, setCourse] = useState(null);

  useEffect(() => {
    // Load courses
    async function load() {
      const response = await UN_backend.getCourseDetails(parseInt(courseId));
      if (response.ok) setCourse(response.ok);
    }
    if (courseId) load();
  }, [courseId])

  const [messages, setMessages] = useState([
    { sender: "system", text: "Welcome! How can I assist you today?" }
  ]);

  const handlePromptClick = (prompt) => {
    if (prompt === 'Continue') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: prompt },
        { sender: "system", text: `Here are the resources:` },
        ...(courseDetails ? courseDetails.resources.map((resource) => {
          return [
            { sender: "system", text: resource.title },
            { sender: "system", text: resource.description },
            { sender: "system", text: resource.url },
          ]
        }).flat() : [])
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: prompt },
        { sender: "system", text: `You selected: ${prompt}` }
      ]);
    }
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
