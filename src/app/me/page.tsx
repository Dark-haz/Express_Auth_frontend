"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  id: string;
  username: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  errorMessages: string[];
  statusCode: number;
  result?: T;
}

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get<ApiResponse<User>>('http://localhost:5000/api/auth/me', {
          headers: {
            'x-auth-token': token,
          },
        });

        const data = res.data;

        if (!data.isSuccess || !data.result) {
          setError(data.errorMessages.join(', ') || 'Could not fetch user');
          return;
        }

        setUser(data.result);
      } catch (err: any) {
        console.error(err);
        setError('Not authorized or session expired.');
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <p>User ID: {user.id}</p>
    </div>
  );
}
