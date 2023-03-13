import React, { useState, useRef } from "react";

export default function AudioRoute() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        const audioBlob = new Blob([event.data], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleRecordClick = () => {
    setIsRecording(true);
    startRecording();
  };

  const handleStopClick = () => {
    stopRecording();
  };

  return (
    <div>
      <button onClick={handleRecordClick} disabled={isRecording} className="btn">
        Record
      </button>
      <button onClick={handleStopClick} disabled={!isRecording} className="btn">
        Stop
      </button>
      <audio src={audioURL} controls />
    </div>
  );
}
