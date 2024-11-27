// components/Navbar.js
"use client"
import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            {/* Logo */}
            <div>
              <Link href="/">
                <div className="flex items-center py-4 px-2">
                  {/* You can replace the text with an image logo */}
                  <span className="font-semibold text-gray-500 text-lg">Dashboard</span>
                </div>
              </Link>
            </div>
            {/* Primary Navbar items */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <div className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300">Home</div>
              </Link>
              <Link href="/users">
                <div className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300">Users</div>
              </Link>
              <Link href="/roles">
                <div className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300">Roles</div>
              </Link>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              className="outline-none mobile-menu-button"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6 text-gray-500 hover:text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu md:hidden">
          <ul className="">
            <li className="active">
              <Link href="/">
                <div className="block text-sm px-2 py-4 text-white bg-blue-500 font-semibold">Home</div>
              </Link>
            </li>
            <li>
              <Link href="/roles">
                <div className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300">Roles</div>
              </Link>
            </li>
            <li>
              <Link href="/users">
                <div className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300">Users</div>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;