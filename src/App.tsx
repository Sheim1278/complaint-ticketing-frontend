import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import ComplaintForm from './components/ComplaintForm';
import ComplaintCard from './components/ComplaintCard';
import HomePage from './components/HomePage';
import type { User, Complaint } from './types';
import ComplaintModal from "./components/ComplaintModal";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const BASE_URI = import.meta.env.VITE_BASE_URI;
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URI}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      setUser({ id: data.id, username: data.username, role: data.role, access_token: data.access_token });
      console.log(data);
      fetchComplaints();

      // Redirect based on user role
      if (data.role === "client") {
        console.log("Client role detected, redirecting to complaints page.");
        navigate("/complains");
      } else {
        console.log("Non-client role detected, redirecting to admin dashboard.");
        navigate("/admin");
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
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
    fetchComplaints();
  }, [user]);

  const handleSendMessage = (complaintId: string) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === complaintId
        ? {
          ...complaint,
          messages: [...complaint.messages, newMessage],
          status: complaint.status === 'resolved' ? 'in-progress' : complaint.status,
          updatedAt: new Date().toISOString(),
        }
        : complaint
    ));
  };

  const handleView = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <Header user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              user ? (
                user.role === 'client' ? (
                  <Navigate to="/complains" />
                ) : (
                  <Navigate to="/admin" />
                )
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user && user.role !== 'client' ? (
                <div className="backdrop-blur-sm bg-white/90 rounded-xl p-8">
                  <AdminDashboard
                    complaints={complaints}
                    user={user}
                    onStatusChange={(complaintId, newStatus) => {
                      setComplaints(complaints.map(complaint =>
                        complaint.id === complaintId
                          ? { ...complaint, status: newStatus, updatedAt: new Date().toISOString() }
                          : complaint
                      ));
                    }}
                    onSendMessage={handleSendMessage}
                    userRole="admin"
                  />
                </div>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/complains"
            element={
              user && user.role === 'client' ? (
                <div className="backdrop-blur-sm bg-white/90 rounded-xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">My Complaints</h2>
                    <Link
                      to="/new-complaint"
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-md hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      New Complaint
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {complaints.map((complaint) => (
                      <ComplaintCard
                        key={complaint.id}
                        complaint={complaint}
                        userRole="client"
                        onSendMessage={handleSendMessage}
                        onView={handleView}
                      />
                    ))}
                  </div>
                  <ComplaintModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    complaint={selectedComplaint}
                    user={user}
                  />
                </div>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/new-complaint"
            element={
              user && user.role === 'client' ? (
                <ComplaintForm user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;