"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaTasks } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // If user is not logged in, don't render the page
  if (!user) {
    return null;
  }

  const isAdmin = user.role.toLowerCase() === "admin";

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Greeting Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hi, {user.name}!</h1>
            <p className="text-gray-600 mt-2">
              You have the following permissions:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700">
              <li>View Dashboard</li>
              {isAdmin && <li>Manage Users</li>}
              {isAdmin && <li>Manage Roles</li>}
            </ul>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* User Details Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold"
            aria-label={`Avatar for ${user.name}`}
            title={user.name}
          >
            {getInitials(user.name)}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600 capitalize">Role: {user.role}</p>
            <p className="text-gray-600">ID: {user.id}</p>
          </div>
        </div>

        {/* Action Tiles */}
        {isAdmin && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
              <div className="mb-4">
                <MdManageAccounts className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Manage Users
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Add, edit, or remove users from the system.
              </p>
              <Link
                href="/users"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Go to Manage Users
              </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
              <div className="mb-4">
                <FaTasks className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Manage Roles
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Define and assign roles.
              </p>
              <Link
                href="/roles"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Go to Manage Roles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}