"use client";

import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

// Import base URL and ApiResponse from your constants/types files (adjust paths accordingly)
import { API_BASE_URL } from "../lib/constants";
import { ApiResponse } from "../lib/types";

interface User {
  id: string;
  username: string;
}

interface RegisterResult {
  token: string;
  user: User;
}

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    try {
      const res: AxiosResponse<ApiResponse<RegisterResult>> = await axios.post(
        `${API_BASE_URL}/auth/register`,
        { username, password }
      );

      const data = res.data;

      if (!data.isSuccess || !data.result) {
        setError(data.errorMessages.join("\n") || "Registration failed");
        return;
      }

      const { token, user } = data.result;
      localStorage.setItem("token", token);
      setUser(user);
      setError(null);
      router.push("/me");
    } catch (err: any) {
      console.error(err);

      if (err.response && err.response.data) {
        const errorData: ApiResponse<null> = err.response.data;
        const msg = errorData.errorMessages.join("\n") || "Registration failed";
        setError(msg);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={register}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
          >
            Register
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-400">
  Already have an account?{' '}
  <a href="/login" className="text-blue-500 hover:underline">
    Login here
  </a>
</p>

        {error && (
  <pre className="mt-4 text-red-400 text-sm text-center whitespace-pre-wrap">{error}</pre>        
  )}
      </div>
    </div>
  );
}
