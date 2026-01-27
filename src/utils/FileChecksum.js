import React, { useState } from "react";

const CHUNK_SIZE = 64 * 1024 * 1024; // 64 MB

export default function FileChecksum() {
  const [checksum, setChecksum] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateChecksum = async (file) => {
    setLoading(true);
    setChecksum(null);

    const hashBuffer = await (async () => {
      const hash = await crypto.subtle.digest(
        "SHA-256",
        new Uint8Array(0) // init with empty
      );

      const chunks = [];
      let offset = 0;

      while (offset < file.size) {
        const chunk = file.slice(offset, offset + CHUNK_SIZE);
        const arrayBuffer = await chunk.arrayBuffer();
        chunks.push(new Uint8Array(arrayBuffer));
        offset += CHUNK_SIZE;
      }

      // Concatenate all chunks into one buffer
      const fullBuffer = new Uint8Array(
        chunks.reduce((acc, c) => acc + c.length, 0)
      );
      let pos = 0;
      for (const c of chunks) {
        fullBuffer.set(c, pos);
        pos += c.length;
      }

      return crypto.subtle.digest("SHA-256", fullBuffer);
    })();

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    setChecksum(hashHex);
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      calculateChecksum(file);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">SHA-256 File Checksum</h1>
      <input type="file" onChange={handleFileChange} />
      {loading && <p className="mt-2">Calculating...</p>}
      {checksum && (
        <div className="mt-2 break-all">
          <strong>Checksum:</strong> {checksum}
        </div>
      )}
    </div>
  );
}
