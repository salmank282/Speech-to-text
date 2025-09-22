// App.tsx or any component
import React, { useEffect, useState } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";

const App: React.FC = () => {
  const { transcript, isDone, isListening, startListening, stopListening } =
    useSpeechRecognition();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isListening) {
      setInputValue(transcript);
    }
  }, [transcript, isListening]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Speech Recognition</h1>
      <button onClick={startListening} disabled={isListening}>
        🎤 Start Listening
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        ⛔ Stop
      </button>
      <div>
        <input
          style={{
            padding: "10px",
            width: "70%",
            margin: "10px 0px",
            border: "none",
            borderRadius: "8px",
            outline: "1px solid #ccc",
          }}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <p>
          <strong>Transcript:</strong> {transcript}
        </p>
        <p>Status: {isListening ? "Listening..." : isDone ? "Done" : "Idle"}</p>
      </div>
    </div>
  );
};

export default App;
