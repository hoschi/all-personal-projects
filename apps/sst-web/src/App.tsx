import React, { useEffect, useState } from "react";
import { useTranscribeText } from "./useTranscribeText";
import { MicButton } from "./MicButton";
import { EditingBox } from "./EditingBox";
import { Shell, TopArea, DownArea, MiddleStrip } from "./Shell";
import { ErrorBoundary } from "./ErrorBoundary";
import type { RecordingInfo } from "./RecordingInfo";
import { MarketingPage } from "./TokenInput";
import { ErrorModal } from "./ErrorModal";
import "./App.css";

const normalizeUnknownError = (value: unknown): Error => {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === "string") {
    return new Error(value);
  }
  if (value === null || value === undefined) {
    return new Error("Unknown runtime error");
  }
  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error(String(value));
  }
};

const TranscriptionApp: React.FC = () => {
  const [sumText, _setSumText] = useState<string>(
    () => localStorage.getItem("sumText") || "",
  );
  const [editableText, _setEditableText] = useState<string>(
    () => localStorage.getItem("editableText") || "",
  );

  // Setter, die State und localStorage synchronisieren
  const setSumText = (value: string) => {
    _setSumText(value);
    localStorage.setItem("sumText", value);
  };
  const setEditableText = (value: string) => {
    _setEditableText(value);
    localStorage.setItem("editableText", value);
  };
  const [size, setSize] = useState<string>("");
  const { isLoading, transcribeText } = useTranscribeText();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      setError(normalizeUnknownError(event.error ?? event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(normalizeUnknownError(event.reason));
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  const handlePut = () => {
    setSumText(sumText === "" ? editableText : `${sumText} ${editableText}`);
    setEditableText("");
  };

  const handleClear = () => {
    setSumText("");
    setEditableText("");
    localStorage.removeItem("sumText");
    localStorage.removeItem("editableText");
  };
  const handleRecordingStop = async (info: RecordingInfo) => {
    setSize(info.size);
    try {
      const response = await transcribeText(info.audioBlob);
      setEditableText(response.text);
    } catch (ex) {
      setError(normalizeUnknownError(ex));
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCutAndClear = async () => {
    try {
      await navigator.clipboard.writeText(sumText);
      handleClear();
    } catch (e) {
      alert(`Kopieren fehlgeschlagen: ${e}`);
    }
  };

  return (
    <ErrorBoundary onError={(caughtError) => setError(caughtError)}>
      <Shell>
        <TopArea>
          <EditingBox text={editableText} onTextChange={setEditableText} />
        </TopArea>
        <MiddleStrip>
          <a href="/">Home</a>
          <div>▲ Transcription ▲</div>
          <div className="buttons-text">
            <div className="buttons">
              <MicButton onRecordingStop={handleRecordingStop} />
              <button onClick={handlePut}>put ▼</button>
              <button onClick={handleClear}>clear</button>
            </div>
            <div className="state">
              <div>{size ? `uploaded: ${size}` : ""}</div>
              <div className="loading">{isLoading ? "loading" : ""}</div>
            </div>
          </div>
          <div>▼ Summary ▼</div>
          <button className="icon-button" onClick={handleCutAndClear}>
            ✂️
          </button>
        </MiddleStrip>
        <DownArea>
          <EditingBox text={sumText} onTextChange={setSumText} />
        </DownArea>
      </Shell>
      <ErrorModal error={error} onClose={handleCloseError} />
    </ErrorBoundary>
  );
};

export const App: React.FC = () => {
  const pathname = window.location.pathname;
  if (pathname === "/app" || pathname === "/app/") {
    return <TranscriptionApp />;
  }

  return <MarketingPage />;
};

export default App;
