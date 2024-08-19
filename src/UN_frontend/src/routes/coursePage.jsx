import React, { useEffect, useState } from "react";
import "../courseee.css";
import logo from "../../public/course.svg";
import { FaPlay } from "react-icons/fa";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { UN_backend } from "../../../declarations/UN_backend";
import { CourseStatus } from "../helper/enum";

const CoursePage = () => {
  const navigate = useNavigate();
  // const [courses, setCourses] = useState([]);
  const courses = [
    { id: 1, title: "Introduction to Anti-Corruption Principles" },
    { id: 2, title: "Anti-Corruption in Public Procurement" },
    { id: 3, title: "Ethical Guidelines and Policies" },
    { id: 4, title: "Acting for the Rule of Law" },
    { id: 5, title: "Advanced Anti-Corruption Strategies" },
    { id: 6, title: "Corruption in Public Finance Management" },
    { id: 7, title: "Global Perspectives on Anti-Corruption" },
  ];

  // useEffect(() => {
  //   // Load courses
  //   async function load() {
  //     const response = await UN_backend.listCourses(CourseStatus.Approved);
  //     console.log(response);
  //   }
  //   load();
  // }, [])

  return (
    <div className="course-container">
      <Layout />
      <div className="course-wrapper">
        <img src={logo} alt="Course Selection" className="course-image" />
        <div className="course-content">
          <h1 className="course-title">Welcome Patriot!</h1>
          <p className="course-description">
            What do you want to learn today? Interact with our AI powered
            courses to learn about and fight corruption. Get a token for every
            successifully completed course!
          </p>
          <h2 className="syllabus-title">Syllabus</h2>
          <div className="course-grid">
            {courses.map((course) => (
              <div
                key={course.id}
                className="course-card"
                onClick={() =>
                  navigate(`/chat/${course.id}`, {
                    state: { title: course.title },
                  })
                }
              >
                <div className="course-number">{course.id}</div>
                <h3 className="course-card-title">{course.title}</h3>
                <FaPlay style={{ color: "#A020F0" }} />
              </div>
            ))}
          </div>
          <NavLink
            to="/progressPage"
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <button className="my-button">My courses</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
