import { useState } from 'react';
import html2canvas from 'html2canvas';
import { user } from "src/types";
import { useNavigate } from 'react-router-dom';
import { BackwardIcon } from '@heroicons/react/16/solid';
interface ComplaintFormProps {
  user: User;
  OnFormSubmit:() => void;
}
export default function ComplaintForm({ user,OnFormSubmit }: ComplaintFormProps) {
  // Client Information

  // Complaint Information
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null);
  const [dissatisfactionCategory, setDissatisfactionCategory] = useState('');
  const [dissatisfactionFeedback, setDissatisfactionFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
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
    setIsSubmitting(true);

    // Construct the data payload
    const complaintPayload = {
      title: category, // Assuming 'category' is the complaint title
      description: description,
      number_of_complaints: 1
    };

    try {

      const response = await fetch("http://127.0.0.1:5000/complaint/addcomplaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.access_token}`
        },
        body: JSON.stringify(complaintPayload)
      });

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      const data = await response.json();
      console.log(data);
      const ticketResponse = {
        ticketId: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        estimatedResolutionTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "PENDING",
        clientInfo: {
          clientId: user.id,
          name: user.username,

        },
        complaint: {
          category: data.category,
          sub_category: data.sub_category,
          description: data.description,
          suggestSolution: data.response,
          title: data.title
        },
        id: data.id
      };

      setComplaintTicket(ticketResponse);
      OnFormSubmit(); // Call the OnFormSubmit function passed as a prop
    } catch (error) {
      console.error("Error submitting complaint:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (complain_id: number, satisfaction: string) => {
    // Here you would typically send the feedback to your backend
    const payload = {
      satisfaction: satisfaction
    }

    const response = await fetch(`http://127.0.0.1:5000/complaint/setsatisfaction/${complain_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.access_token}`
      },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      setFeedbackSubmitted(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/complains')}
        className="mb-4 flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <BackwardIcon className="h-5 w-5 me-2" aria-hidden="true" />
        back
      </button>
      <form onSubmit={handleSubmit} className="space-y-8 bg-gray-200 p-6 rounded-2xl shadow-xl text-gray-800 border-2 border-cyan-500">
        {/* Client Information Section */}

        {/* Complaint Information Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium border-b border-blue-600 pb-2">Complaint Information</h3>
          {!complaintTicket && <div className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 focus:outline-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 p-2 block w-full rounded-md border-blue-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-blue-500 bg-white"
                required
              />
            </div>
          </div>}
        </div>

        {!complaintTicket && <button
          type="submit"
          disabled={isSubmitting}
          className={`ms-auto flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm text-white font-medium ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>}


        {/* Ticket Details Section */}
        {complaintTicket && (
          <div className="space-y-8">
            <div id="ticket-details" className="p-6 border rounded-lg bg-gray-100">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold ">Ticket Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Ticket ID:</p>
                    <p className="">{complaintTicket.ticketId}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Submission Date:</p>
                    <p className="">{new Date(complaintTicket.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Category:</p>
                    <p className="">{complaintTicket.complaint.category}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Sub Category:</p>
                    <p className="">{complaintTicket.complaint.sub_category}</p>
                  </div>
                  <div >
                    <p className="font-semibold">Current Status:</p>
                    <p className="">{complaintTicket.status}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Client Name:</p>
                    <p className="">{complaintTicket.clientInfo.name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold">Title:</p>
                    <p className="">{complaintTicket.complaint.title}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold">Description:</p>
                    <p className="">{complaintTicket.complaint.description}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold">Suggested Solution:</p>
                    <div className="col-span-2">
                      <p
                        className=" whitespace-pre-wrap"
                      >
                        {complaintTicket.complaint.suggestSolution}
                      </p>
                    </div>
                  </div>

                </div>
                <div className="flex justify-end">
                  <button
                    onClick={downloadTicketImage}
                    className="mt-4 px-4 py-2 text-white bg-green-600  rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Download Ticket Image
                  </button>
                </div>

              </div>
            </div>

            {/* Solution and Satisfaction Section */}
            <div className="p-6 border rounded-lg bg-gray-100">
              <div className="space-y-4">
                {!feedbackSubmitted && <div className="bg-yellow-100 p-4 rounded-lg">
                  <p className="text-yellow-800 font-medium">Important Note:</p>
                  <p className="text-yellow-700">The solution may not be accurate.</p>
                </div>}

                <div className="mt-6">
                  {!feedbackSubmitted && <>
                    <p className="text-lg text-center font-medium mb-4">Is the answer satisfying your needs?</p>
                    <div className="flex space-x-4 justify-center">
                      <button
                        type="button"
                        onClick={() => handleFeedbackSubmit(complaintTicket.id, "unsatisfied")}
                        className={`px-4 py-2 rounded-md ${isSatisfied === true
                          ? 'bg-green-700 text-white'
                          : 'bg-green-700   text-white hover:bg-green-800'
                          }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSatisfied(false)}
                        className={`px-4 py-2 rounded-md ${isSatisfied === false
                          ? 'bg-red-700 text-white'
                          : 'bg-red-700 text-white hover:bg-red-800'
                          }`}
                      >
                        No
                      </button>
                    </div>
                  </>}
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
                          onClick={() => handleFeedbackSubmit(complaintTicket.id, "unsatisfied")}
                          className="mx-auto block mt-4 py-2 px-6 bg-red-800 text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          Submit Feedback
                        </button>
                      )}
                    </div>
                  )}
                  {feedbackSubmitted && (
                    <div className="mt-4 p-4 bg-green-300  rounded-md">
                      Thank you for your feedback. We will use it to improve our services.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

    </>
  );
}