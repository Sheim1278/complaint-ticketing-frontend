import { useState } from 'react';
import html2canvas from 'html2canvas';

export default function ComplaintForm() {
  // Student Information
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gpa, setGpa] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [college, setCollege] = useState('');
  
  // Complaint Information
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [suggestSolution, setSuggestSolution] = useState('');
  const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null);
  const [dissatisfactionCategory, setDissatisfactionCategory] = useState('');
  const [dissatisfactionFeedback, setDissatisfactionFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // State to store the ticket response after submission
  const [complaintTicket, setComplaintTicket] = useState<any>(null);

  // Function to generate and download ticket image
  const downloadTicketImage = async () => {
    const ticketElement = document.getElementById('ticket-details');
    if (ticketElement) {
      try {
        const canvas = await html2canvas(ticketElement);
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `ticket-${complaintTicket.ticketId}.png`;
        link.click();
      } catch (error) {
        console.error('Error generating ticket image:', error);
      }
    }
  };

  // Function to simulate sending email
  const sendConfirmationEmail = async (ticketDetails: any) => {
    console.log('Sending confirmation email to:', email, 'with ticket details:', ticketDetails);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ticketId = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const complaintData = {
      studentInfo: {
        studentId,
        name,
        email,
        gpa,
        academicYear,
        age,
        gender,
        nationality,
        college
      },
      complaint: {
        category,
        description,
        suggestSolution
      }
    };

    const ticketResponse = {
      ticketId,
      createdAt: new Date().toISOString(),
      estimatedResolutionTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      currentSolution: "Our team is reviewing your complaint. We will provide a detailed solution soon.",
      ...complaintData,
    };

    setComplaintTicket(ticketResponse);
    await sendConfirmationEmail(ticketResponse);
  };

  const handleFeedbackSubmit = () => {
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', {
      category: dissatisfactionCategory,
      feedback: dissatisfactionFeedback
    });
    setFeedbackSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
      {/* Student Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Student Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-700">
              College
            </label>
            <select
              id="college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select college</option>
              <option value="engineering">Engineering</option>
              <option value="science">Science</option>
              <option value="business">Business</option>
              <option value="arts">Arts</option>
              <option value="medicine">Medicine</option>
            </select>
          </div>

          <div>
            <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
              GPA
            </label>
            <input
              type="number"
              id="gpa"
              step="0.01"
              min="0"
              max="4"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
              Academic Year
            </label>
            <select
              id="academicYear"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
              <option value="5">Fifth Year</option>
            </select>
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              min="16"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <input
              type="text"
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Complaint Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Complaint Information</h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="academic">Academic</option>
              <option value="technical">Technical</option>
              <option value="facilities">Facilities</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="suggestSolution" className="block text-sm font-medium text-gray-700">
              Suggest Solution
            </label>
            <textarea
              id="suggestSolution"
              value={suggestSolution}
              onChange={(e) => setSuggestSolution(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit Complaint
      </button>

      {/* Ticket Details Section */}
      {complaintTicket && (
        <div className="space-y-8">
          <div id="ticket-details" className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Ticket ID:</p>
                  <p className="text-gray-700">{complaintTicket.ticketId}</p>
                </div>
                <div>
                  <p className="font-semibold">Submission Date:</p>
                  <p className="text-gray-700">{new Date(complaintTicket.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Category:</p>
                  <p className="text-gray-700">{complaintTicket.complaint.category}</p>
                </div>
                <div>
                  <p className="font-semibold">Student Name:</p>
                  <p className="text-gray-700">{complaintTicket.studentInfo.name}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">Current Status:</p>
                  <p className="text-gray-700">{complaintTicket.currentSolution}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">Description:</p>
                  <p className="text-gray-700">{complaintTicket.complaint.description}</p>
                </div>
              </div>
              <button
                onClick={downloadTicketImage}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Download Ticket Image
              </button>
            </div>
          </div>

          {/* Solution and Satisfaction Section */}
          <div className="p-6 border rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50">
            <div className="space-y-4">
              <div className="bg-yellow-100 p-4 rounded-lg">
                <p className="text-yellow-800 font-medium">Important Note:</p>
                <p className="text-yellow-700">The solution is should you be careful.</p>
              </div>

              <div className="mt-6">
                <p className="text-lg font-medium text-gray-900 mb-4">Is the answer satisfying your needs?</p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsSatisfied(true)}
                    className={`px-4 py-2 rounded-md ${
                      isSatisfied === true
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSatisfied(false)}
                    className={`px-4 py-2 rounded-md ${
                      isSatisfied === false
                        ? 'bg-red-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    No
                  </button>
                </div>
                {isSatisfied === false && !feedbackSubmitted && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="dissatisfactionCategory" className="block text-sm font-medium text-gray-700 mb-2">
                        Please select the reason for your dissatisfaction:
                      </label>
                      <select
                        id="dissatisfactionCategory"
                        value={dissatisfactionCategory}
                        onChange={(e) => setDissatisfactionCategory(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="unclear">Unclear Solution</option>
                        <option value="incomplete">Incomplete Resolution</option>
                        <option value="ineffective">Ineffective Solution</option>
                        <option value="delayed">Delayed Response</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <textarea
                        value={dissatisfactionFeedback}
                        onChange={(e) => setDissatisfactionFeedback(e.target.value)}
                        placeholder="Please tell us why you're not satisfied..."
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                    {dissatisfactionCategory && dissatisfactionFeedback && (
                      <button
                        type="button"
                        onClick={handleFeedbackSubmit}
                        className="w-full mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        Submit Feedback
                      </button>
                    )}
                  </div>
                )}
                {feedbackSubmitted && (
                  <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                    Thank you for your feedback. We will use it to improve our services.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}