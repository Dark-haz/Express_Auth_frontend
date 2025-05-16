"use client";

import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface User {
  id: string;
  username: string;
}

interface RegisterResult {
  token: string;
  user: User;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  errorMessages: string[];
  statusCode: number;
  result?: T;
}

export default function Register() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    try {
      const res: AxiosResponse<ApiResponse<RegisterResult>> = await axios.post(
        'http://localhost:5000/api/auth/register',
        { username, password }
      );

      const data = res.data;

      if (!data.isSuccess || !data.result) {
        setError(data.errorMessages.join(', ') || 'Registration failed');
        return;
      }

      const { token, user } = data.result;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
    } catch (err: any) {
      console.error(err);

      if (err.response && err.response.data) {
        const errorData: ApiResponse<null> = err.response.data;
        const msg = errorData.errorMessages.join(', ') || 'Registration failed';
        setError(msg);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
      <button onClick={register}>Register</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && <div>Welcome, {user.username} (ID: {user.id})</div>}
    </div>
  );
}
