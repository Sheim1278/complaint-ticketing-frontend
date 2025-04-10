import { Bell, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import type { User, Complaint, Message } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  notifications: { complaint: Complaint; unreadCount: number }[];
  onNotificationClick: (complaint: Complaint) => void;
}

export default function Header({ user, onLogout, notifications = [], onNotificationClick }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const totalUnreadCount = notifications.reduce((sum, n) => sum + n.unreadCount, 0);

  const handleNotificationClick = (complaint: Complaint) => {
    onNotificationClick(complaint);
    setIsNotificationOpen(false);
  };

  return (
    <header className="from-purple-800 to-purple-700 bg-gradient-to-b shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Menu className="h-6 w-6 text-gray-500 sm:hidden" />
            <h1 className="ml-2 text-xl font-bold text-gray-900 ">
              Consumer Support
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 relative"
                >
                  <Bell className="h-6 w-6 text-gray-500" />
                  {totalUnreadCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalUnreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    {notifications.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(({ complaint, unreadCount }) => (
                          <button
                            key={complaint.id}
                            onClick={() => handleNotificationClick(complaint)}
                            className="w-full px-4 py-3 hover:bg-gray-50 flex items-start text-left border-b border-gray-100"
                          >
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-900">
                                  {complaint.title}
                                </p>
                                {unreadCount > 0 && (
                                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {complaint.messages[complaint.messages.length - 1]?.content.substring(0, 50)}...
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(complaint.messages[complaint.messages.length - 1]?.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No new notifications
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Welcome, {user.username}
                </span>
                <button 
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 flex items-center"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}