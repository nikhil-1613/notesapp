import { useState } from "react";
import axios from "axios";

interface Props {
  noteId: string;
}

const ImageUpload: React.FC<Props> = ({ noteId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("noteId", noteId);

    setUploading(true);
    try {
      const response = await axios.post("/api/upload-image", formData);
      setImageUrl(response.data.url);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg">
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 px-4 py-2 rounded-lg"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <div className="mt-4">
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Note" className="mt-2 w-40 h-40 object-cover" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
