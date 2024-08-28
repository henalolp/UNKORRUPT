import React from "react";
import ReactDOM from "react-dom/client";
import Auth from "./routes/auth";
import CoursePage from "./routes/coursePage";
import ReportForm from "./routes/ReportForm";
import ProfilePage from "./routes/ProfilePage";
import ProgressPage from "./routes/ProgressPage";
import ChatPage from "./routes/ChatPage"; // Import the ChatPage
import ReportsPage from "./routes/ReportsPage";
import Quiz from "./routes/QuizPage";
import App from "./App";
import Admin from "./routes/Admin";
// import LandingPage from "./routes/LandingPage";
// import RootLayout from "./app/layout";
import HomePage from "./routes/HomePage";
// import "./tailwind.css";
import "./index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import QuizPage from "./routes/QuizPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "coursePage",
    element: <CoursePage />,
  },
  {
    path: "auth",
    element: <Auth />,
  },
  {
    path: "admin",
    element: <Admin />,
  },
  {
    path: "reportForm",
    element: <ReportForm />,
  },
  {
    path: "profilePage",
    element: <ProfilePage />,
  },
  {
    path: "progressPage",
    element: <ProgressPage />,
  },
  {
    path: "chat/:courseId", // New route for ChatPage with dynamic courseId
    element: <ChatPage />,
  },
  {
    path: "quizPage", // New route for ChatPage with dynamic courseId
    element: <QuizPage/>,
  },
  {
    path: "reportsPage", // New route for ChatPage with dynamic courseId
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
