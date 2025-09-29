// src/pages/AssessmentWrapper.tsx
import React, { useState, useEffect, useRef } from "react";
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
  const [switchCount, setSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!loading && !error && assessment && assessment.status !== "completed") {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    }
  }, [loading, error, assessment]);

  useEffect(() => {
    if (!assessment || assessment.status === "completed") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleViolation();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        if (
          ["t", "n", "w", "r", "u"].includes(key) ||
          (e.shiftKey && ["t", "i", "j", "c"].includes(key))
        ) {
          e.preventDefault();
          e.stopPropagation();
          handleViolation();
        } else if (e.key === "Tab") {
          e.preventDefault();
          e.stopPropagation();
          handleViolation();
        }
      } else if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        handleViolation();
      }
    };

    const handleViolation = () => {
      setSwitchCount((prev) => {
        const newCount = prev + 1;
        if (newCount > 5) {
          endAssessment();
        } else {
          setShowWarning(true);
        }
        return newCount;
      });
    };

    const endAssessment = async () => {
      try {
        await apiService.updateAssessmentStatus(assessment.id, "completed");
        setAssessment({ ...assessment, status: "completed" });
      } catch (err) {
        console.error("Failed to end assessment:", err);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown, {
      capture: true,
      passive: false,
    });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [assessment]);

  useEffect(() => {
    if (showWarning && dialogRef.current) {
      const button = dialogRef.current.querySelector("button");
      if (button) {
        button.focus();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          e.preventDefault();
          if (button) button.focus();
        } else if (e.key === "Escape") {
          handleOkClick();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [showWarning]);

  const handleOkClick = () => {
    setShowWarning(false);
    document.documentElement.requestFullscreen().catch((err) => {
      console.error("Failed to re-enter fullscreen:", err);
    });
  };

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

  let content;
  if (assessment.status === "completed") {
    content = <EndPage assessment={assessment} setAssessment={setAssessment} />;
  } else if (assessment.status === "not_started") {
    content = (
      <StartPage
        assessment={assessment}
        setAssessment={setAssessment}
        mediaStream={mediaStream ?? undefined}
      />
    );
  } else {
    content = (
      <AssessmentPage
        assessment={assessment}
        mediaStream={mediaStream ?? undefined}
      />
    );
  }

  return (
    <>
      {content}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={dialogRef}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            <h2 className="text-xl font-bold mb-4">Warning</h2>
            <p>Tab switch not allowed {switchCount}/5</p>
            <button
              onClick={handleOkClick}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};
