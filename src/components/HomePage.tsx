import { ArrowRight, GraduationCap, TicketCheck } from 'lucide-react';

interface HomePageProps {
  onRoleSelect: () => void;
}

export default function HomePage({ onRoleSelect }: HomePageProps) {
  return (
    <div className="space-y-12">


      {/* Hero Section */}
      <div className="text-center backdrop-blur-sm bg-white/20  p-8 space-y-6  ">

        <h1 className="text-5xl font-bold text-black">Welcome to DEPI</h1>
        <p className="text-xl text-black max-w-2xl mx-auto">
          Your all-in-one platform for efficiently managing customer interactions, resolving service requests, and staying seamlessly connected with the support and resources you need.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => onRoleSelect()}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-semibold rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Submit Ticket
          </button>
        </div>
      </div>
      <div className='grid grid-cols-3  shadow-xl rounded-2xl'>

        <div className="backdrop-blur-sm bg-white/10 rounded-xl p-8 col-span-2 ">
          <h2 className="text-2xl font-bold  mb-4">Our Vision</h2>
          <p className="">
            To build an innovative, consumer-centric platform that empowers individuals by delivering exceptional service experiences, facilitating clear and effective communication, and ensuring seamless, user-friendly access to a wide range of essential support services. We aim to create a connected ecosystem that supports every consumer's needs, fosters satisfaction, and drives long-term engagement and success.
          </p>
        </div>
        <div className="backdrop-blur-sm bg-white/10  p-8 border border-white/30 rounded-xl">
          <img src='https://t4.ftcdn.net/jpg/02/19/97/89/360_F_219978944_Q0f2jy0m9RwbIMNqIgEVRGJXdS2DwfbD.jpg' className='h-full rounded-xl  backdrop-blur-md ' />
        </div>
      </div>


      <div className='grid grid-cols-3 rounded-2xl shadow-2xl'>
        <div className="backdrop-blur-sm bg-white/10  p-8 border border-white/30 rounded-xl">
          <img src='https://apvegypt-tray.com/images/1658422953944.jpeg' className='h-full rounded-xl  ' />
        </div>
        <div className="backdrop-blur-sm bg-white/10 rounded-xl p-8 col-span-2">
          <h2 className="text-2xl font-bold  mb-4">Our Mission</h2>
          <p className="">
            We aim to empower consumers by providing a centralized and intuitive system for managing their service needs, streamlining the resolution of issues with efficiency and transparency, and fostering a responsive, supportive environment that prioritizes satisfaction, trust, and long-term engagement. Our goal is to enhance every aspect of the consumer experience through innovation, accessibility, and exceptional support.
          </p>
        </div>
      </div>
      <div className="space-y-6">

        <div className="backdrop-blur-sm bg-white/10 rounded-xl p-8 shadow-2xl">

          <h3 className="text-2xl font-bold text-center mb-4">Ticketing system </h3>
          <p className=" text-center">
            Experience seamless support with our advanced AI-powered ticketing system, designed to intelligently handle consumer needs.
            Effortlessly report issues, lodge complaints, or request assistance through an intuitive interface that ensures your concerns are prioritized and resolved quickly. Our system leverages artificial intelligence to streamline communication, track progress in real-time, and deliver personalized, efficient solutions—empowering you with faster, smarter support every step of the way.
            {/* Get Started Button */}
            <div className="flex justify-center">
              <button
                onClick={() => onRoleSelect()}
                className="px-8 mt-4 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-semibold rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex"
              >
                submit ticket
                {/* <ArrowRight className='ms-4 my-auto' /> */}
              </button>
            </div>

          </p>
        </div>

      </div>
      {/* Features */}

    </div>
  );
}