import { useState } from "react"

function App() {
  const [url, setUrl] = useState("")
  const [lang, setLang] = useState("hi")
  const [loading, setLoading] = useState(false)

  const languages = [
    { code: "hi", name: "Hindi" },
    { code: "te", name: "Telugu" },
    { code: "ta", name: "Tamil" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "bn", name: "Bengali" },
    { code: "gu", name: "Gujarati" },
    { code: "mr", name: "Marathi" },
    { code: "pa", name: "Punjabi" },
    { code: "ur", name: "Urdu" },
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/dub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, target_lang: lang })
      });
      const data = await response.blob();
      const audioUrl = URL.createObjectURL(data);
      new Audio(audioUrl).play();
    } catch (err) {
      alert("Error dubbing video.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl w-full max-w-xl shadow-lg space-y-4">
        <h1 className="text-3xl font-bold text-center mb-4">🎧 YouDub</h1>
        <input
          type="text"
          className="w-full p-3 rounded bg-gray-800 border border-gray-600"
          placeholder="Paste YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <select
          className="w-full p-3 rounded bg-gray-800 border border-gray-600"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Dubbing..." : "Dub Now"}
        </button>
      </form>
    </div>
  );
}

export default App;

