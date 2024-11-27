// components/Navbar.js
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome, FaUsers, FaUserShield, FaInfoCircle, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div>
                {/* Replace '/logo.png' with your actual logo path */}
                {/* <Image src="/images/logo.png" alt="Admin-Sphere-Prod Logo" width={40} height={40} /> */}
              </div>
            </Link>
            <Link href="/">
              <div className="ml-3 text-white font-bold text-xl">Admin-Sphere-Prod</div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center space-x-4">
            <NavItem href="/" icon={<FaHome />} label="Home" />
            <NavItem href="/users" icon={<FaUsers />} label="Users" />
            <NavItem href="/roles" icon={<FaUserShield />} label="Roles" />
            <NavItem href="/about" icon={<FaInfoCircle />} label="About" />
          </div>

          {/* User Profile Dropdown (Optional) */}
          {/* Uncomment and customize if you have user authentication */}
          {/* <div className="hidden md:flex items-center">
            <UserProfile />
          </div> */}

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-600 to-indigo-600">
          <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavItem href="/" icon={<FaHome />} label="Home" toggleMenu={toggleMenu} />
            <MobileNavItem href="/users" icon={<FaUsers />} label="Users" toggleMenu={toggleMenu} />
            <MobileNavItem href="/roles" icon={<FaUserShield />} label="Roles" toggleMenu={toggleMenu} />
            <MobileNavItem href="/about" icon={<FaInfoCircle />} label="About" toggleMenu={toggleMenu} />
            {/* Add more mobile nav items here */}
            {/* <li>
              <Link href="/profile">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700 flex items-center">
                  <FaUserCircle className="mr-2" /> Profile
                </a>
              </Link>
            </li> */}
          </ul>
        </div>
      )}
    </nav>
  );
};

// NavItem Component for Desktop
const NavItem = ({ href, icon, label }) => {
  return (
    <Link href={href}>
      <div className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors duration-300">
        {icon}
        <span className="ml-2">{label}</span>
      </div>
    </Link>
  );
};

// MobileNavItem Component
const MobileNavItem = ({ href, icon, label, toggleMenu }) => {
  return (
    <li>
      <Link href={href}>
        <div
          onClick={toggleMenu}
          className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700 flex items-center"
        >
          {icon}
          <span className="ml-2">{label}</span>
        </div>
      </Link>
    </li>
  );
};

// UserProfile Component (Optional)
// Uncomment and customize if you have user authentication
/*
const UserProfile = () => {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center text-white focus:outline-none">
        <FaUserCircle size={24} />
      </button>
      {dropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
          <Link href="/profile">
            <a className="block px-4 py-2 text-gray-800 hover:bg-indigo-600 hover:text-white">Profile</a>
          </Link>
          <Link href="/settings">
            <a className="block px-4 py-2 text-gray-800 hover:bg-indigo-600 hover:text-white">Settings</a>
          </Link>
          <button
            onClick={() => { /* Add logout functionality here * / }}
            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-600 hover:text-white"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
*/

export default Navbar;