"use client";

import React, { useState } from "react";

// Types for Task and Subtask
interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  subtasks: Subtask[];
  comments: string[];
  status: "Not Started" | "In Progress" | "Completed";
  parentTaskId?: number;
}

interface Subtask {
  id: number;
  title: string;
  status: "Not Started" | "In Progress" | "Completed";
}

// TaskPage Component
const TasksScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Main Task 1",
      description: "This is the description of the main task 1.",
      assignedTo: "Alice",
      priority: "High",
      dueDate: "2024-12-30",
      subtasks: [
        { id: 1, title: "Subtask 1.1", status: "Not Started" },
        { id: 2, title: "Subtask 1.2", status: "In Progress" },
      ],
      comments: ["Started working on task", "Need more resources"],
      status: "In Progress",
    },
    {
      id: 2,
      title: "Main Task 2",
      description: "This is the description of the main task 2.",
      assignedTo: "Bob",
      priority: "Medium",
      dueDate: "2024-12-25",
      subtasks: [
        { id: 3, title: "Subtask 2.1", status: "Completed" },
        { id: 4, title: "Subtask 2.2", status: "Not Started" },
      ],
      comments: ["Waiting on the team", "Need feedback from manager"],
      status: "Not Started",
    },
  ]);

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState<Task>({
    id: Date.now(),
    title: "",
    description: "",
    assignedTo: "Alice",
    priority: "Medium",
    dueDate: "",
    subtasks: [],
    comments: [],
    status: "Not Started",
  });

  const [newSubtask, setNewSubtask] = useState<{
    title: string;
    status: "Not Started" | "In Progress" | "Completed";
  }>({
    title: "",
    status: "Not Started",
  });

  const [showNewSubtaskForm, setShowNewSubtaskForm] = useState(false);

  // Add state for comment text
  const [commentText, setCommentText] = useState("");

  // Add state to track which task we're adding a subtask to
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle Subtask Status Change
  const handleSubtaskStatusChange = (
    taskId: number,
    subtaskId: number,
    status: "Not Started" | "In Progress" | "Completed"
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map((subtask) =>
              subtask.id === subtaskId ? { ...subtask, status } : subtask
            ),
          }
        : task
    );
    setTasks(updatedTasks);
  };

  // Handle Task Status Change
  const handleTaskStatusChange = (
    taskId: number,
    status: "Not Started" | "In Progress" | "Completed"
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    );
    setTasks(updatedTasks);
  };

  // Handle Task Assignment Change
  const handleAssignmentChange = (taskId: number, assignedTo: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, assignedTo } : task
    );
    setTasks(updatedTasks);
  };

  // Add Comment to Task
  const addComment = (taskId: number, comment: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, comments: [...task.comments, comment] }
        : task
    );
    setTasks(updatedTasks);
  };

  // Handle New Task Form Change
  const handleNewTaskChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: keyof Task
  ) => {
    setNewTask({ ...newTask, [field]: e.target.value });
  };

  // Handle New Subtask Form Change

  const handleNewSubtaskChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, // Make the event type flexible
    field: keyof typeof newSubtask
  ) => {
    setNewSubtask({ ...newSubtask, [field]: e.target.value });
  };

  // Add New Task
  const addNewTask = async () => {
    if (
      !newTask.title.trim() ||
      !newTask.description.trim() ||
      !newTask.dueDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      closeNewTaskForm();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task");
    } finally {
      setIsLoading(false);
    }
  };

  // Add Subtask to Task
  const addNewSubtask = () => {
    const newSubtaskItem = { ...newSubtask, id: Date.now() };
    const updatedTasks = tasks.map((task) =>
      task.id === currentTaskId
        ? { ...task, subtasks: [...task.subtasks, newSubtaskItem] }
        : task
    );

    setTasks(updatedTasks);
    setShowNewSubtaskForm(false);
    setNewSubtask({ title: "", status: "Not Started" });
  };

  // Add cleanup functions
  const closeNewTaskForm = () => {
    setShowNewTaskForm(false);
    setNewTask({
      id: Date.now(),
      title: "",
      description: "",
      assignedTo: "Alice",
      priority: "Medium",
      dueDate: "",
      subtasks: [],
      comments: [],
      status: "Not Started",
    });
  };

  const closeNewSubtaskForm = () => {
    setShowNewSubtaskForm(false);
    setNewSubtask({ title: "", status: "Not Started" });
    setCurrentTaskId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
        Task Management
      </h1>

      <div className="max-w-4xl mx-auto space-y-6 text-black">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p>{task.description}</p>

              <div className="mt-4">
                <strong>Assigned To: </strong>
                <select
                  value={task.assignedTo}
                  onChange={(e) =>
                    handleAssignmentChange(task.id, e.target.value)
                  }
                  className="ml-2 p-2 border rounded"
                >
                  <option value="Alice">Alice</option>
                  <option value="Bob">Bob</option>
                  <option value="Charlie">Charlie</option>
                </select>
              </div>

              <div className="mt-4">
                <strong>Priority: </strong>
                {task.priority}
              </div>
              <div className="mt-4">
                <strong>Due Date: </strong>
                {task.dueDate}
              </div>

              {/* Subtasks */}
              <div className="mt-4">
                <strong>Subtasks:</strong>
                <ul className="space-y-2 mt-2">
                  {task.subtasks.map((subtask) => (
                    <li key={subtask.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={subtask.status === "Completed"}
                        onChange={(e) =>
                          handleSubtaskStatusChange(
                            task.id,
                            subtask.id,
                            e.target.checked ? "Completed" : "Not Started"
                          )
                        }
                        className="mr-2"
                      />
                      {subtask.title} - {subtask.status}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setCurrentTaskId(task.id); // Set the current task ID
                    setShowNewSubtaskForm(true);
                  }}
                  className="mt-4 text-blue-500"
                >
                  + Add Subtask
                </button>
              </div>

              {/* Task Status */}
              <div className="mt-4">
                <strong>Status: </strong>
                <select
                  value={task.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as
                      | "Not Started"
                      | "In Progress"
                      | "Completed";
                    handleTaskStatusChange(task.id, newStatus);
                  }}
                  className="ml-2 p-2 border rounded"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Comments */}
              <div className="mt-4">
                <strong>Comments:</strong>
                <ul className="space-y-2 mt-2">
                  {task.comments.map((comment, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded-md">
                      {comment}
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full p-2 border rounded"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        addComment(task.id, commentText);
                        setCommentText("");
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Task Button */}
      <button
        onClick={() => setShowNewTaskForm(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        + New Task
      </button>

      {/* New Task Form */}
      {showNewTaskForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            <div>
              <label className="block">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => handleNewTaskChange(e, "title")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => handleNewTaskChange(e, "description")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Assigned To</label>
              <select
                value={newTask.assignedTo}
                onChange={(e) => handleNewTaskChange(e, "assignedTo")}
                className="w-full p-2 border rounded"
              >
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Charlie">Charlie</option>
              </select>
            </div>
            <div>
              <label className="block">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => handleNewTaskChange(e, "priority")}
                className="w-full p-2 border rounded"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block">Due Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newTask.dueDate}
                onChange={(e) => handleNewTaskChange(e, "dueDate")}
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={closeNewTaskForm}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addNewTask}
                disabled={isLoading}
                className={`bg-blue-500 text-white p-2 rounded ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                {isLoading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Subtask Form */}
      {showNewSubtaskForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Create New Subtask</h2>
            <div>
              <label className="block">Title</label>
              <input
                type="text"
                value={newSubtask.title}
                onChange={(e) => handleNewSubtaskChange(e, "title")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Status</label>
              <select
                value={newSubtask.status}
                onChange={(e) => handleNewSubtaskChange(e, "status")}
                className="w-full p-2 border rounded"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={closeNewSubtaskForm}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addNewSubtask}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Create Subtask
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksScreen;
