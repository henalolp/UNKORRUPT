import React, { useCallback, useEffect, useState } from "react";
import "../courseee.css";
import logo from "../assets/course.svg";
import { FaPlay } from "react-icons/fa";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { UN_backend } from "../../../declarations/UN_backend";
import { CourseStatus } from "../helper/enum";
import useActorLoader from "../hooks/useActorLoader";
import { Center, Spinner, useToast } from "@chakra-ui/react";
import { createBackendActor, createClient } from "../helper/auth";
import withAuth from "../lib/withAuth";

const CoursePage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const fetcher = useCallback(async () => {
    const response = await UN_backend.listCoursesByStatus(
      CourseStatus.Approved
    );
    setCourses(response);
  });

  const { isLoading } = useActorLoader(fetcher);
  const toast = useToast();

  const handleSelectCourse = async (course) => {
    // Try to enroll user in course
    const authClient = await createClient();
    const actor = await createBackendActor(authClient.getIdentity());
    const response = await actor.enrollCourse(course.id);
    if (response.ok) {
      navigate(`/chat/${course.id}`, {
        state: { title: course.title },
      });
    } else {
      toast({
        title: response.err,
        status: 'error',
        isClosable: true,
        duration: 3000,
        position: 'top'
      })
    }
  };

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
            successfully completed course!
          </p>
          <h2 className="syllabus-title">Syllabus</h2>
          {isLoading && (
            <Center>
              <Spinner />
            </Center>
          )}
          <div className="course-grid">
            {courses.map((course) => (
              <div
                key={course.id}
                className="course-card"
                onClick={async () => {
                  await handleSelectCourse(course);
                }}
              >
                <div className="course-number">
                  {(Number(course.id) + 1).toString()}
                </div>
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

const Page = withAuth(CoursePage);
export default Page;
