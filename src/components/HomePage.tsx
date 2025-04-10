import { GraduationCap, TicketCheck } from 'lucide-react';

interface HomePageProps {
  onRoleSelect: () => void;
}

export default function HomePage({ onRoleSelect }: HomePageProps) {
  return (
    <div className="space-y-12">


      {/* Hero Section */}
      <div className="text-center backdrop-blur-sm bg-white/20 rounded-xl p-8 space-y-6">
        <div className="flex justify-center">
          <GraduationCap className="h-20 w-20 text-cyan-400" />
        </div>
        <h1 className="text-5xl font-bold text-white">Welcome to DEPI</h1>
        <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
          Your one-stop solution for managing academic activities and connecting with essential university services.
        </p>
      </div>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white text-center">Submit a Ticket</h2>
        <div className=" gap-8">


          <div className="backdrop-blur-sm bg-white/10 rounded-xl p-8 border border-white/30">
            <div className="flex justify-center mb-4">
              <TicketCheck className="h-12 w-12 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 text-center">Ticketing system </h3>
            <p className="text-cyan-100 text-center">
              Use our intelligent ticketing system to report issues, lodge complaints, or request
              assistance for quick resolution.
              {/* Get Started Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => onRoleSelect()}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-semibold rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>
              </div>

            </p>
          </div>

        </div>
      </div>
      {/* Vision & Mission */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="backdrop-blur-sm bg-white/10 rounded-xl p-8 border border-white/30">
          <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
          <p className="text-cyan-100">
            To create an innovative, student-centric platform that fosters academic success,
            effective communication, and seamless access to university services.
          </p>
        </div>
        <div className="backdrop-blur-sm bg-white/10 rounded-xl p-8 border border-white/30">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-cyan-100">
            We aim to empower students by providing a centralized system for academic management,
            enabling efficient problem resolution, and fostering a supportive learning environment.
          </p>
        </div>
      </div>

      {/* Features */}

    </div>
  );
}