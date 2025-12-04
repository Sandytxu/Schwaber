import { useState } from "react";

export default function IcsUploader({ onEventsLoaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const data = new FormData();
    data.append("file", file);

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/calendar/upload-ics`, {
      method: "POST",
      body: data,
      credentials: 'include'
    });


    const events = await res.json();
    onEventsLoaded(events);
    setLoading(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <input
        type="file"
        accept=".ics"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Cargando..." : "Cargar calendario"}
      </button>
    </div>
  );
}