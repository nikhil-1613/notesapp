import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import image from "next/image";

interface Props {
  noteId: string;
}

const ImageUpload: React.FC<Props> = ({ noteId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setMessage(""); // Reset messages
    }
  };
  const handleUploadImage = async () => {
    if (!image) {
      toast.error("No image selected.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("image", selectedFile as Blob);
  
      // 🔹 Upload image to Cloudinary
      const uploadResponse = await axios.post("/api/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const updatedImageUrl = uploadResponse.data.url; // Get Cloudinary URL
  
      // 🔹 Now update the note with new image URL
      const updateNoteResponse = await axios.put(`/api/notes/${noteId}`, {
        imageUrl: updatedImageUrl, // 🔥 Send imageUrl in request
      });
  
      if (updateNoteResponse.status === 200) {
        setImageUrl(updatedImageUrl);
        toast.success("✅ Image uploaded and saved successfully!");
      } else {
        toast.error("⚠️ Failed to update note.");
      }
    } catch (error) {
      console.error("❌ Upload Error:", error);
      toast.error("Something went wrong.");
    }
    finally{
      setUploading(false)
    }
  };
  

  // const handleUpload = async () => {
  //   if (!selectedFile) {
  //     setMessage("⚠️ Please select an image first!");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("image", selectedFile);
  //   formData.append("noteId", noteId);

  //   setUploading(true);
  //   setMessage(""); // Clear previous messages

  //   try {
  //     const response = await axios.post("/api/upload-image", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (response.status === 200) {
  //       setImageUrl(response.data.url);
  //       setMessage("✅ Image uploaded successfully!");
  //     } else {
  //       setMessage("⚠️ Failed to upload image.");
  //     }
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     setMessage("❌ Error: Could not upload image.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg w-full max-w-sm">
      {/* File Input */}
      <div className="flex flex-col items-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-2 p-2 border border-gray-600 rounded-md bg-gray-800 text-white w-full"
        />

        {/* Upload Button - Always Visible */}
        <button
          onClick={handleUploadImage}
          disabled={uploading}
          className={`mt-2 w-full px-4 py-2 rounded-lg text-white ${uploading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* Message */}
      {message && <p className="mt-2 text-center">{message}</p>}

      {/* Display Uploaded Image */}
      {imageUrl && (
        <div className="mt-4 flex flex-col items-center">
          <p>Uploaded Image:</p>
          {/* <img src={imageUrl} alt="Uploaded" className="mt-2 w-40 h-40 object-cover rounded-lg border border-gray-500" /> */}
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded Image" className="w-40 h-40 rounded-lg" />
          )}

        </div>
      )}
    </div>
  );
};

export default ImageUpload;

// import { useState } from "react";
// import axios from "axios";

// interface Props {
//   noteId: string;
// }

// const ImageUpload: React.FC<Props> = ({ noteId }) => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [message, setMessage] = useState<string>(""); // For user feedback

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setSelectedFile(event.target.files[0]);
//       setMessage(""); // Reset any previous messages
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setMessage("⚠️ Please select an image first!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", selectedFile);
//     formData.append("noteId", noteId);

//     setUploading(true);
//     setMessage(""); // Clear any old messages

//     try {
//       const response = await axios.post("/api/upload-image", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.status === 200) {
//         setImageUrl(response.data.url);
//         setMessage("✅ Image uploaded successfully!");
//       } else {
//         setMessage("⚠️ Failed to upload image.");
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setMessage("❌ Error: Could not upload image.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-900 text-white rounded-lg">
//       <input type="file" onChange={handleFileChange} className="mb-2" />
//       <button
//         onClick={handleUpload}
//         disabled={uploading}
//         className="bg-blue-500 px-4 py-2 rounded-lg"
//       >
//         {uploading ? "Uploading..." : "Upload Image"}
//       </button>

//       {message && <p className="mt-2">{message}</p>}

//       {imageUrl && (
//         <div className="mt-4">
//           <p>Uploaded Image:</p>
//           <img src={imageUrl} alt="Note" className="mt-2 w-40 h-40 object-cover" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUpload;
