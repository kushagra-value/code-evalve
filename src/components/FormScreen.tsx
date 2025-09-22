// src/components/FormScreen.tsx
import React from "react";
// import { toast } from "react-hot-toast"; // Assuming react-toastify is used for toast notifications

// import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@radix-ui/react-alert-dialog'; // Uncomment if using AlertDialog

interface FormScreenProps {
  email: string;
  setEmail: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  uniqueId: string;
  setUniqueId: (value: string) => void;
  loading: boolean;
  onSubmit: () => void; // Uncomment if needed
}

export const FormScreen: React.FC<FormScreenProps> = ({
  email,
  setEmail,
  name,
  setName,
  uniqueId,
  setUniqueId,
  loading,
  onSubmit,
}) => {
  return (
    <div className="space-y-4">
      <div className="min-w-96">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-2">
              Assessment ID
            </label>
            <input
              value={uniqueId}
              className="font-normal mt-1 block w-full px-3 py-2 text-blue-600 border border-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              style={{ fontSize: "12px" }}
              placeholder="Unique ID from URL"
              onChange={(e) => setUniqueId(e.target.value)}
              required // If it's auto-filled and shouldn't be changed
              contentEditable={false} // Prevent user edits
              readOnly // Prevent user edits
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-2">
              Candidate Name
            </label>
            <input
              value={name}
              className="font-normal mt-1 block w-full px-3 py-2 text-blue-600 border border-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              style={{ fontSize: "12px" }}
              placeholder="Enter your first name"
              onChange={(e) => setName(e.target.value)}
              required
              contentEditable={false}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-2">
              Email
            </label>
            <input
              value={email}
              className="font-normal mt-1 block w-full px-3 py-2 text-blue-600 border border-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              style={{ fontSize: "12px" }}
              placeholder="Enter your email address"
              onChange={(e) => setEmail(e.target.value)}
              required
              contentEditable={false}
              readOnly
            />
          </div>

          <div className="w-full flex flex-col mx-auto justify-center items-center align-middle space-y-6 pt-4">
            <button
              className="w-full h-10 rounded-lg flex flex-row justify-center bg-blue-600 hover:bg-blue-700 text-white items-center"
              onClick={() => onSubmit()}
            >
              Start Assessment
            </button>

            <button
              className="w-full h-10 rounded-lg flex flex-row justify-center bg-transparent text-blue-600 border border-blue-600 items-center"
              onClick={() => onSubmit()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormScreen;
