import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Complaint, User } from '../types';

interface ComplaintModalProps {
    isOpen: boolean;
    onClose: () => void;
    complaint: Complaint | null;
    user: User;
}

export default function ComplaintModalAdmin({ isOpen, onClose, complaint, user }: ComplaintModalProps) {
    const [satisfaction, setSatisfaction] = useState<null | 'yes' | 'no'>(null);
    const [previousSatisfaction, setPreviousSatisfaction] = useState<null | 'yes' | 'no'>(null);
    const [humanResponse, setHumanResponse] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiRating, setAiRating] = useState<string>('');
    const BASE_URI = import.meta.env.VITE_BASE_URI;

    const handleFeedbackSubmit = async (complain_id: number, satisfaction: string) => {
        setIsSubmitting(true);
        const payload = {
            satisfaction: satisfaction,
        };

        const response = await fetch(`${BASE_URI}/complaint/setsatisfaction/${complain_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`,
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            setPreviousSatisfaction(satisfaction); // Keep track of previous satisfaction response
            setSatisfaction(satisfaction); // Update the satisfaction state
        }
        setIsSubmitting(false); // Reset the submitting state
    };

    // Reset satisfaction and human response states when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setSatisfaction(null); // Reset satisfaction state when modal opens
            setHumanResponse(''); // Reset human response state when modal opens
        }
    }, [isOpen]);

    if (!complaint) return null;

    async function submitResponse() {
        if (!humanResponse || !aiRating || !complaint) {
            alert("Please fill both the response and the AI rating.");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            department_response: humanResponse,
            admin_eval_on_ai_response: aiRating,
        };

        try {
            const response = await fetch(`http://127.0.0.1:5000/complaint/respondtocomplaint/${complaint.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.access_token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onClose(); // Close modal
            } else {
                alert("Failed to submit response.");
            }
        } catch (error) {
            console.error("Error submitting response:", error);
            alert("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <Dialog.Title className="text-xl font-bold text-gray-800">
                        {complaint.title}
                    </Dialog.Title>

                    {/* Category and Sub-category */}
                    <div className="text-sm text-gray-600">
                        <p><strong>Category:</strong> {complaint.category}</p>
                        <p><strong>Sub-category:</strong> {complaint.sub_category}</p>
                    </div>

                    <p className="text-gray-600">{complaint.description}</p>

                    {complaint.ai_response.length > 0 && (
                        <>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">AI Response:</h4>
                                <div className="bg-gray-50 border border-gray-200 rounded p-3 max-h-60 overflow-y-auto text-gray-700 whitespace-pre-wrap">
                                    {complaint.ai_response}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-3">
                                <label htmlFor="rating" className="text-sm text-gray-700 font-medium">Rate AI Response:</label>
                                <select
                                    id="rating"
                                    name="rating"
                                    value={aiRating}
                                    onChange={(e) => setAiRating(e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                >
                                    <option value="">Select</option>
                                    <option value="good">Good</option>
                                    <option value="poor">Poor</option>
                                </select>
                            </div>
                        </>
                    )}


                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Our Response:</h4>
                        {complaint.admin_response !=="PENDING" && (<p>
                            {complaint.admin_response}
                        </p>)}
                        <textarea
                            className="w-full h-32 p-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Write or edit your response here..."
                            value={humanResponse}
                            onChange={(e) => setHumanResponse(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                className="mt-3 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-2xl shadow-md hover:bg-blue-700 transition duration-200"
                                onClick={submitResponse}
                            >
                                Submit Response
                            </button>
                        </div>
                    </div>

                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
