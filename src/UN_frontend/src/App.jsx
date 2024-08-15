

// const days = BigInt(1);
// const hours = BigInt(24);
// const nanoseconds = BigInt(36000000000);

// const defaultOPtions = {
//   createOPtions: {
//     idleOptions: {
//       disableIdle: true,
//     },
//   },
//   loginOptions: {
//     identityProvider:
//       process.env.DFX_NETWORK  = "ic"
//         ? "https://identity.ic0.app/#authorize"
//         :'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943#authorize',
//     maxTimeToLive: days + hours + nanoseconds,
//   },
// };

// function App() {
//   const [authClient, setAuthClient] = useState(null);
//   const [identity, setIdentity] = useState(null);
//   const [authActor, setAuthActor] =useState(null);
//   const [greeting, setGreeting] = useState("");
//   const [name, setName] = useState("");
//   const [imageName, setImageName] = useState("");
//   const [imageData, setImageData] = useState(null);

// }

/**







// import React, { useState, useEffect } from 'react';
// import { AuthClient } from '@dfinity/auth-client';
// import { UN_backend } from '../../declarations/UN_backend';
// import { Actor } from "@dfinity/agent";

// function App() {
//   const [authClient, setAuthClient] = useState(null);
//   const [name, setName] = useState('');
//   const [greeting, setGreeting] = useState('');
//   const [principalId, setPrincipalId] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//     const initAuthClient = async () => {
//       const client = await AuthClient.create();
//       setAuthClient(client);
//     };

//     initAuthClient();
//   }, []);

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await UN_backend.greet(name);
//       setGreeting(response);
//     } catch (error) {
//       console.error('Failed to greet:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleLogin = async () => {
//     if (!authClient) throw new Error('AuthClient not initialized');

//     const APP_NAME = "Litzi's Motoko Bootcamp";
//     const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
//     const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;
//     const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;

//     authClient.login({
//       identityProvider,
//       onSuccess: handleSuccess,
//       windowOpenerFeatures: `
//       left=${window.screen.width / 2 - 525 / 2},
//       top=${window.screen.height / 2 - 705 / 2},
//       toolbar=0,location=0,menubar=0,width=525,height=705
//     `,
//     });
//   };

//   const handleSuccess = () => {
//     const principalId = authClient.getIdentity().getPrincipal().toText();
//     setPrincipalId(principalId);

//     Actor.agentOf(UN_backend).replaceIdentity(
//       authClient.getIdentity()
//     );
//   };

//   const handleUsernameLogin = () => {
//     setShowForm(true);
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <div id="login" onClick={handleLogin} className="text-center mb-8">
//         <span className="font-bold text-60px leading-72-61px tracking-neg-0-04em text-purple">
//           Patriot.ai
//         </span>
//         <br />
//         <br />
//         <span>Fighting corruption one prompt at a time</span>
//       </div>
//       <div className="buttons">
//         <div>{principalId && <p id="principalId">Your PrincipalId: {principalId}</p>} </div>
//         <button
//           className="bg-white glow text-purple font-semibold py-2 px-6 rounded hover-bg-purple-700 transition-colors"
//           onClick={handleUsernameLogin}
//         >
//           Use Internet Identity
//         </button>
//         <button className="bg-white glow text-purple font-semibold py-2 px-6 rounded hover-bg-purple-700 transition-colors">
//           Continue with Google
//         </button>
//       </div>
//       {/* {showForm && (
//         <form onSubmit={handleFormSubmit}>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter your name"
//           />
//           <button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : 'Submit'}
//           </button>
//         </form>
//       )} */
//       {/* {greeting && <p id="greeting">{greeting}</p>} */}
//     </div>
//   );
// }

// export default App;

// // App.jsx
// import React, { useEffect, useState } from 'react';
// import { Actor, HttpAgent } from '@dfinity/agent';
// import { idlFactory as courseManagerIDL, canisterId as courseManagerCanisterId } from '../../declarations/UN_backend';
// import Auth from '../components/Auth'; // Import the Auth component correctly

// const agent = new HttpAgent();
// const courseManager = Actor.createActor(courseManagerIDL, { agent, canisterId: courseManagerCanisterId });

// function App() {
//   const [courses, setCourses] = useState([]);
//   const [completedCourses, setCompletedCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [summary, setSummary] = useState('');
//   const [user, setUser] = useState(''); // Replace with the actual user Principal

//   useEffect(() => {
//     async function fetchCourses() {
//       try {
//         const courseList = await courseManager.getCourses();
//         setCourses(courseList);
//       } catch (error) {
//         console.error('Failed to fetch courses:', error);
//       }
//     }

//     async function fetchUserCourses() {
//       try {
//         const userPrincipal = Principal.fromText(user); // Set the correct user principal
//         const userCourseList = await courseManager.getUserCourses(userPrincipal);
//         setCompletedCourses(userCourseList);
//       } catch (error) {
//         console.error('Failed to fetch user courses:', error);
//       }
//     }

//     fetchCourses();
//     if (user) {
//       fetchUserCourses();
//     }
//   }, [user]);

//   const handleCourseSelect = async (course) => {
//     setSelectedCourse(course);
//     const courseSummary = await courseManager.getCourseSummary(course);
//     setSummary(courseSummary);
//   };

//   const handleCompleteCourse = async () => {
//     await courseManager.completeCourse(user, selectedCourse);
//     const userCourseList = await courseManager.getUserCourses(user);
//     setCompletedCourses(userCourseList);
//   };

//   return (
//     <div className="App">
//       <Auth />
//       <h1>Course Manager</h1>
//       <h2>What do you want to learn today?</h2>
//       <ul>
//         {courses.map((course, index) => (
//           <li key={index} onClick={() => handleCourseSelect(course)}>
//             {course}
//           </li>
//         ))}
//       </ul>
//       {selectedCourse && (
//         <div>
//           <h2>Summary for {selectedCourse}</h2>
//           <p>{summary}</p>
//           <button onClick={handleCompleteCourse}>Complete Course</button>
//         </div>
//       )}
//       <h2>Completed Courses</h2>
//       <ul>
//         {completedCourses.map((course, index) => (
//           <li key={index}>{course}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
