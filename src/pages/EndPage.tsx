// // src/pages/EndPage.tsx
// import React from "react";

// export const EndPage: React.FC = () => {
//   return (
//     <div className="w-full bg-white min-h-screen flex items-center justify-center">
//       <div className="text-center space-y-2">
//         <h3 className="text-lg font-semibold">Assessment Completed</h3>
//         <p className="text-md text-gray-500">
//           You have already responded to this assessment.
//         </p>
//       </div>
//     </div>
//   );
// };

// src/pages/EndPage.tsx
import React, { useState } from "react";
import { apiService } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { Assessment } from "../types";

interface EndPageProps {
  assessment: Assessment;
  setAssessment: React.Dispatch<React.SetStateAction<Assessment | null>>;
}

export const EndPage: React.FC<EndPageProps> = ({
  assessment,
  setAssessment,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetAssessment = async () => {
    try {
      await apiService.updateAssessmentStatus(assessment?.id, "not_started");
      setAssessment({
        ...assessment,
        status: "not_started",
        candidate: {
          ...assessment.candidate,
        },
      });
      toast.success("Assessment reset successfully!");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 3000);
    } catch (error) {
      console.error("Error resetting assessment:", error);
      toast.error("❌ Failed to reset assessment");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="w-full bg-white min-h-screen flex items-center justify-center">
      <Toaster position="bottom-right" />
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Assessment Completed</h3>
        <p className="text-md text-gray-500">
          You have already responded to this assessment.
        </p>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
        >
          Reset Assessment
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Reset</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset this assessment? This will change
              the status back to not started and{" "}
              <strong>this action cannot be undone</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAssessment}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
