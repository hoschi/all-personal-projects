import { useState } from "react";
import { useAudioRecorder } from "./useAudioRecorder";
import type { RecordingInfo } from "./RecordingInfo";

type OurState = "idle" | "recording";
interface MicButtonProps {
  onRecordingStop: (info: RecordingInfo) => void | Promise<void>;
}

export const MicButton: React.FC<MicButtonProps> = ({ onRecordingStop }) => {
  const { startRecording, stopRecording } = useAudioRecorder();
  const [state, setState] = useState<OurState>("idle");
  const text = { idle: "start", recording: "recording" }[state];
  const handleClick = async () => {
    if (state === "idle") {
      await startRecording();
      setState("recording");
      return;
    }

    if (state === "recording") {
      setState("idle");
      const info = await stopRecording();
      await onRecordingStop(info);
    }
  };
  return <button onClick={handleClick}>{text}</button>;
};
