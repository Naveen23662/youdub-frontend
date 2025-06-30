import { useState } from 'react';

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/dub`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtubeUrl }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data));
    } catch (err) {
      console.error("Error:", err);
      setResponse("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>YouDub</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          style={{ width: "300px", marginRight: "1rem" }}
        />
        <button type="submit">Dub</button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <strong>Server Response:</strong>
        <pre>{response}</pre>
      </div>
    </div>
  );
}

export default App;

