// src/pages/FlashScreen.tsx
import React, { useRef, useEffect, useState } from "react";
import CandidateScreenHeader from "../components/Header";
import { Assessment } from "../types";
import { ChevronDown } from "lucide-react";

interface Props {
  assessment: Assessment;
  setAssessment: React.Dispatch<React.SetStateAction<Assessment | null>>;
  mediaStream?: MediaStream;
  onStartNow: () => void;
  setMediaStream: (stream: MediaStream | null) => void;
}

export const FlashScreen: React.FC<Props> = ({
  assessment,
  setAssessment,
  mediaStream,
  onStartNow,
  setMediaStream,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        tempStream.getTracks().forEach((track) => track.stop());

        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter((d) => d.kind === "audioinput");
        const cameras = devices.filter((d) => d.kind === "videoinput");
        const speakers = devices.filter((d) => d.kind === "audiooutput");

        setMicDevices(mics);
        setCameraDevices(cameras);
        setSpeakerDevices(speakers);

        if (mics.length > 0) setSelectedMic(mics[0].deviceId);
        if (cameras.length > 0) setSelectedCamera(cameras[0].deviceId);
        if (speakers.length > 0) setSelectedSpeaker(speakers[0].deviceId);
      } catch (err) {
        console.error("Error initializing media devices:", err);
        alert("Failed to access media devices. Please grant permissions.");
      }
    };

    init();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const updateStream = async () => {
      if (!selectedMic || !selectedCamera) return;

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      try {
        const constraints = {
          audio: { deviceId: { exact: selectedMic } },
          video: { deviceId: { exact: selectedCamera } },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error updating stream:", err);
      }
    };

    updateStream();
  }, [selectedMic, selectedCamera]);

  useEffect(() => {
    if (videoRef.current && selectedSpeaker) {
      videoRef.current.setSinkId(selectedSpeaker).catch((err) => {
        console.error("Error setting sink ID:", err);
      });
    }
  }, [selectedSpeaker]);

  const handleStartNow = () => {
    if (localStream) {
      setMediaStream(localStream);
    }
    onStartNow();
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <CandidateScreenHeader
        assessment={assessment}
        setAssessment={setAssessment}
        page="start"
      />

      <div className="flex justify-between px-10 py-12 gap-16">
        <div className="w-[60%]">
          <div className="relative bg-black rounded-3xl overflow-hidden h-[450px]">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <p className="absolute top-4 left-4 text-white font-medium">
              {assessment.candidate?.full_name || "Candidate Name"}
            </p>
          </div>
          <div className="flex justify-center mt-10 space-x-2">
            <div className="relative w-64">
              <select
                value={selectedMic}
                onChange={(e) => setSelectedMic(e.target.value)}
                className="px-4 py-[6px] bg-white text-gray-600 border border-gray-300 rounded-3xl w-full appearance-none"
              >
                {micDevices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || "Microphone"}
                  </option>
                ))}
              </select>

              {/* Chevron icon */}
              <ChevronDown
                size={18}
                className="absolute pr-1 right-0 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
            <div className="relative w-64">
              <select
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                className="px-4 py-[6px] bg-white text-gray-600 border border-gray-300 rounded-3xl w-[99%] appearance-none"
              >
                {speakerDevices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || "Headphones"}
                  </option>
                ))}
              </select>
              {/* Chevron icon */}
              <ChevronDown
                size={18}
                className="absolute pr-1 right-0 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
            <div className="relative w-64">
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="px-4 py-[6px] bg-white text-gray-600 border border-gray-300 rounded-3xl w-[99%] appearance-none"
              >
                {cameraDevices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || "Integrated Camera"}
                  </option>
                ))}
              </select>
              {/* Chevron icon */}
              <ChevronDown
                size={18}
                className="absolute pr-1 right-0 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
          <p className="text-center text-md mt-10 text-gray-600">
            Are you ready to join?
          </p>
          <button
            onClick={handleStartNow}
            className="block mx-auto mt-3 px-24 py-2 bg-blue-600 text-white text-md rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Now
          </button>
        </div>
        <div className="w-[40%] py-8 px-8 rounded-3xl text-md bg-gray-50">
          <h3 className="text-blue-600 font-semibold mb-4">
            Coding Round Instructions
          </h3>
          <p className="text-gray-600 mb-6">
            Welcome to the AI-powered coding round with 5 problems (easy,
            medium, hard). Points vary by difficulty (easy: 20, medium: 40,
            hard: 60). Attempt in any order, skip if needed, no time limit. Your
            session is proctored.
          </p>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">Stay on this page</p>
              <p className="text-gray-600 text-sm">
                No tab-switching or external tools; it’s monitored.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">Read carefully</p>
              <p className="text-gray-600 text-sm">
                Understand problem requirements, constraints, and test cases.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">Plan first</p>
              <p className="text-gray-600 text-sm">
                Outline logic, consider edge cases and complexity.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">Write clean code</p>
              <p className="text-gray-600 text-sm">
                Use clear names, brief comments, modular design.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">Metrics tracked</p>
              <p className="text-gray-600 text-sm">
                Code quality, run/submit frequency, problem-solving efficiency.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">Submit wisely</p>
              <p className="text-gray-600 text-sm">
                Partial credit possible; revisit skipped problems.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">No malpractices</p>
              <p className="text-gray-600 text-sm">
                Avoid AI tools or copying—plagiarism is detected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
