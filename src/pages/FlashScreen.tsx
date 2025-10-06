// src/pages/FlashScreen.tsx
import React, { useRef, useEffect } from "react";
import CandidateScreenHeader from "../components/Header";
import { Assessment } from "../types";

interface Props {
  assessment: Assessment;
  setAssessment: React.Dispatch<React.SetStateAction<Assessment | null>>;
  mediaStream?: MediaStream;
  onStartNow: () => void;
}

export const FlashScreen: React.FC<Props> = ({
  assessment,
  setAssessment,
  mediaStream,
  onStartNow,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      const video = videoRef.current;
      video.srcObject = mediaStream;
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [mediaStream]);

  return (
    <div className="w-full bg-white min-h-screen">
      <CandidateScreenHeader
        assessment={assessment}
        setAssessment={setAssessment}
        page="start"
      />

      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Ready to Begin?</h1>
          <p className="text-lg text-gray-600">
            Review any final instructions or prepare yourself. Click 'Start Now'
            to proceed to the assessment.
          </p>
          <button
            onClick={onStartNow}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Start Now
          </button>
        </div>
      </div>

      {mediaStream && (
        <div className="fixed top-2 right-2 w-40 h-24 bg-black rounded-lg overflow-hidden z-50">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};
