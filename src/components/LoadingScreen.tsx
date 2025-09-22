import React from "react";
import { Loader2, Code } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading assessment...",
}) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <Code className="text-blue-500 mx-auto mb-4" size={64} />
          <Loader2 className="text-blue-500 animate-spin mx-auto" size={32} />
        </div>
        <p className="text-gray-500">
          Please Wait <br /> {message}
        </p>
      </div>
    </div>
  );
};
