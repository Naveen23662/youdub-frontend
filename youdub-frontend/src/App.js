import React, { useState } from "react";

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [language, setLanguage] = useState("Telugu");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDub = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://youdub-backend.onrender.com/dub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: youtubeUrl, language }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dubbed audio");
      }

      const result = await response.json();
      const audio = new Audio(`https://youdub-backend.onrender.com/${result.file}`);
      setAudioUrl(`https://youdub-backend.onrender.com/${result.file}`);
      audio.play();
    } catch (error) {
      console.error("Error:", error);
      alert("Dubbing failed. Try again.");
    }
    setLoading(false);
  };

  const languages = [
    "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam",
    "Marathi", "Gujarati", "Bengali", "Punjabi", "Odia",
    "English", "Spanish", "French", "German", "Italian",
    "Portuguese", "Russian", "Japanese", "Korean", "Arabic"
  ];

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>YouDub 🎙️</h1>
      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="Enter YouTube video URL"
        style={{ padding: "10px", width: "300px" }}
      />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ marginLeft: "10px", padding: "10px" }}
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
      <button
        onClick={handleDub}
        disabled={loading}
        style={{ marginLeft: "10px", padding: "10px 20px" }}
      >
        {loading ? "Processing..." : "Dub"}
      </button>

      {audioUrl && (
        <div style={{ marginTop: "20px" }}>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}

export default App;

