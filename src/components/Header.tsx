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
    <header className="from-cyan-800 to-blue-800 bg-gradient-to-tr shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-6">
            <div onClick={() => navigate('/')} className="flex items-center hover:opacity-90 transition-opacity">
              <h1 className="ml-2 text-3xl font-bold text-white cursor-pointer tracking-tight">
                Ticketing Portal
              </h1>
            </div>
            <Link
              to="/"
              className="text-white hover:bg-white/10 px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium border-2 border-white/20"
            >
              Home
            </Link>
            {user && user.role !== 'client' &&
              <Link
                to="/admin"
                className="text-white hover:bg-white/10 px-5 py-2.5 rounded-lg transition-colors duration-200 font-semibold border-2 border-white/20"
              >
                Dashboard
              </Link>
            }
            {user && user.role === "client" && (
              <Link
                to="/complains"
                className="text-white hover:bg-white/10 px-5 py-2.5 rounded-lg transition-colors duration-200 font-semibold border-2 border-white/20"
              >
                Complaints
              </Link>
            )}
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-base text-white/90 font-medium">
                Welcome, {user.username}
              </span>
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg hover:bg-white/10 text-white flex items-center space-x-2 transition-colors duration-200 border-2 border-white/20"
              >
                <span>Log Out</span>
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white hover:bg-white/10 px-5 py-2.5 rounded-lg transition-colors duration-200 border-2 border-white/20">
                Login
              </Link>
              <Link to="/signup" className="text-white hover:bg-white/10 px-5 py-2.5 rounded-lg transition-colors duration-200 border-2 border-white/20">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}