import { UserRole } from '../types';
import { Home } from 'lucide-react';

interface LoginOptionsProps {
  onRoleSelect: (role: UserRole) => void;
}

export default function LoginOptions({ onRoleSelect }: LoginOptionsProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-6 w-full max-w-4xl">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
        
        <h2 className="text-3xl font-bold text-white text-center">Choose Your Portal</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => onRoleSelect('student')}
            className="group flex flex-col items-center p-8 bg-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all backdrop-blur-sm hover:bg-white/20 border border-white/30"
          >
            <div className="w-16 h-16 text-cyan-400 mb-4 group-hover:scale-110 transition-transform">🎓</div>
            <h2 className="text-2xl font-semibold text-white mb-2">Student Portal</h2>
            <p className="text-cyan-100 text-center">Submit and track your complaints</p>
          </button>

          <button
            onClick={() => onRoleSelect('admin')}
            className="group flex flex-col items-center p-8 bg-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all backdrop-blur-sm hover:bg-white/20 border border-white/30"
          >
            <div className="w-16 h-16 text-cyan-400 mb-4 group-hover:scale-110 transition-transform">🛡️</div>
            <h2 className="text-2xl font-semibold text-white mb-2">Admin Dashboard</h2>
            <p className="text-cyan-100 text-center">Manage and resolve student complaints</p>
          </button>
        </div>
      </div>
    </div>
  );
}