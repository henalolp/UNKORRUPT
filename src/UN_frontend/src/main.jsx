import React from "react";
import ReactDOM from "react-dom/client";
import Auth from "./routes/auth";
import CoursePage from "./routes/coursePage";
import ReportForm from "./routes/ReportForm";
import ProfilePage from "./routes/ProfilePage";
import ProgressPage from "./routes/ProgressPage";
import ChatPage from "./routes/ChatPage"; // Import the ChatPage
import "./tailwind.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import QuizPage from "./routes/QuizPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
<<<<<<< HEAD
  {
    path: "coursePage",
    element: <CoursePage />,
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
    element: <QuizPage />,
  },
=======
  // {
  //   path: "coursePage",
  //   element: <CoursePage />,
  // },
  // {
  //   path: "reportForm",
  //   element: <ReportForm />,
  // },
  // {
  //   path: "profilePage",
  //   element: <ProfilePage />,
  // },
  // {
  //   path: "progressPage",
  //   element: <ProgressPage />,
  // },
  // {
  //   path: "chat/:courseId", // New route for ChatPage with dynamic courseId
  //   element: <ChatPage />,
  // },
>>>>>>> f5776af5d6cdffca7d81b616dcb2b23776aeebf7
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
