import { useState, useRef } from "react";
import { Mistral } from "@mistralai/mistralai";
import type {
  ChatCompletionResponse,
  Messages,
} from "@mistralai/mistralai/models/components";

const createMessages = (base64Data: string): Messages[] => {
  return [
    {
      role: "user",
      content: [
        {
          type: "input_audio",
          inputAudio: base64Data,
        },
        {
          type: "text",
          text: "Du bist ein Assistent um Sprache in Text um zu wandeln. Transkribieren den Text. Ersetze gesprochene Zeichen wie 'Klammer', 'Doppelpunkt', 'Punkt', .. mit ihren entsprechenden Symbolen. Verbessere Grammatik und Rechtschreibung. Ändere so wenig wie möglich, nur so viel wie nötig. Falsche Grammatik muss aber in jedem Fall korrigiert werden. Gib nur das verbesserte Transkript aus, sonst nichts.",
        },
      ],
    },
  ];
};

const getExceptionText = (
  msg: string,
  response: ChatCompletionResponse,
): Error => {
  return new Error(`${msg}: ${JSON.stringify(response, undefined, 2)}`);
};

export const getTextFromResponse = (
  response: ChatCompletionResponse,
): string => {
  const message = response.choices.at(0)?.message.content;

  if (!message || message.length <= 0 || message instanceof Object) {
    throw getExceptionText("no message in response", response);
  }

  return message;
};

const createClient = (): Mistral | null => {
  const apiKey = localStorage.getItem("token");
  if (!apiKey) {
    return null;
  }
  return new Mistral({ apiKey });
};

export function useTranscribeText() {
  const [isLoading, setIsLoading] = useState(false);
  const clientRef = useRef<Mistral | null>(null);
  if (!clientRef.current) {
    clientRef.current = createClient();
  }

  const transcribeText = async (
    base64Data: string,
  ): Promise<ChatCompletionResponse> => {
    if (!clientRef.current) {
      throw new Error("can't happen");
    }
    setIsLoading(true);
    try {
      const response = await clientRef.current.chat.complete({
        model: "voxtral-mini-latest",
        messages: createMessages(base64Data),
      });
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, transcribeText };
}
