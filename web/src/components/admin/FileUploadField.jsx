import { useState } from 'react';
import axios from "axios";

export default function FileUploadField({ category, accept, onUploaded, label = "Fájl feltöltése" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("category", category);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/uploads`,
        formData
      );

      onUploaded(response.data);
    } catch (error) {
      console.error("Fájlfeltöltési hiba:", error);

      setError(
        error.response?.data?.message ||
          "Hiba történt a fájl feltöltése során."
      );
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={handleFileChange}
        className="block w-full cursor-pointer border border-slate-300 bg-white px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      />

      {uploading && (
        <p className="mt-2 text-sm text-slate-500">
          Feltöltés...
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}