import { useState, useEffect } from 'react';
import { Filter, Search, Calendar, TrendingUp, Clock, ThumbsUp, Package2, Download, WatchIcon, GlassWater, Hourglass } from 'lucide-react';


import ComplaintCard from './ComplaintCard';
import type { Complaint, User } from '../types';
import ComplaintModalAdmin from './ComplaintModalAdmin';


interface AdminDashboardProps {
  complaInitialComplaintsints: Complaint[];
  onSendMessage: (complaintId: string, message: string) => void;
  user: User;
}


export default function AdminDashboard({ InitialComplaints, onStatusChange, onSendMessage, userRole, user }: AdminDashboardProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  console.log(InitialComplaints);
  const [complaints, setComplaints] = useState<Complaint[]>(InitialComplaints);
  console.log(complaints);
  const [isModalOpen, setModalOpen] = useState(false);
  const [graphUrls, setGraphUrls] = useState<Record<string, string>>({});
  const BASE_URI = import.meta.env.VITE_BASE_URI;
  const handleView = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };
  const [metrics, setMetrics] = useState({
    total_complaints: 0,
    responded_complaints: 0,
    pending_complaints: 0,
    avg_response_time: 0,
    median_response_time: 0,
    response_rate: 0,
  });

  const fetchDashboardData = async () => {
    if (user.role !== "admin")
      return;
    try {
      const res = await fetch(`${BASE_URI}/analytics/admin/dashboard`);
      const data = await res.json();
      setGraphUrls(data.graph_urls);
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const fetchComplaints = async () => {
    if (user === null)
      return;
    if (user.role === "admin")
      return;
    try {
      if (!user.access_token) {
        console.error('Access token is missing');
        return;
      }
      console.log(user.access_token);  // Check if the token is present
      const response = await fetch(`${BASE_URI}/complaint/allcomplaints`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const data = await response.json();
      console.log(data);
      setComplaints(data); // Set complaints data
    } catch (error) {
      console.error('Error fetching complaints:', error);
      // setError('Failed to load complaints');
    } finally {
      // setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchComplaints();
  }, []);
  return (
    <div className="space-y-6">


      {user.role === "admin" &&
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          </div>
          <div id="stats-section" className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Complaints</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{metrics.total_complaints} Complaints</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-full">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Responded Complains</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{metrics.responded_complaints} Complaints</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <ThumbsUp className="h-6 w-6 text-green-600" />

                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Complaints</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{metrics.pending_complaints} Complaints</p>

                </div>

                <div className="p-3 bg-green-50 rounded-full">
                  <Hourglass className="h-6 w-6 text-blue-600" />

                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Average Response Time</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{metrics.avg_response_time.toFixed(2)} Minutes</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(graphUrls).map(([key, url]) => (
              <div key={key} className="bg-white rounded-lg shadow p-2">
                <iframe
                  src={BASE_URI + url}
                  title={key}
                  className="w-full h-[400px] rounded"
                  frameBorder="0"
                />
              </div>
            ))}
          </div>
        </>
      }
      {user && user.role !== "admin" && (
        <>
          <div className="space-y-6 mb-12">
            <h3 className="text-lg font-medium text-gray-900">Recent Complaints</h3>
            <div className="overflow-y-scroll h-screen">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {complaints && complaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    userRole={userRole}
                    onView={handleView}
                  />
                ))}
              </div>
            </div>
          </div>

          <ComplaintModalAdmin
            isOpen={isModalOpen}
            onClose={() => { setModalOpen(false); fetchComplaints(); }}
            complaint={selectedComplaint}
            user={user}
          />
        </>
      )}

    </div>
  );
}