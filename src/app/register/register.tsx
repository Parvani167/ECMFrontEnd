"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const RegisterComponent = () => {
  const router = useRouter();

  const [values, setValues] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Basic form validation
    if (
      !values.full_name ||
      !values.email ||
      !values.password ||
      !values.confirm_password ||
      !values.role
    ) {
      console.error("All fields are required.");
      return;
    }

    if (values.password !== values.confirm_password) {
      console.error("Passwords do not match.");
      return;
    }

    if (values.password.length < 6) {
      console.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    axios
      .post("http://localhost:3002/register", values)
      .then((res) => {
        console.log("Registration successful");
        router.push("/login");
      })
      .catch((err) => {
        console.error("Error during registration:", err);
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Register
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            name="full_name"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md text-black"
            type="text"
            placeholder="Full Name"
            value={values.full_name}
            onChange={handleChange}
          />

          <input
            name="email"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md text-black"
            type="email"
            placeholder="Email ID"
            value={values.email}
            onChange={handleChange}
          />

          <input
            name="password"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md text-black"
            type="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
          />

          <input
            name="confirm_password"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md text-black"
            type="password"
            placeholder="Confirm Password"
            value={values.confirm_password}
            onChange={handleChange}
          />

          <select
            name="role"
            className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-600 
                       text-black"
            value={values.role}
            onChange={handleChange}
          >
            <option value="" disabled className="text-gray-500 bg-white ">
              Select Role
            </option>
            <option value="admin" className="text-gray-900 dark:text-white">
              Admin
            </option>
            <option value="user" className="text-gray-900 dark:text-white">
              Team Manager
            </option>
            <option value="moderator" className="text-gray-900 dark:text-white">
              Team Member
            </option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;
