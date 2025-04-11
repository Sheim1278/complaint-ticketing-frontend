import { Bell, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import type { User, Complaint, Message } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout,  }: HeaderProps) {


 
  return (
    <header className="from-cyan-800 to-blue-800 bg-gradient-to-tr shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Menu className="h-6 w-6 text-white sm:hidden" />
            <h1 className="ml-2 text-3xl font-bold text-white ">
              Ticketing Portal
            </h1>
          </div>

          {user && (


            <div className="flex items-center space-x-2">
              <span className="text-sm text-white">
                Welcome, {user.username}
              </span>
              <button
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-gray-500 text-white flex items-center ms-9"
              >
                Log Out
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}