import { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import ComplaintForm from './components/ComplaintForm';
import ComplaintCard from './components/ComplaintCard';
import HomePage from './components/HomePage';
import LoginOptions from './components/LoginOptions';
import type { User, UserRole, Complaint, Message } from './types';

// Mock users for demonstration


// // Mock complaints data with messages
// const mockComplaints: Complaint[] = [
//   {
//     id: '1',
//     title: 'Course Registration Issue',
//     description: 'Unable to register for required courses',
//     category: 'academic',
//     status: 'pending',
//     priority: 'high',
//     createdAt: '2024-03-10T10:00:00Z',
//     updatedAt: '2024-03-10T10:00:00Z',
//     studentId: '12345',
//     messages: []
//   },
//   {
//     id: '2',
//     title: 'Library Access Problem',
//     description: 'Cannot access online library resources',
//     category: 'technical',
//     status: 'in-progress',
//     priority: 'medium',
//     createdAt: '2024-03-09T15:30:00Z',
//     updatedAt: '2024-03-10T09:00:00Z',
//     studentId: '12346',
//     messages: [
//       {
//         id: '1',
//         content: 'We are working with the library IT team to resolve your access issue.',
//         sender: 'admin',
//         timestamp: '2024-03-10T09:00:00Z',
//         read: false
//       }
//     ]
//   }
// ];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'login-options' | 'login' | 'client' | 'admin'>('landing');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const BASE_URI = import.meta.env.VITE_BASE_URI;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setView('login');
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
    setUserRole(null);
    setView('landing');
  };

  const fetchComplaints = async () => {
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

  const getNotifications = () => {
    if (!user) return [];

    return complaints
      .filter(complaint => {
        if (user.role === 'admin') {
          return complaint.messages.some(m => m.sender === 'student' && !m.read);
        } else {
          return complaint.studentId === user.id &&
            complaint.messages.some(m => m.sender === 'admin' && !m.read);
        }
      })
      .map(complaint => ({
        complaint,
        unreadCount: complaint.messages.filter(m =>
          m.sender !== user.role && !m.read
        ).length
      }));
  };

  const handleNotificationClick = (complaint: Complaint) => {
    // Mark messages as read
    setComplaints(complaints.map(c =>
      c.id === complaint.id
        ? {
          ...c,
          messages: c.messages.map(m => ({
            ...m,
            read: true
          }))
        }
        : c
    ));
    setSelectedComplaint(complaint);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/90 via-purple-800/90 to-pink-900/90 bg-[url('https://t3.ftcdn.net/jpg/06/24/90/56/360_F_624905687_6jgMrzI78toEYK9Vkp0rB5u2hOKJQXR3.jpg')] bg-fixed bg-cover bg-center bg-blend-overlay">
      <Header
        user={user}
        onLogout={handleLogout}
        notifications={getNotifications()}
        onNotificationClick={handleNotificationClick}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'landing' && (
          <HomePage onRoleSelect={() => setView('login')} />
        )}



        {view === 'login' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <LoginForm onLogin={handleLogin} />
            <button
              onClick={() => setView('login-options')}
              className="mt-4 text-gray-200 hover:text-white"
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
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
                  />
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;