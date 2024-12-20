"use client";

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Updated import syntax

// TypeScript Interface for Basic Case Data
interface CaseBasic {
  Case_id: number;
  Name: string;
}

// TypeScript Interface for Detailed Case Data
interface CaseDetail {
  Case_id: number;
  Name: string;
  TeamManager: string;
  Description: string;
  Start: string;
  End: string;
  Status: "CREATED" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";
  CreatedAt: string;
  UpdatedAt: string;
}

interface DecodedToken {
  role: string;
  email: string;
  // add other token payload fields if needed
}

const CasesScreen = () => {
  const [cases, setCases] = useState<CaseBasic[]>([]);
  const [expandedCase, setExpandedCase] = useState<CaseDetail | null>(null);
  const [expandedCaseId, setExpandedCaseId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [newCase, setNewCase] = useState({
    Start: "",
    End: "",
    Name: "",
    TeamManager: "",
    Status: "CREATED",
    Description: "",
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedCase, setEditedCase] = useState<CaseDetail | null>(null);

  // Get user role from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("Full decoded token:", decoded); // Detailed log
        console.log("Token role:", decoded.role); // Specifically log the role
        console.log("Token type:", typeof decoded); // Log the type
        console.log("Token keys:", Object.keys(decoded)); // Log all available keys
        setUserRole(decoded.role.toUpperCase());
      } catch (error) {
        console.error("Error decoding token:", error);
        console.error("Token content:", token); // Log the raw token if decode fails
      }
    } else {
      console.log("No token found in localStorage");
    }
  }, []);

  // Fetch initial cases list
  useEffect(() => {
    const fetchCases = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3002/api/cases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const { data } = await response.json();
          console.log("API Response:", data); // Debug log
          setCases(data || []);
        }
      } catch (error) {
        console.error("Error fetching cases:", error);
        setCases([]); // Set empty array on error
      }
    };

    fetchCases();
  }, []);

  // Fetch case details when an accordion is clicked
  const fetchCaseDetails = async (id: number) => {
    console.log("Clicked case ID:", id);

    if (expandedCaseId === id) {
      console.log("Closing case ID:", id);
      setExpandedCaseId(null);
      setExpandedCase(null);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      console.log(`Making API call for case ID: ${id}`);

      const response = await fetch(`http://localhost:3002/api/cases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Case ${id} details:`, data);

        // Extract the first item from the array
        const caseDetail = Array.isArray(data) ? data[0] : data;

        setExpandedCase(caseDetail);
        setExpandedCaseId(id);
      } else {
        console.error(`Failed to fetch case ${id} details:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching case ${id} details:`, error);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3002/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCase),
      });

      if (response.ok) {
        // Refresh the cases list
        const fetchResponse = await fetch("http://localhost:3002/api/cases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (fetchResponse.ok) {
          const { data } = await fetchResponse.json();
          setCases(data || []);
        }

        // Reset form and close modal
        setNewCase({
          Start: "",
          End: "",
          Name: "",
          TeamManager: "",
          Status: "CREATED",
          Description: "",
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating case:", error);
    }
  };

  const handleEditClick = (caseDetail: CaseDetail) => {
    setIsEditing(caseDetail.Case_id);
    setEditedCase(caseDetail);
  };

  const handleEditSave = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3002/api/cases/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedCase),
      });

      if (response.ok) {
        // Update the expanded case view with edited data
        setExpandedCase(editedCase);
        // Reset editing state
        setIsEditing(null);
        setEditedCase(null);
        // Refresh the cases list
        const fetchResponse = await fetch("http://localhost:3002/api/cases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (fetchResponse.ok) {
          const { data } = await fetchResponse.json();
          setCases(data || []);
        }
      } else {
        console.error("Failed to update case");
      }
    } catch (error) {
      console.error("Error updating case:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
        Case Dashboard
      </h1>

      {/* Case List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {cases.map((caseItem) => (
          <div
            key={caseItem.Case_id}
            className="bg-white shadow-md rounded-lg overflow-hidden text-black"
          >
            {/* Accordion Header */}
            <button
              onClick={() => fetchCaseDetails(caseItem.Case_id)}
              className="w-full text-left p-4 bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-300"
            >
              {caseItem.Name}
            </button>

            {/* Expanded Case Details */}
            {expandedCaseId === caseItem.Case_id && expandedCase && (
              <div className="p-4 bg-gray-50 border-t space-y-2 text-black">
                {isEditing === caseItem.Case_id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Name:</label>
                      <input
                        type="text"
                        value={editedCase?.Name || ""}
                        onChange={(e) =>
                          setEditedCase((prev) =>
                            prev ? { ...prev, Name: e.target.value } : null
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Team Manager:
                      </label>
                      <input
                        type="text"
                        value={editedCase?.TeamManager || ""}
                        onChange={(e) =>
                          setEditedCase((prev) =>
                            prev
                              ? { ...prev, TeamManager: e.target.value }
                              : null
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Description:
                      </label>
                      <textarea
                        value={editedCase?.Description || ""}
                        onChange={(e) =>
                          setEditedCase((prev) =>
                            prev
                              ? { ...prev, Description: e.target.value }
                              : null
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Start Date:
                      </label>
                      <input
                        type="date"
                        value={editedCase?.Start || ""}
                        onChange={(e) =>
                          setEditedCase((prev) =>
                            prev ? { ...prev, Start: e.target.value } : null
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        End Date:
                      </label>
                      <input
                        type="date"
                        value={editedCase?.End || ""}
                        onChange={(e) =>
                          setEditedCase((prev) =>
                            prev ? { ...prev, End: e.target.value } : null
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Status:
                      </label>
                      <select
                        value={editedCase?.Status || ""}
                        onChange={(e) =>
                          setEditedCase((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  Status: e.target.value as
                                    | "CREATED"
                                    | "IN_PROGRESS"
                                    | "ON_HOLD"
                                    | "COMPLETED",
                                }
                              : null
                          )
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="CREATED">CREATED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="ON_HOLD">ON_HOLD</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSave(caseItem.Case_id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(null);
                          setEditedCase(null);
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <p>
                      <strong>Name:</strong> {expandedCase.Name}
                    </p>
                    <p>
                      <strong>Team Manager:</strong> {expandedCase.TeamManager}
                    </p>
                    <p>
                      <strong>Description:</strong> {expandedCase.Description}
                    </p>
                    <p>
                      <strong>Start Date:</strong> {expandedCase.Start}
                    </p>
                    <p>
                      <strong>End Date:</strong> {expandedCase.End}
                    </p>
                    <p>
                      <strong>Status:</strong> {expandedCase.Status}
                    </p>
                    {userRole === "ADMIN" && (
                      <button
                        onClick={() => handleEditClick(expandedCase)}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Create Button - Only visible for ADMIN */}
      {userRole === "ADMIN" && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-500 text-w p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}

      {/* Create Case Modal - Only rendered if user is ADMIN */}
      {isModalOpen && userRole === "ADMIN" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Create New Case
            </h2>
            <form onSubmit={handleCreateCase} className="space-y-4">
              <input
                type="text"
                placeholder="Case Name"
                className="w-full p-2 border text-black rounded"
                value={newCase.Name}
                onChange={(e) =>
                  setNewCase({ ...newCase, Name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Team Manager"
                className="w-full p-2 border text-black rounded"
                value={newCase.TeamManager}
                onChange={(e) =>
                  setNewCase({ ...newCase, TeamManager: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border text-black rounded"
                value={newCase.Description}
                onChange={(e) =>
                  setNewCase({ ...newCase, Description: e.target.value })
                }
                required
              />
              <input
                type="date"
                placeholder="Start Date"
                className="w-full p-2 border text-black rounded"
                value={newCase.Start}
                onChange={(e) =>
                  setNewCase({ ...newCase, Start: e.target.value })
                }
                required
              />
              <input
                type="date"
                placeholder="End Date"
                className="w-full p-2 border text-black rounded"
                value={newCase.End}
                onChange={(e) =>
                  setNewCase({ ...newCase, End: e.target.value })
                }
                required
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesScreen;
