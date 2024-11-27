// app/roles/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function RolesPage() {
  // Mock current user data
  const currentUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin", // Change to 'user' to test non-admin view
    id: "123456",
  };

  const isAdmin = currentUser.role.toLowerCase() === "admin";

  // State for roles fetched from backend
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [errorRoles, setErrorRoles] = useState(null);

  // State for new role form
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [],
  });
  const [addingRole, setAddingRole] = useState(false);
  const [errorAddingRole, setErrorAddingRole] = useState(null);

  // State for deletion
  const [deletingRoleIds, setDeletingRoleIds] = useState([]); // To track roles being deleted
  const [errorDeletingRole, setErrorDeletingRole] = useState(null);

  // Available permissions options
  const permissionsOptions = ["add-user", "delete-user", "edit-user", "view-users", "add-role", "delete-role", "edit-role", "view-roles"];

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
        setRoles(data);
        setLoadingRoles(false);
      } catch (error) {
        setErrorRoles(error.message);
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "permissions") {
      let updatedPermissions = [...newRole.permissions];
      if (checked) {
        updatedPermissions.push(value);
      } else {
        updatedPermissions = updatedPermissions.filter((perm) => perm !== value);
      }
      setNewRole((prev) => ({
        ...prev,
        permissions: updatedPermissions,
      }));
    } else {
      setNewRole((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission to add a new role
  const handleAddRole = async (e) => {
    e.preventDefault();
    setAddingRole(true);
    setErrorAddingRole(null);

    // Basic validation
    if (!newRole.name.trim() || newRole.permissions.length === 0) {
      setErrorAddingRole("All fields are required.");
      setAddingRole(false);
      return;
    }

    try {
      const response = await fetch("https://dashboard-psi-murex-25.vercel.app/api/roles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const createdRole = await response.json();
      console.log("Created Role:", createdRole); // Debugging line
      
      try {
        setLoadingRoles(true);
        const response = await fetch("https://dashboard-psi-murex-25.vercel.app/api/roles/");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched Roles:", data); // Debugging line
        setRoles(data);
        setLoadingRoles(false);
      } catch (error) {
        setErrorRoles(error.message);
        setLoadingRoles(false);
      }
      setAddingRole(false);
    } catch (error) {
      setErrorAddingRole(error.message);
      setAddingRole(false);
    }
  };

  // Handle role deletion
  const handleDeleteRole = async (roleId) => {
    const confirmDelete = confirm("Are you sure you want to delete this role?");
    if (!confirmDelete) return;

    setDeletingRoleIds((prev) => [...prev, roleId]);
    setErrorDeletingRole(null);

    try {
      const response = await fetch(`https://dashboard-psi-murex-25.vercel.app/api/roles/${roleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      // Remove the deleted role from state
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
      setDeletingRoleIds((prev) => prev.filter((id) => id !== roleId));

      try {
        setLoadingRoles(true);
        const response = await fetch("https://dashboard-psi-murex-25.vercel.app/api/roles/");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched Roles:", data); // Debugging line
        setRoles(data);
        setLoadingRoles(false);
      } catch (error) {
        setErrorRoles(error.message);
        setLoadingRoles(false);
      }

    } catch (error) {
      setErrorDeletingRole(`Failed to delete role: ${error.message}`);
      setDeletingRoleIds((prev) => prev.filter((id) => id !== roleId));
    }
  };

  // Helper function to format permissions
  const formatPermissions = (permissions) => {
    if (!Array.isArray(permissions)) return "N/A";
    return permissions.map((perm, index) => (
      <span
        key={index}
        className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
      >
        {perm}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Roles Table Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Roles List</h2>

          {/* Loading and Error States */}
          {loadingRoles ? (
            <p className="text-gray-600">Loading roles...</p>
          ) : errorRoles ? (
            <p className="text-red-500">Error: {errorRoles}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="py-3 px-6 bg-gray-200 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-4 px-6 text-center text-gray-600">
                        No roles found.
                      </td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr key={role.id || role.name} className="border-t">
                        <td className="py-4 px-6">
                          <span className="text-gray-800">{role.name}</span>
                        </td>
                        <td className="py-4 px-6">
                          {formatPermissions(role.permissions)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {/* Delete Button */}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteRole(role._id)}
                              className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition ${
                                deletingRoleIds.includes(role._id) ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              disabled={deletingRoleIds.includes(role._id)}
                            >
                              {deletingRoleIds.includes(role.id) ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Display deletion error if any */}
          {errorDeletingRole && (
            <p className="text-red-500 mt-4">{errorDeletingRole}</p>
          )}
        </div>

        {/* Add New Role Form */}
        {isAdmin && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Role</h2>
            <form onSubmit={handleAddRole} className="bg-white shadow-md rounded-lg p-6">
              {/* Role Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newRole.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter role name"
                  required
                />
              </div>

              {/* Permissions Field */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Permissions</label>
                <div className="flex flex-wrap">
                  {permissionsOptions.map((perm) => (
                    <label key={perm} className="mr-4 mb-2 flex items-center">
                      <input
                        type="checkbox"
                        name="permissions"
                        value={perm}
                        checked={newRole.permissions.includes(perm)}
                        onChange={handleInputChange}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700 capitalize">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorAddingRole && (
                <p className="text-red-500 mb-4">{errorAddingRole}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ${
                  addingRole ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={addingRole}
              >
                {addingRole ? "Adding..." : "Add Role"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}