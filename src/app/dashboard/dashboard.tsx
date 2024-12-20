"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardScreen = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the JWT from storage
    router.push("/login"); // Redirect to login page
  };

  const auth = {
    setToken: (token: string) => {
      localStorage.setItem("token", token);
    },
  };

  useEffect(() => {
    const validateToken = async () => {
      const authToken = localStorage.getItem("token");
      console.log(authToken);

      if (!authToken) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3002/api/auth/protected-route",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        router.push("/login");
      }
    };

    validateToken();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-gray-800 text-white flex flex-col transition-all duration-300`}
      >
        <button
          className="p-4 focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Close" : "Open"}
        </button>
        <nav className="flex-1">
          <ul className="space-y-4 mt-4">
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
                onClick={() => router.push("/priority")}
              >
                Priority
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
                onClick={() => router.push("/status")}
              >
                Status
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
                onClick={() => router.push("/team-members")}
              >
                Team Members
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-gray-70 flex justify-start items-center p-4 shadow-md">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="space-x-12 px-10">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => router.push("/dashboard/tasks")}
            >
              Tasks
            </button>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => router.push("/dashboard/cases")}
            >
              Cases
            </button>
          </div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 bg-gray-50">
          <p>
            Welcome to your dashboard! Select an item from the sidebar or
            navigation bar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
