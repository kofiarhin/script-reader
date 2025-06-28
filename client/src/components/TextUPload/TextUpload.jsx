import React, { useState } from "react";
import "./textUpload.styles.scss";

const TextUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const text = await file.text();
    console.log(text);
    onUpload(text);
  };

  return (
    <form id="upload-form" onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".txt"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" disabled={!file}>
        Upload Script
      </button>
    </form>
  );
};

export default TextUpload;
