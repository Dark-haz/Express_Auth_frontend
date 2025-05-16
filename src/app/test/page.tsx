"use client";

import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface ApiResponse {
  message: string; // Adjust this interface based on your actual API response
  [key: string]: any;
}

export default function TestPage() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async () => {
    try {
      const res: AxiosResponse<ApiResponse> = await axios.get(' http://localhost:5000');
      setResponse(res.data);
      setError(null);
    } catch (err) {
      console.error('API Error:', err);
      setError('Something went wrong!');
      setResponse(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Axios API Call (TS)</h1>
      <button onClick={handleApiCall}>Call API</button>
      <div style={{ marginTop: 20 }}>
        {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}
