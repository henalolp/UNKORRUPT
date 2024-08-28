import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import "./admin.css";
import Layout from '../components/Layout';

const Admin = () => {
    const [selectedPage, setSelectedPage] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [courseResources, setCourseResources] = useState(['']);
    const [owners, setOwners] = useState(['535635645']); // Initial owner
    const [newOwner, setNewOwner] = useState(''); // Input for new owner

    const navigate = useNavigate(); // Initialize navigate

    // Handle adding a new course with multiple resources
    const handleAddCourse = () => {
        if (courseName && courseResources.length > 0) {
            setCourses([...courses, { name: courseName, resources: courseResources }]);
            setCourseName('');
            setCourseResources(['']);
        }
    };

    // Handle adding a new resource input field
    const handleAddResource = () => {
        setCourseResources([...courseResources, '']);
    };

    // Handle changing a specific resource input
    const handleResourceChange = (index, value) => {
        const newResources = [...courseResources];
        newResources[index] = value;
        setCourseResources(newResources);
    };

    // Handle adding a new owner
    const handleAddOwner = () => {
        if (newOwner) {
            setOwners([...owners, newOwner]);
            setNewOwner(''); // Clear the input field after adding
        }
    };

    const renderContent = () => {
        switch (selectedPage) {
            case 'courses':
                return (
                    <div>
                        <h2>Courses</h2>
                        <input
                            type="text"
                            placeholder="Course Name"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                        />
                        {courseResources.map((resource, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    placeholder={`Resource ${index + 1}`}
                                    value={resource}
                                    onChange={(e) => handleResourceChange(index, e.target.value)}
                                    style={{ marginRight: '10px', flex: '1' }}
                                />
                                {index === courseResources.length - 1 && ( // Show plus button only on the last input field
                                    <button onClick={handleAddResource} style={{ padding: '5px 10px', cursor: 'pointer' }}>+</button>
                                )}
                            </div>
                        ))}
                        <button onClick={handleAddCourse}>Add Course</button>
                        <ul>
                            {courses.map((course, index) => (
                                <li key={index}>
                                    <strong>{index + 1}. {course.name}</strong>: {course.resources.join(', ')}
                                </li>
                            ))}
                        </ul>
                    </div>
                );

            case 'permissions':
                return (
                    <div>
                        <h2>Permissions</h2>
                        <h3>Owners</h3>
                        <ul>
                            {owners.map((owner, index) => (
                                <li key={index}>{owner}</li>
                            ))}
                        </ul>
                        <input 
                            type="text" 
                            placeholder="Add new owner" 
                            value={newOwner}
                            onChange={(e) => setNewOwner(e.target.value)}
                        />
                        <button onClick={handleAddOwner}>Add Owner</button>
                    </div>
                );

            case 'questions':
                return (
                    <div>
                        <h2>Questions</h2>
                        <div>
                            <input type="text" placeholder="Course Title" />
                            <input type="text" placeholder="Question" />
                            <button>Regenerate Options</button>
                        </div>
                    </div>
                );

            default:
                return <div>Select a page from the sidebar.</div>;
        }
    };

    return (
        <div className='admin-all'>
            {/* <Layout /> */}
            <div className='admin-container'>
                <div className='sbar'>
                    <ul>
                        <li onClick={() => setSelectedPage('courses')}>Courses</li>
                        <li onClick={() => setSelectedPage('permissions')}>Permissions</li>
                        <li onClick={() => setSelectedPage('questions')}>Questions</li>
                    </ul>
                    {/* Go Back Button */}
                    <button 
                        className='btn-go-back' 
                        onClick={() => navigate('/')} 
                        style={{ position: 'absolute', bottom: '20px', left: '20px' }}
                    >
                        Go Back
                    </button>
                </div>
                <div className='content-page'>
                    {renderContent()}
                </div>
            </div>
            
        </div>
    );
};

export default Admin;
