import React from 'react';
import ReportsPage from "./routes/ReportsPage";

const App = () => {
  // Hardcoded report data
  const reports = [
    {
      id: 1,
      name: 'Annual Sales Report',
      category: 'Sales',
      likes: 5,
      image: null, // Assuming there's no image for this example
    },
    {
      id: 2,
      name: 'Market Analysis',
      category: 'Marketing',
      likes: 3,
      image: null,
    },
    {
      id: 3,
      name: 'Customer Feedback',
      category: 'Customer Service',
      likes: 7,
      image: null,
    },
  ];

  return <ReportsPage reports={reports} />;
};

export default App;
