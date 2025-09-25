// src/pages/AssessmentWrapper.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../services/api";
import { Assessment } from "../types";
import { LoadingScreen } from "../components/LoadingScreen";
import { StartPage } from "./StartPage";
import { AssessmentPage } from "./AssessmentPage";
import { EndPage } from "./EndPage";

export const AssessmentWrapper: React.FC = () => {
  const { candidateUuid } = useParams<{ candidateUuid: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!candidateUuid) {
        setError("Invalid assessment link");
        setLoading(false);
        return;
      }

      try {
        const data = await apiService.getAssessment(candidateUuid);
        setAssessment(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load assessment"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [candidateUuid]);

  useEffect(() => {
    const initMedia = async () => {
      if (assessment && assessment.status !== "completed" && !mediaStream) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setMediaStream(stream);
        } catch (err) {
          alert(
            "Failed to access camera and microphone. The preview won't be shown."
          );
          console.error("Failed to get media:", err);
        }
      }
    };

    initMedia();
  }, [assessment, mediaStream]);

  useEffect(() => {
    if (assessment?.status === "completed" && mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  }, [assessment?.status, mediaStream]);

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg border border-red-500 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Assessment Error
          </h2>
          <p className="text-red-400 mb-6">{error || "Assessment not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (assessment.status === "completed") {
    return <EndPage assessment={assessment} setAssessment={setAssessment} />;
  } else if (assessment.status === "not_started") {
    return (
      <StartPage
        assessment={assessment}
        setAssessment={setAssessment}
        mediaStream={mediaStream ?? undefined}
      />
    );
  } else {
    return (
      <AssessmentPage
        assessment={assessment}
        mediaStream={mediaStream ?? undefined}
      />
    );
  }
};
