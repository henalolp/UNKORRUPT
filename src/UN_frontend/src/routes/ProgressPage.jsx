import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./progresspage.css";
import { FiArrowLeft, FiBarChart2 } from "react-icons/fi";
import { BiCheck, BiMessageSquareDetail } from "react-icons/bi";
import Layout from "../components/Layout";
import withAuth from "../lib/withAuth";
import { useAuthClient } from "../use-auth-client";
import { Center, Heading, Spinner, Text, useToast } from "@chakra-ui/react";
import { createBackendActor, createClient } from "../helper/auth";
import { parseValues } from "../helper/parser";

const ProgressPage = () => {
  const toast = useToast();
  const { identity } = useAuthClient();
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/coursePage"); // Replace with the correct path to your courses page
  };
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetcher = useCallback(async () => {
    const authClient = await createClient();
    const actor = await createBackendActor(authClient.getIdentity());
    setIsLoading(true);
    const response = await actor.getUserEnrolledCourses();
    setIsLoading(false);
    if (response.err) {
      toast({
        title: "Failed to get your enrolled courses",
        position: "top",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    } else {
      const cs = await parseValues(response.ok);
      console.log("Enrolled courses", cs);
      setCourses(cs);
    }
  });

  useEffect(() => {
    fetcher();
  }, []);

  console.log(isLoading);

  return (
    <div className="everything">
      <Layout />
      <div className="progress-container">
        <div className="progress-header">
          <FiArrowLeft className="back-icon" onClick={handleBackClick} />
          <div className="profile-avatar"></div>
          <BiMessageSquareDetail className="message-icon" />
        </div>
        <Heading color={"#000"} size={"sm"} mt={4}>
          {identity?.getPrincipal().toString()}
        </Heading>
        <div className="toggle-buttons">
          <button className="toggle-button active">Progress</button>
          <button className="toggle-button">Badges</button>
        </div>
        {isLoading && (
          <Center>
            <Spinner borderBottomColor={"#a020f0 !important"} />
          </Center>
        )}
        <div className="course-progress">
          {courses.map((item, idx) => {
            return (
              <div className="course-item" key={idx}>
                <div className="progress-circle">
                  <span>
                    {
                      item.completed ? (
                        <BiCheck color="#a020f0" size={'3rem'} />
                      ) : (
                        <FiBarChart2 color="#a020f0" size={'3rem'} />
                      )
                    }
                  </span>
                </div>
                <Text fontWeight={500} align={'center'}>{item.title}</Text>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Page = withAuth(ProgressPage);
export default Page;
