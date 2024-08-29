import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./chatpage.css";
import { FaArrowLeft } from "react-icons/fa";
import { UN_backend } from "../../../declarations/UN_backend";
import Layout from "../components/Layout";
import withAuth from "../lib/withAuth";

const ChatPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const courseTitle = location.state?.title || `Course ${courseId}`;
  const [courseDetails, setCourse] = useState(null);

  const [messages, setMessages] = useState([
    { sender: "system", text: "Welcome! How can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");

  const predefinedQuestions = [
    "What is this course about?",
    "Can you provide resources?",
    "How can I contact support?",
  ];

  useEffect(() => {
    // Load course details
    async function load() {
      const response = await UN_backend.getCourseDetails(parseInt(courseId));
      if (response.ok) setCourse(response.ok);
    }
    if (courseId) load();
  }, [courseId]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (userInput.trim()) {
      sendMessage(userInput);
      setUserInput("");
    }
  };

  const handlePredefinedQuestionClick = (question) => {
    sendMessage(question);
  };

  const sendMessage = (messageText) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: messageText },
    ]);

    // Handle system responses
    if (messageText.toLowerCase().includes("course")) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "system",
          text: courseDetails
            ? courseDetails.description
            : "Sorry, course details are not available.",
        },
      ]);
    } else if (messageText.toLowerCase().includes("resources")) {
      if (courseDetails && courseDetails.resources.length > 0) {
        const resourceMessages = courseDetails.resources.map((resource) => ({
          sender: "system",
          text: `${resource.title}: ${resource.description}`,
          link: resource.url,
        }));
        setMessages((prevMessages) => [...prevMessages, ...resourceMessages]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "system",
            text: "No resources available for this course.",
          },
        ]);
      }
    } else if (messageText.toLowerCase().includes("support")) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "system",
          text: "You can contact support at support@example.com or call 1-800-123-4567.",
        },
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "system",
          text: "I'm sorry, I didn't understand that. Could you please rephrase?",
        },
      ]);
    }
  };

  return (
    <div className="chat-body">
      <Layout />
      <div className="chat-container">
        <div className="chat-header">
          <FaArrowLeft className="back-icon" onClick={() => navigate(-1)} />
          <h1>{courseTitle}</h1>
        </div>

        <div className="chat-content">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === "user" ? "user-message" : "system-message"
                }`}
              >
                {message.link ? (
                  <a href={message.link} target="_blank">
                    {message.text}
                  </a>
                ) : (
                  message.text
                )}
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="predefined-questions-container">
              <h2>Try asking one of these questions:</h2>
              <div className="predefined-questions-grid">
                {predefinedQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="question-card"
                    onClick={() => handlePredefinedQuestionClick(question)}
                  >
                    {question}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Page = withAuth(ChatPage);
export default Page;
