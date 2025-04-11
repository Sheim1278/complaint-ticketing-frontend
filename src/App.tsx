import { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import ComplaintForm from './components/ComplaintForm';
import ComplaintCard from './components/ComplaintCard';
import HomePage from './components/HomePage';
import LoginOptions from './components/LoginOptions';
import type { User, UserRole, Complaint, Message } from './types';
import ComplaintModal from "./components/ComplaintModal"



function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'login-options' | 'login' | 'client' | 'admin'>('landing');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const BASE_URI = import.meta.env.VITE_BASE_URI;

  const [isModalOpen, setModalOpen] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setView('login');
  };

  const handleView = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };
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
      fetchComplaints();
      setView(data.role); // e.g. 'student', 'admin', etc.
    } catch (error) {
      console.error('Login error:', error);

    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  const fetchComplaints = async () => {
    if (user === null)
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
      setComplaints(data); // Set complaints data
    } catch (error) {
      console.error('Error fetching complaints:', error);
      // setError('Failed to load complaints');
    } finally {
      // setLoading(false); // Set loading to false after data is fetched
    }
  };

  // Call fetchComplaints when component mounts
  useEffect(() => {
    fetchComplaints();
  }, [user]);

  // Function to handle sending a message and updating the complaint
  const handleSendMessage = (complaintId: string) => {
    // Update the complaints list with new message and status
    setComplaints(complaints.map(complaint =>
      complaint.id === complaintId
        ? {
          ...complaint,
          messages: [...complaint.messages, newMessage], // Add new message
          status: complaint.status === 'resolved' ? 'in-progress' : complaint.status, // Update status
          updatedAt: new Date().toISOString(), // Update the timestamp
        }
        : complaint
    ));

    // Clear the message input
    // setNewMessage('');
    // setComplaintId('');
  };


 
  return (
    <div className="min-h-screen bg-gradient-to-br">
      <Header
        user={user}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'landing' && (
          <HomePage onRoleSelect={() => setView('login')} />
        )}



        {view === 'login' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <LoginForm onLogin={handleLogin} />
            <button
              onClick={() => setView('landing')}
              className="mt-4  hover:text-blue-700"
            >
              Back to Portal Selection
            </button>
          </div>
        )}

        {user && view === 'admin' && (
          <div className="backdrop-blur-sm bg-white/90 rounded-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            </div>
            <AdminDashboard
              complaints={complaints}
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
        )}

        {user && view === 'client' && (
          <div className="backdrop-blur-sm bg-white/90 rounded-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">My Complaints</h2>
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-md hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isFormOpen ? 'Close Form' : 'New Complaint'}
              </button>
            </div>

            {isFormOpen && (
              <div className="mb-8">
                <ComplaintForm user={user} />
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {complaints
                // .filter((complaint) => complaint.studentId === user.id)
                .map((complaint) => (
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
        )}
      </main>
    </div>
  );
}

export default App;