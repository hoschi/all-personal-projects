import React, { useState } from "react";
import { getTextFromResponse, useTranscribeText } from "./useTranscribeText";
import { MicButton } from "./MicButton";
import { EditingBox } from "./EditingBox";
import { Shell, TopArea, DownArea, MiddleStrip } from "./Shell";
import { ErrorBoundary } from "./ErrorBoundary";
import type { RecordingInfo } from "./RecordingInfo";
import { TokenInput } from "./TokenInput";
import { ErrorModal } from "./ErrorModal";
import "./App.css";

export const App: React.FC = () => {
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
  const [token, setToken] = useState<string>(
    () => localStorage.getItem("token") || "",
  );
  const [inputToken, setInputToken] = useState<string>("");

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
      const response = await transcribeText(info.base64Data);
      const text = getTextFromResponse(response);
      setEditableText(text);
    } catch (ex) {
      setError(ex as Error);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleSaveToken = () => {
    if (inputToken.trim()) {
      localStorage.setItem("token", inputToken.trim());
      setToken(inputToken.trim());
    }
  };

  const handleClearToken = () => {
    // only reset toket and not input token makes it easy to save the same token again in case the user clicked on accident on the button. Reloading the page removes the token of the box
    setToken("");
    localStorage.removeItem("token");
  };

  const handleCutAndClear = async () => {
    try {
      await navigator.clipboard.writeText(sumText);
      handleClear();
    } catch (e) {
      alert(`Kopieren fehlgeschlagen: ${e}`);
    }
  };

  if (!token) {
    return (
      <TokenInput
        value={inputToken}
        onChange={setInputToken}
        onSave={handleSaveToken}
      />
    );
  }

  return (
    <ErrorBoundary>
      <Shell>
        <TopArea>
          <EditingBox text={editableText} onTextChange={setEditableText} />
        </TopArea>
        <MiddleStrip>
          <button className="icon-button" onClick={handleClearToken}>
            🚪
          </button>
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

export default App;
