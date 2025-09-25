// src/pages/StartPage.tsx
import React, { useState, useRef, useEffect } from "react";
import CandidateScreenHeader from "../components/Header";
import { FormScreen } from "../components/FormScreen"; // Assuming this component exists as per the provided code snippet
import { apiService } from "../services/api";
import { Assessment } from "../types";

interface Props {
  assessment: Assessment;
  setAssessment: React.Dispatch<React.SetStateAction<Assessment | null>>;
  mediaStream?: MediaStream;
}

export const StartPage: React.FC<Props> = ({
  assessment,
  setAssessment,
  mediaStream,
}) => {
  const [email, setEmail] = useState(assessment.candidate?.email || "");
  const [name, setName] = useState(assessment.candidate?.full_name || "");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isValidEmail = email.includes("@") && email.split("@")[1].includes(".");

  const startAssessment = async () => {
    if (!name || !isValidEmail) {
      alert("Please fill all mandatory fields correctly.");
      return;
    }

    setLoading(true);

    try {
      // Assuming candidate update is not implemented in apiService; skip or add if needed
      // await apiService.updateCandidate(assessment.candidate.id, { full_name: name, email: email });

      await apiService.updateAssessmentStatus(assessment.id, "in_progress");
      setAssessment({
        ...assessment,
        status: "in_progress",
        candidate: {
          ...assessment.candidate,
          full_name: name,
          email: email,
        },
      });
    } catch (err) {
      alert("Failed to start the assessment.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="flex justify-between">
        <div className="pl-[236px] pt-12 pr-12 leading-normal">
          <div className="space-y-1 mb-6">
            <h3 className="text-lg font-semibold">Fill The Details!</h3>
            <p className="text-md text-gray-500 ">
              All the fields are mandatory
            </p>
          </div>
          <FormScreen
            email={email}
            setEmail={setEmail}
            name={name}
            setName={setName}
            uniqueId={assessment.unique_link_id}
            setUniqueId={() => {}}
            loading={loading}
            onSubmit={() => startAssessment()}
          />
        </div>
        <div>
          <img
            src="/interview-nxthyre.png"
            alt="background"
            className="h-[90vh]"
          />
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
