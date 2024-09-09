import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./progresspage.css";
import { FiArrowLeft, FiBarChart2 } from "react-icons/fi";
import { BiCheck, BiMessageSquareDetail } from "react-icons/bi";
import Layout from "../components/Layout";
import withAuth from "../lib/withAuth";
import { useAuthClient } from "../use-auth-client";
import { Center, Spinner, Text, useToast, Button, Box } from "@chakra-ui/react"; // Added Box from Chakra UI
import { createBackendActor, createClient } from "../helper/auth";
import { parseValues } from "../helper/parser";

const ProgressPage = () => {
  const toast = useToast();
  const { identity } = useAuthClient();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Progress"); // State to track active tab

  const handleBackClick = () => {
    navigate("/coursePage"); // Replace with the correct path to your courses page
  };

  const handleBadgesClick = () => {
    navigate("/badgesPage"); // Replace with the correct path to your badges page
  };

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
  }, [toast]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  // Handler to toggle active tab
  const handleTabClick = (tab) => {
    if (tab === "Badges") {
      handleBadgesClick(); // Navigate to badges page
    } else {
      setActiveTab(tab); // Update the active tab state
    }
  };

  return (
    <div className="everything">
      <Layout />
      <div className="progress-container">
        <div className="progress-header">
          <FiArrowLeft className="back-icon" onClick={handleBackClick} />
          <div className="profile-avatar"></div>
          <BiMessageSquareDetail className="message-icon" />
        </div>
        <Box display="flex" justifyContent="center" width="100%" mt={4}>
          <Button 
            colorScheme="purple" 
            size="sm" 
            onClick={() => console.log(identity?.getPrincipal().toString())}
            maxWidth={{ base: "100%", md: "auto" }} // Ensures the button doesn't overflow on small screens
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {identity?.getPrincipal().toString()}
          </Button>
        </Box>
        <div className="toggle-buttons">
          <button 
            className={`toggle-button ${activeTab === "Progress" ? "active" : ""}`} 
            onClick={() => handleTabClick("Progress")}
          >
            Progress
          </button>
          <button 
            className={`toggle-button ${activeTab === "Badges" ? "active" : ""}`} 
            onClick={() => handleTabClick("Badges")}
          >
            Badges
          </button>
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
                    {item.completed ? (
                      <BiCheck color="#a020f0" size={'3rem'} />
                    ) : (
                      <FiBarChart2 color="#a020f0" size={'3rem'} />
                    )}
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
