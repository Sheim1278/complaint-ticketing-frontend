import { MessageCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import type { Complaint } from '../types';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
};

interface ComplaintCardProps {
  complaint: Complaint;
  userRole: 'student' | 'client';
  onView: (complaint: Complaint) => void; // New view callback
}

export default function ComplaintCard({ complaint, userRole, onView }: ComplaintCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow  border-2 border-cyan-500">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold  truncate">{complaint.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium truncate border border-blue-600`}>
          {complaint.category}
        </span>
      </div>

      <p className={` mb-4 line-clamp-2  ${isExpanded ? '' : 'truncate'}`}>{complaint.description}</p>

      {complaint.ai_response.length > 0 && (
        <div className="mb-4">
          <div className="font-bold ">AI Response:</div>
          <div className={`space-y-3 max-h-60 overflow-y-auto ${isExpanded ? '' : 'truncate'}`}>
            {complaint.ai_response}
          </div>
          <div className="flex  ">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-300 hover:text-blue-400 mb-2 mt-4"
            >
              {isExpanded ? 'Show Less' : `Show Conversation `}
            </button>
          </div>

        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onView(complaint)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-sm"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      </div>

      <div className="flex items-center justify-between text-sm  mt-4">
        <div className="flex items-center">
          <MessageCircle className="h-4 w-4 mr-1" />
          <span>Sub Category: {complaint.sub_category}</span>
        </div>
      </div>
    </div>
  );
}
