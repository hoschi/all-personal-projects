import { useState } from "react";

const WHISPER_ENDPOINT = "http://localhost:9100/inference";

type WhisperResponse = {
  text?: string;
  error?: string;
};

export type TranscribeResponse = {
  text: string;
};

export function useTranscribeText() {
  const [isLoading, setIsLoading] = useState(false);

  const transcribeText = async (
    audioBlob: Blob,
    language = "de",
  ): Promise<TranscribeResponse> => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");
      formData.append("response_format", "json");
      formData.append("language", language);
      formData.append("temperature", "0.0");

      const response = await fetch(WHISPER_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `whisper-server request failed (${response.status}): ${errorBody}`,
        );
      }

      const data = (await response.json()) as WhisperResponse;
      if (!data.text || data.text.trim().length === 0) {
        throw new Error(data.error ?? "no text in whisper-server response");
      }

      return {
        text: data.text.replace(/\s+/g, " ").trim(),
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, transcribeText };
}
