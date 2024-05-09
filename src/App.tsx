import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import './App.scss'; 

import Header from './Components/Header';
import Footer from './Components/Footer';
import Form from './Components/Form';
import Results from './Components/Results';

const App = () => {
  const [requestParams, setRequestParams] = useState({ method: 'GET', url: '', body: '' });
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!requestParams.url) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios({
          method: requestParams.method,
          url: requestParams.url,
          data: requestParams.body,
        });

        setData(response.data); 
      } catch (err: any) { 
        setError(err.message); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [requestParams]);

  const handleApiCall = (formData: { method: string; url: string; body?: string }) => {
    setRequestParams(formData);
  };

  return (
    <>
      <Header />
      <Form handleApiCall={handleApiCall} />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Results data={data} />
      )}
      <Footer /> {/* Render the footer */}
    </>
  );
};

export default App; // Export the functional App component
