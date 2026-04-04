import { useState } from "react";
import { useAudioRecorder } from "./useAudioRecorder";
import type { RecordingInfo } from "./RecordingInfo";

type OurState = "idle" | "recording";
interface MicButtonProps {
  onRecordingStop: (info: RecordingInfo) => void;
}

export const MicButton: React.FC<MicButtonProps> = ({ onRecordingStop }) => {
  const { startRecording, stopRecording } = useAudioRecorder();
  const [state, setState] = useState<OurState>("idle");
  const text = { idle: "start", recording: "recording" }[state];
  const handleClick = async () => {
    if (state === "idle") {
      // start
      setState("recording");
      startRecording();
    } else if (state === "recording") {
      // stop
      setState("idle");
      const info = await stopRecording();
      onRecordingStop(info);
    }
  };
  return <button onClick={handleClick}>{text}</button>;
};
