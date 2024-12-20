"use client";
import React, { useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <button
          className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md m-2 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md m-2 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
