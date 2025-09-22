import React, { useState } from "react";
import { Play, Send, Loader2, PlayCircle } from "lucide-react";

interface ActionButtonsProps {
  onRunCode: () => Promise<void>;
  onSubmitCode: () => Promise<void>;
  isRunning: boolean;
  isSubmitting: boolean;
  hasCode: boolean;
  sidebarCollapsed?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRunCode,
  onSubmitCode,
  isRunning,
  isSubmitting,
  hasCode,
  sidebarCollapsed,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmitClick = () => {
    if (!hasCode) return;
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    await onSubmitCode();
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="bg-white p-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="text-sm text-gray-400 self-center">Submissions</div>
          <button
            onClick={onRunCode}
            disabled={isRunning || isSubmitting || !hasCode}
            className="flex items-center px-3 py-1 bg-white text-blue-500 rounded-md font-[400] border border-blue-500 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <PlayCircle className="text-blue-500 mr-2" size={18} />
            )}
            {isRunning ? "Running..." : sidebarCollapsed ? "Run Code" : "Run"}
          </button>

          <button
            onClick={handleSubmitClick}
            disabled={isRunning || isSubmitting || !hasCode}
            className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-[400] disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting && (
              <Loader2 className="animate-spin mr-2" size={18} />
            )}
            {isSubmitting
              ? "Submitting..."
              : sidebarCollapsed
              ? "Submit Code"
              : "Submit"}
          </button>
        </div>

        {/* <div className="text-sm text-gray-400">
          <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+Enter</kbd> to run
        </div> */}
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Submission</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your solution? This will just
              submit this particular question and Run all test cases for this.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelSubmit}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Yes, Submit Code
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
