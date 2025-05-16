"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../lib/constants";
import { ApiResponse } from "../lib/types";

interface User {
  id: string;
  username: string;
}

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get<ApiResponse<User>>(
          `${API_BASE_URL}/auth/me`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        const data = res.data;

        if (!data.isSuccess || !data.result) {
          setError(data.errorMessages.join(", ") || "Could not fetch user");
          return;
        }

        setUser(data.result);
      } catch (err: any) {
        console.error(err);
        setError("Not authorized or session expired.");
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  if (error) return <p className="text-red-400 text-center mt-4">{error}</p>;
  if (!user)
    return <p className="text-gray-300 text-center mt-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user.username}</h2>
        <p className="text-gray-400">User ID: {user.id}</p>
      </div>
    </div>
  );
}
