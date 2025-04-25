import { useState, useEffect } from 'react';
import { TrendingUp, Clock, ThumbsUp, Hourglass } from 'lucide-react';

import ComplaintCard from './ComplaintCard';
import type { Complaint, User } from '../types';
import ComplaintModalAdmin from './ComplaintModalAdmin';
import ComplaintModal from './ComplaintModal';

interface AdminDashboardProps {
  InitialComplaints?: Complaint[];
  userRole?: "student" | "client" | "employee"; // Add employee to possible roles
  user: User;
}

export default function AdminDashboard({ InitialComplaints, userRole = "client", user }: AdminDashboardProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(InitialComplaints || []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [graphUrls, setGraphUrls] = useState<Record<string, string>>({});
  const BASE_URI = import.meta.env.VITE_BASE_URI;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'complaints'>('dashboard');

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
    if (user.role !== "admin") return;

    setIsLoading(true);
    setError(null);

    try {
      let url = `${BASE_URI}/analytics/admin/dashboard`;
      const queryParams = new URLSearchParams();

      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const text = await res.text(); // Get response as text first
      const sanitizedText = text.replace(/:\s*NaN/g, ':0'); // Replace NaN with 0
      const data = JSON.parse(sanitizedText);

      setGraphUrls(data.graph_urls || {});
      setMetrics({
        total_complaints: data.metrics.total_complaints || 0,
        responded_complaints: data.metrics.responded_complaints || 0,
        pending_complaints: data.metrics.pending_complaints || 0,
        avg_response_time: data.metrics.avg_response_time || 0,
        median_response_time: data.metrics.median_response_time || 0,
        response_rate: data.metrics.response_rate || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComplaints = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      let url = `${BASE_URI}/complaint/allcomplaints`

      const queryParams = new URLSearchParams();

      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url, {
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
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError('Failed to load complaints. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        fetchDashboardData();
      }
      fetchComplaints();
    }
  }, [user, startDate, endDate]);

  const RetryableIframe = ({ src, title }: { src: string, title: string }) => {
    const [retryCount, setRetryCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const maxRetries = 3;

    const handleError = () => {
      setError(true);
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setError(false);
          setLoading(true);
        }, 1000 * (retryCount + 1)); // Exponential backoff
      }
    };

    const handleLoad = () => {
      setLoading(false);
      setError(false);
    };

    return (
      <div className="relative">
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        {error && retryCount >= maxRetries && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-50">
            <p className="text-red-600">Failed to load graph</p>
          </div>
        )}
        <iframe
          key={retryCount}
          src={src}
          title={title}
          className="w-full h-[400px] rounded"
          frameBorder="0"
          onError={handleError}
          onLoad={handleLoad}
        />
      </div>
    );
  };

  const renderComplaintsView = () => (
    <>
    <div className="space-y-6 mb-12 ">
      <h3 className="text-lg font-medium ">Recent Complaints</h3>
      <div className="">
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
    <ComplaintModal
                isOpen={isModalOpen}
                onClose={() => { setModalOpen(false); fetchComplaints(); }}
                complaint={selectedComplaint}
                user={user}
              />
    </>
  );
  const renderComplaintsEmployeeView = () => (
    <>
    <div className="space-y-6 mb-12 ">
      <h3 className="text-lg font-medium ">Recent Complaints</h3>
      <div className="">
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
  );

  const renderDashboardView = () => (
    <>
      <div id="stats-section" className="grid grid-cols-1 md:grid-cols-4 gap-4  ">
        <div className="bg-white p-6 rounded-lg shadow border-2 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium ">Total Complaints</p>
              <p className="mt-1 text-3xl font-semibold ">{metrics.total_complaints} <br></br> Complaints</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-2 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium ">Responded Complains</p>
              <p className="mt-1 text-3xl font-semibold ">{metrics.responded_complaints} <br></br> Complaints</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <ThumbsUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-2 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium ">Pending Complaints</p>
              <p className="mt-1 text-3xl font-semibold ">{metrics.pending_complaints} <br></br> Complaints</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Hourglass className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-2 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium ">Average Response Time</p>
              <p className="mt-1 text-3xl font-semibold ">{metrics.avg_response_time.toFixed(2)} <br></br>  Minutes</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(graphUrls).map(([key, url]) => (
          <div key={key} className="bg-white rounded-lg shadow p-2 border-2 border-cyan-500">
            <RetryableIframe
              src={BASE_URI + url}
              title={key}
            />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-6 ">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {user.role === "admin" ? (
            <>
              <div className="flex flex-col space-y-4 ">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 border-b">
                    <button
                      className={`py-2 px-4 ${activeTab === 'dashboard'
                          ? 'border-b-2 border-blue-500 text-blue-600 hover:text-blue-400'
                          : 'hover:text-gray-700'
                        }`}
                      onClick={() => setActiveTab('dashboard')}
                    >
                      Dashboard
                    </button>
                    <button
                      className={`py-2 px-4 ${activeTab === 'complaints'
                          ? 'border-b-2 border-blue-500 text-blue-600 hover:text-blue-400'
                          : ' hover:text-gray-700'
                        }`}
                      onClick={() => setActiveTab('complaints')}
                    >
                      Complaints
                    </button>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center space-x-2">
                      <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border-2 border-cyan-500 rounded-md p-2 bg-white"
                        placeholder="Start Date"
                      />
                      <span>to</span>
                      <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border-2 border-cyan-500 rounded-md p-2 bg-white"
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                </div>

                {activeTab === 'dashboard' ? renderDashboardView() : renderComplaintsView()}
              </div>
            </>
          ) : (
            <div className="space-y-6 mb-12">

              {renderComplaintsEmployeeView() }
              
          
            </div>
          )}
        </>
      )}
    </div>
  );
}