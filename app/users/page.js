// pages/index.js
"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTasks } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";

export default function page() {
  // Mock current user data
  const currentUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin", // Change to 'user' to test non-admin view
    id: "123456",
    // avatar: "/avatar.png", // No longer needed since we're using initials
  };

  const isAdmin = currentUser.role === "admin";

  // State for users fetched from backend
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  // State for new user form
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  });
  const [addingUser, setAddingUser] = useState(false);
  const [errorAddingUser, setErrorAddingUser] = useState(null);

  // Fetch users from backend when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
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
  }, []);

  // Helper function to get user initials
  const getInitials = (name) => {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }
    const initials = names[0][0] + names[names.length - 1][0];
    return initials.toUpperCase();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    setErrorAddingUser(null);

    // Basic validation
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.status) {
      setErrorAddingUser("All fields are required.");
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

      //recall the fetchUsers function to update the users list

      try {
        setLoad
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


      setAddingUser(false);
    } catch (error) {
      setErrorAddingUser(error.message);
      setAddingUser(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">


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
                    users.map((user, index) => (
                      <tr key={index} className="border-t">
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
                          {/* Placeholder for actions like Edit/Delete */}
                          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add New User Form */}
        {isAdmin && (
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

              {/* Role Field */}
              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700 mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  {/* Add more roles as needed */}
                </select>
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
              {errorAddingUser && (
                <p className="text-red-500 mb-4">{errorAddingUser}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ${addingUser ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={addingUser}
              >
                {addingUser ? "Adding..." : "Add User"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}