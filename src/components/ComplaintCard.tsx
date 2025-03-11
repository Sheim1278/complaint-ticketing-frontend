import { Clock, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import type { Complaint, Message } from '../types';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
};

interface ComplaintCardProps {
  complaint: Complaint;
  userRole: 'student' | 'admin';
  onSendMessage: (complaintId: string, message: string) => void;
}

export default function ComplaintCard({ complaint, userRole, onSendMessage }: ComplaintCardProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(complaint.id, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[complaint.status]}`}>
          {complaint.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{complaint.description}</p>
      
      {complaint.messages.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800 mb-2"
          >
            {isExpanded ? 'Show Less' : `Show Conversation (${complaint.messages.length})`}
          </button>
          
          {isExpanded && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {complaint.messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.sender === userRole
                      ? 'bg-blue-50 ml-8'
                      : 'bg-gray-50 mr-8'
                  }`}
                >
                  <p className="text-sm text-gray-900">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-w-0 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center">
          <MessageCircle className="h-4 w-4 mr-1" />
          <span>Category: {complaint.category}</span>
        </div>
      </div>
    </div>
  );
}