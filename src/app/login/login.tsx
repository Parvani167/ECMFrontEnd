"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginUser = async () => {
    try {
      const response = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // const jsonData = JSON.parse(data); // Successfully logged in, redirect to the dashboard
        localStorage.setItem("token", data.token);
        console.log("Login successful:", data);

        router.push("/dashboard");
      } else {
        // Display the error message from the backend
        setError(data.error || "An error occurred during login.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginUser();
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded text-black"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded text-black"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
