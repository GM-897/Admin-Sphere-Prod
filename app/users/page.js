// app/users/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTasks } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "", // New field for password
    role: "User",
    status: "Active",
  });
  const [addingUser, setAddingUser] = useState(false);
  const [errorAddingUser, setErrorAddingUser] = useState(null);

  const [deletingUserIds, setDeletingUserIds] = useState([]);
  const [errorDeletingUser, setErrorDeletingUser] = useState(null);

  const [unauthorizedError, setUnauthorizedError] = useState(null);

  // New State Variables for Roles
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [errorRoles, setErrorRoles] = useState(null);

  // Fetch users from backend when component mounts
  useEffect(() => {
    if(!user) {
      router.push("/login");
      return;
    }
    const fetchUsers = async () => {
      // Permission Check: 'view-users'
      if (!user || !user.permissions?.includes("view-users")) {
        setUnauthorizedError("You are not authorized to view users.");
        setLoadingUsers(false);
        return;
      }

      try {
        const response = await fetch("https://dashboard-psi-murex-25.vercel.app/api/users/");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
        setLoadingUsers(false);
      } catch (error) {
        setErrorUsers(error.message);
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Fetch roles from backend when component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("https://dashboard-psi-murex-25.vercel.app/api/roles/");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched Roles:", data); // Debugging line
        setAvailableRoles(data);
        setLoadingRoles(false);
      } catch (error) {
        setErrorRoles(error.message);
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Helper function to get user initials
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.trim().split(" ");
    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }
    const initials = names[0][0] + names[names.length - 1][0];
    return initials.toUpperCase();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === "permissions") {
      let updatedPermissions = [...newUser.permissions];
      if (checked) {
        updatedPermissions.push(value);
      } else {
        updatedPermissions = updatedPermissions.filter((perm) => perm !== value);
      }
      setNewUser((prev) => ({
        ...prev,
        permissions: updatedPermissions,
      }));
    } else {
      setNewUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission to add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    setErrorAddingUser(null);
    setUnauthorizedError(null);

    // Permission Check: 'add-user'
    if (!user.permissions?.includes("add-user")) {
      setUnauthorizedError("You are not authorized to add users.");
      setAddingUser(false);
      return;
    }

    // Basic validation
    if (!newUser.name.trim() || !newUser.email.trim() ||
     !newUser.password.trim() ||
      !newUser.role || !newUser.status) {
      setErrorAddingUser("All fields are required.");
      setAddingUser(false);
      return;
    }

    // Verify that the selected role exists
    const roleExists = availableRoles.some((role) => role.name === newUser.role);
    if (!roleExists) {
      setErrorAddingUser("Selected role is invalid.");
      setAddingUser(false);
      return;
    }

    try {
      const response = await fetch("https://dashboard-psi-murex-25.vercel.app/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const createdUser = await response.json();
      console.log("Created User:", createdUser); // Debugging line

      // Option 1: Re-fetch all users (ensure data consistency)
      try {
        setLoadingUsers(true);
        const response = await fetch("https://dashboard-psi-murex-25.vercel.app/api/users/");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
        setLoadingUsers(false);
      } catch (error) {
        setErrorUsers(error.message);
        setLoadingUsers(false);
      }

      // Option 2: Directly append the new user to the existing state
      // setUsers((prev) => [...prev, createdUser]);

      setAddingUser(false);
      // Reset the form
      setNewUser({
        name: "",
        email: "",
        role: "User",
        status: "Active",
        password: "",
      });
    } catch (error) {
      setErrorAddingUser(error.message);
      setAddingUser(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    // Permission Check: 'delete-user'
    if (!user.permissions?.includes("delete-user")) {
      setUnauthorizedError("You are not authorized to delete users.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    setDeletingUserIds((prev) => [...prev, userId]);
    setErrorDeletingUser(null);
    setUnauthorizedError(null);

    try {
      const response = await fetch(`https://dashboard-psi-murex-25.vercel.app/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      // Option 1: Re-fetch all users to ensure data consistency
      try {
        setLoadingUsers(true);
        const response = await fetch("https://dashboard-psi-murex-25.vercel.app/api/users/");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
        setLoadingUsers(false);
      } catch (error) {
        setErrorUsers(error.message);
        setLoadingUsers(false);
      }

      // Option 2: Remove the deleted user from state
      // setUsers((prev) => prev.filter((u) => u._id !== userId));

      setDeletingUserIds((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      setErrorDeletingUser(`Failed to delete user: ${error.message}`);
      setDeletingUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  // If user is not logged in, don't render the page (handled by AuthContext)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Unauthorized Error Message */}
        {unauthorizedError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {unauthorizedError}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setUnauthorizedError(null)}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z" />
              </svg>
            </span>
          </div>
        )}

        {/* Users Table Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users List</h2>

          {/* Loading and Error States */}
          {loadingUsers ? (
            <p className="text-gray-600">Loading users...</p>
          ) : errorUsers ? (
            <p className="text-red-500">Error: {errorUsers}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-6 bg-gray-200 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 px-6 text-center text-gray-600">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];

                      return (
                        <tr key={user._id} className="border-t">
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-4">
                                {getInitials(user.name)}
                              </div>
                              <span className="text-gray-800">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-700">{user.email}</td>
                          <td className="py-4 px-6 text-gray-700">{user.role}</td>
                          <td className="py-4 px-6 text-gray-700">{user.status}</td>
                          <td className="py-4 px-6 text-center">
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition ${deletingUserIds.includes(user._id) ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              disabled={deletingUserIds.includes(user._id)}
                            >
                              {deletingUserIds.includes(user._id) ? "Deleting..." : "Delete"}
                            </button>

                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Display deletion error if any */}
          {errorDeletingUser && <p className="text-red-500 mt-4">{errorDeletingUser}</p>}
        </div>

        {/* Add New User Form */}
  <div className="mt-12">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New User</h2>
    <form onSubmit={handleAddUser} className="bg-white shadow-md rounded-lg p-6">
      {/* Name Field */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={newUser.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter user's name"
          required
        />
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter user's email"
          required
        />
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password" // Changed to password type
          id="password"
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter user's password"
          required
        />
      </div>

      {/* Role Field */}
      <div className="mb-4">
        <label htmlFor="role" className="block text-gray-700 mb-2">
          Role
        </label>
        {loadingRoles ? (
          <p className="text-gray-600">Loading roles...</p>
        ) : errorRoles ? (
          <p className="text-red-500">Error: {errorRoles}</p>
        ) : (
          <select
            id="role"
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="">Select a role</option>
            {availableRoles.map((role) => (
              <option key={role._id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Status Field */}
      <div className="mb-4">
        <label htmlFor="status" className="block text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={newUser.status}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          {/* Add more statuses as needed */}
        </select>
      </div>

      {/* Error Message */}
      {errorAddingUser && <p className="text-red-500 mb-4">{errorAddingUser}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ${
          addingUser ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={addingUser}
      >
        {addingUser ? "Adding..." : "Add User"}
      </button>
    </form>
  </div>
      </div>
    </div>
  );
}