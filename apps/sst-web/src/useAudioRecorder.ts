import { useRef } from "react";
import RecordRTC from "recordrtc";
import type { RecordingInfo } from "./RecordingInfo";

function bytesToSize(bytes: number) {
  const k = 1e3;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) {
    return "0 Bytes";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
}

export const useAudioRecorder = () => {
  const mediaRecorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Startet die Audioaufnahme.
   */
  const startRecording = async () => {
    try {
      // Verhindert das Starten einer neuen Aufnahme, wenn bereits eine läuft
      if (mediaRecorderRef.current) {
        console.warn("Recording is already in progress.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder, // Notwendig für WAV/PCM
      });

      recorder.startRecording();
      mediaRecorderRef.current = recorder;
      console.log("Recording started. State:", recorder.state);
    } catch (error) {
      console.error("Failed to start recording:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(String(error));
    }
  };

  /**
   * Stoppt die Audioaufnahme und gibt einen WAV-Blob als Promise zurück.
   */
  const stopRecording = (): Promise<RecordingInfo> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;

      if (!recorder || recorder.state === "stopped") {
        return reject("Recording not started or already stopped.");
      }

      recorder.stopRecording(() => {
        console.log("Recording stopped. State:", recorder.state);
        const audioBlob = recorder.getBlob();

        // Stream und Recorder aufräumen
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        mediaRecorderRef.current = null;

        if (!audioBlob || audioBlob.size === 0) {
          return reject("audio blob is zero");
        }

        resolve({ audioBlob, size: bytesToSize(audioBlob.size) });
      });
    });
  };

  return { startRecording, stopRecording };
};
