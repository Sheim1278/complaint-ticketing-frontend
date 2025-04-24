import { useState } from 'react';
import { User, Key, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SignupFormProps {
  onSignup: (username: string, email: string, password: string) => Promise<string | undefined>;
}

export default function SignupForm({ onSignup }: SignupFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [backendError, setBackendError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setBackendError('');

    if (!username || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const error = await onSignup(username, email, password);
    if (error) {
      setBackendError(error);
    }
  };

  return (
    <div className="flex items-center justify-center pt-8 ">
      <div className="max-w-md w-full space-y-8">
        <div className="backdrop-blur-md bg-gray-200  p-8 rounded-2xl shadow-xl border-2 border-cyan-500 ">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <User className="h-10 w-10" />
              <Key className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-bold text-center">
              Sign Up
            </h2>
            <p className="mt-2 text-center">
              Create your account
            </p>
          </div>
          <form className="mt-8 space-y-6 " onSubmit={handleSubmit}>
            {(validationError || backendError) && (
              <div className=" text-sm text-center from-red-500 to-red-700 bg-gradient-to-t py-3 px-4 rounded-lg border  shadow-sm animate-fadeIn">
                {validationError || backendError}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-blue-500 rounded-lg  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent "
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-blue-500 rounded-lg  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent "
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500">
                    <Key className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-blue-500 rounded-lg  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent "
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500">
                    <Key className="h-5 w-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-blue-500 rounded-lg  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent "
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform transition-all duration-200 hover:scale-105"
              >
                Create Account
              </button>
            </div>

            <div className="text-center mt-4">
              <Link to="/login" className="text-sm hover:text-blue-700">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}