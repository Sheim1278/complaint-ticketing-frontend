import { Dialog } from "@headlessui/react";
import { X, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useEffect } from "react";
import type { Complaint, User } from "../types";

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  user: User;
}

export default function ComplaintModal({
  isOpen,
  onClose,
  complaint,
  user,
}: ComplaintModalProps) {
  const [satisfaction, setSatisfaction] = useState<null | "yes" | "no">(null);
  const [previousSatisfaction, setPreviousSatisfaction] = useState<
    null | "yes" | "no"
  >(null);
  const [humanResponse, setHumanResponse] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackSubmit = async (
    complain_id: number,
    satisfaction: string
  ) => {
    setIsSubmitting(true);
    const payload = {
      satisfaction: satisfaction,
    };

    const response = await fetch(
      `http://127.0.0.1:5000/complaint/setsatisfaction/${complain_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(payload),
      }
    );

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
      setHumanResponse(""); // Reset human response state when modal opens
    }
  }, [isOpen]);

  if (!complaint) return null;

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
            <p>
              <strong>Category:</strong> {complaint.category}
            </p>
            <p>
              <strong>Sub-category:</strong> {complaint.sub_category}
            </p>
          </div>

          <p className="text-gray-600">{complaint.description}</p>

          {complaint.ai_response.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                AI Response:
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded p-3 max-h-60 overflow-y-auto text-gray-700 whitespace-pre-wrap">
                {complaint.ai_response}
              </div>
            </div>
          )}

          {complaint.admin_response !== "PENDING" && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Human Response:
              </h4>
              <p className="text-gray-600">{complaint.admin_response}</p>
            </div>
          )}
          {user.role !== "admin" && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-800 mb-2">
                Were you satisfied with the answer?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() =>
                    handleFeedbackSubmit(complaint.id, "satisfied")
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium shadow-sm  disabled:text-black
                                    ${
                                      satisfaction === "yes"
                                        ? "bg-green-800 text-white disabled:bg-green-200 disabled:hover:bg-green-200"
                                        : "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300 disabled:hover:bg-green-300 "
                                    }
                  ${
                    previousSatisfaction === "yes" && satisfaction === "no"
                      ? "ring-2 ring-yellow-400"
                      : ""
                  }
                  hover:bg-green-500 hover:text-white
                `}
                  disabled={isSubmitting || satisfaction !== null} // Disable button if already submitted
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes
                </button>

                <button
                  onClick={() =>
                    handleFeedbackSubmit(complaint.id, "unsatisfied")
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium shadow-sm   disabled:text-black
                  ${
                    satisfaction === "no"
                      ? "bg-red-800 text-white disabled:bg-red-200 disabled:hover:bg-red-200"
                      : "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300 disabled:hover:bg-red-300 "
                  }
                  ${
                    previousSatisfaction === "no" && satisfaction === "yes"
                      ? "ring-2 ring-yellow-400"
                      : ""
                  }
                   hover:text-white
                `}
                  disabled={isSubmitting || satisfaction !== null} // Disable button if already submitted
                >
                  <ThumbsDown className="w-4 h-4" />
                  No
                </button>
              </div>

              {satisfaction && (
                <p className="mt-4 text-sm font-medium text-green-600">
                  Thank you for your feedback! Your response has been recorded.
                </p>
              )}
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
