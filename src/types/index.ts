export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';
export type ComplaintPriority = 'low' | 'medium' | 'high';
export type UserRole = 'student' | 'admin';

export interface Message {
  id: string;
  content: string;
  sender: 'admin' | 'student';
  timestamp: string;
  read: boolean;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: string;
  updatedAt: string;
  studentId: string;
  messages: Message[];
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}