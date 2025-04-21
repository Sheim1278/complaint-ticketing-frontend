import { Bell, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import type { User, Complaint, Message } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="from-cyan-800 to-blue-800 bg-gradient-to-tr shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center" onClick={() => navigate('/')}>
            <h1 className="ml-2 text-3xl font-bold text-white cursor-pointer">
              Ticketing Portal
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg font-extrabold"
            >
              Home
            </Link>
            {user && user.role !== 'client' &&
              <Link
                to="/admin"
                className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg font-extrabold"
              >
                Dashboard
              </Link>
            }
            {user && user.role === "client" && (
              <Link
                to="/complains"
                className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg font-extrabold"
              >
                Complaints
              </Link>
            )}
          </div>

          {user ? (

            <div className="flex items-center space-x-2">
              <span className="text-sm text-white">
                Welcome, {user.username}
              </span>
              <button
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-gray-700 text-white flex items-center ms-9"
              >
                Log Out
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white  hover:bg-gray-700 px-4 py-2 rounded-lg border border-slate-400">
                Login
              </Link>
              <Link to="/signup" className="text-white  hover:bg-gray-700 px-4 py-2 rounded-lg border border-slate-400">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}