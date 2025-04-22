import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
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
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async (username: string, password: string) => {
    try {
      setLoginError(''); // Clear any previous errors
      const response = await fetch(`${BASE_URI}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid username or password');
      }

      const data = await response.json();

      setUser({ id: data.id, username: data.username, role: data.role, access_token: data.access_token });
      localStorage.setItem('user', JSON.stringify(data));
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
      setLoginError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  };

  const handleSignup = async (username: string, email: string, password: string) => {
    try {
      console.log(JSON.stringify({ username, email, password }));
      const response = await fetch(`${BASE_URI}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // After successful signup, log the user in automatically
      handleLogin(username, password);
    } catch (error) {
      console.error('Registration error:', error);
      return error instanceof Error ? error.message : 'Registration failed';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
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
    const initializeUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
        <div className=" text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <Header user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-8 ">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
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
                <LoginForm onLogin={handleLogin} backendError={loginError} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <SignupForm onSignup={handleSignup} />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user && user.role !== 'client' ? (
                <div className="backdrop-blur-sm bg-gray-200  rounded-xl p-8">
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
                <div className="backdrop-blur-sm bg-gray-200  rounded-xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold ">My Complaints</h2>
                    <Link
                      to="/new-complaint"
                      className="px-4 py-2  text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                <ComplaintForm user={user} OnFormSubmit={fetchComplaints} />
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