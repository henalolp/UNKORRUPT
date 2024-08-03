import React, { useEffect, useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as courseManagerIDL, canisterId as courseManagerCanisterId } from '../../declarations/UN_backend';

const agent = new HttpAgent();
const courseManager = Actor.createActor(courseManagerIDL, { agent, canisterId: courseManagerCanisterId });

function App() {
  const [courses, setCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [summary, setSummary] = useState('');
  const [user, setUser] = useState(''); // Replace with the actual user Principal

  useEffect(() => {
    async function fetchCourses() {
      try {
        const courseList = await courseManager.getCourses();
        setCourses(courseList);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    }

    async function fetchUserCourses() {
      try {
        const userPrincipal = Principal.fromText(user); // Set the correct user principal
        const userCourseList = await courseManager.getUserCourses(userPrincipal);
        setCompletedCourses(userCourseList);
      } catch (error) {
        console.error('Failed to fetch user courses:', error);
      }
    }

    fetchCourses();
    if (user) {
      fetchUserCourses();
    }
  }, [user]);

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    const courseSummary = await courseManager.getCourseSummary(course);
    setSummary(courseSummary);
  };

  const handleCompleteCourse = async () => {
    await courseManager.completeCourse(user, selectedCourse);
    const userCourseList = await courseManager.getUserCourses(user);
    setCompletedCourses(userCourseList);
  };

  return (
    <div className="App">
      <h1>Course Manager</h1>
      <h2>What do you want to learn today?</h2>
      <ul>
        {courses.map((course, index) => (
          <li key={index} onClick={() => handleCourseSelect(course)}>
            {course}
          </li>
        ))}
      </ul>
      {selectedCourse && (
        <div>
          <h2>Summary for {selectedCourse}</h2>
          <p>{summary}</p>
          <button onClick={handleCompleteCourse}>Complete Course</button>
        </div>
      )}
      <h2>Completed Courses</h2>
      <ul>
        {completedCourses.map((course, index) => (
          <li key={index}>{course}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
