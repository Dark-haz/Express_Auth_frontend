"use client";

import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface User {
  id: string;
  username: string;
}

interface LoginResult {
  token: string;
  user: User;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  errorMessages: string[];
  statusCode: number;
  result?: T;
}

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    try {
      const res: AxiosResponse<ApiResponse<LoginResult>> = await axios.post(
        'http://localhost:5000/api/auth/login',
        { username, password }
      );

      const data = res.data;

      if (!data.isSuccess || !data.result) {
        setError(data.errorMessages.join(', ') || 'Login failed');
        return;
      }

      const { token, user } = data.result;
      // Optionally: store token in localStorage
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);

    } catch (err:any) {
      console.error(err);
      
      if (err.response && err.response.data) {
        const errorData: ApiResponse<null> = err.response.data;
        const msg = errorData.errorMessages.join(', ') || 'Login failed';
        setError(msg);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && <div>Welcome, {user.username} (ID: {user.id})</div>}
    </div>
  );
}
