import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Maximize, Minimize, Clipboard, Trash, Edit, Image, Heart, Save } from "lucide-react";
import toast from "react-hot-toast";

interface Note {
  _id: string;
  title?: string;
  content: string;
  createdAt: string;
  favorite: boolean;
  imageUrl?: string;
}

interface NoteDetailsModalProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string, newContent: string, newFavorite: boolean, imageUrl?: string) => void;
}

const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({ isOpen, note, onClose, onDelete, onRename }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(note?.title || "Untitled Note");
  const [newContent, setNewContent] = useState(note?.content || "");
  const [newFavorite, setNewFavorite] = useState(note?.favorite || false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(note?.imageUrl || "");
  const [showUploadButton, setShowUploadButton] = useState(false); // New state for upload button visibility

  useEffect(() => {
    if (note) {
      setNewTitle(note.title || "Untitled Note");
      setNewContent(note.content || "");
      setNewFavorite(note.favorite);
      setImageUrl(note.imageUrl || "");
      setIsEditing(false);
      setShowSaveButton(false);
      setShowUploadButton(false);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      toast.success("Note copied to clipboard!");
    } catch (error) {
      console.log("Error in copying text to clipboard",error)
      toast.error("Failed to copy text.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/notes/${note._id}`);
      toast.success("Note deleted successfully!");
      onDelete(note._id);
      onClose();
    } catch (error) {
      console.log("Error deleting note",error)
      toast.error("Error deleting note.");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/notes/${note._id}`, { 
        title: newTitle, 
        content: newContent, 
        favorite: newFavorite, 
        imageUrl
      });

      onRename(note._id, newTitle, newContent, newFavorite, imageUrl);
      toast.success("Note updated successfully!");
      setIsEditing(false);
      setShowSaveButton(false);
    } catch (error) {
      console.log("Error saving note.",error)
      toast.error("Error saving note.");
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setShowUploadButton(!!file); // Show upload button if a file is selected
  };
  const handleUploadImage = async () => {
    if (!image) {
      toast.error("No image selected.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("image", image);
  
      // 🔹 Upload to Cloudinary
      const uploadResponse = await axios.post(`/api/upload-image?noteId=${note._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const updatedImageUrl = uploadResponse.data.url;
      console.log("✅ Image uploaded to Cloudinary:", updatedImageUrl);
  
      // 🔹 Update note with new image URL
      const updateNoteResponse = await axios.put(`/api/notes/${note._id}`, {
        imageUrl: updatedImageUrl, // Ensure `imageUrl` is sent
      });
  
      console.log("✅ Note Updated:", updateNoteResponse.data);
      setImageUrl(updatedImageUrl);
  
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload Error:", error);
      toast.error("Image upload failed.");
    }
  };
  
  const toggleFavorite = async () => {
    try {
      const updatedFavorite = !newFavorite;
      setNewFavorite(updatedFavorite);
      setShowSaveButton(true);

      await axios.put(`/api/notes/${note._id}/favourite`, { favorite: updatedFavorite });
      toast.success(updatedFavorite ? "Added to Favorites!" : "Removed from Favorites!");
    } catch (error) {
      console.log("error in updates",error)
      toast.error("Error updating favorite.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg relative flex flex-col ${isMaximized ? "w-screen h-screen" : "w-1/2 max-h-3/4"}`}>
        <div className="absolute top-2 right-2 flex gap-2">
          <button onClick={() => setIsMaximized(!isMaximized)} className="p-2 bg-gray-200 rounded">
            {isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <button onClick={onClose} className="p-2 bg-red-500 text-white rounded">
            <X className="w-4 h-4" />
          </button>
          {/* test */}
          {showSaveButton && <button></button>}
        </div>

        <div className="mb-4 mt-6">
          {isEditing ? (
            <input type="text" className="w-full border p-2 rounded" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          ) : (
            <h2 className="text-xl font-bold cursor-pointer" onDoubleClick={() => setIsEditing(true)}>{note.title || "Untitled Note"}</h2>
          )}
          <p className="text-gray-500 text-sm">{new Date(note.createdAt).toLocaleString()}</p>
        </div>

        <div className="mb-4 flex-grow">
          {isEditing ? (
            <textarea className="w-full border p-2 rounded h-40" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
          ) : (
            <p className="text-gray-700 cursor-pointer" onDoubleClick={() => setIsEditing(true)}>{note.content}</p>
          )}
        </div>

        {imageUrl ? (
  <div className="flex justify-center">
    <img 
      src={imageUrl} 
      alt="Uploaded" 
      className="mb-4 max-w-[120px] max-h-[120px] sm:max-w-[150px] sm:max-h-[150px] md:max-w-[200px] md:max-h-[200px] lg:max-w-[250px] lg:max-h-[250px] object-contain rounded border border-gray-300 shadow-sm transition-all"
    />
  </div>  
) : (
  <p className="text-gray-500 text-sm mb-4 text-center">No images available to display.</p>
)}

        <div className="flex justify-between items-center">
          {isMaximized && (
            <div className="flex gap-2">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer p-2 bg-gray-200 rounded">
                <Image className="w-4 h-4" />
              </label>

              {showUploadButton && (
                <button onClick={handleUploadImage} className="p-2 bg-blue-500 text-white rounded">
                  Upload
                </button>
              )}

              <button onClick={toggleFavorite} className={`p-2 rounded ${newFavorite ? "text-red-500" : "text-gray-500"}`}>
                <Heart className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={handleCopy} className="p-2"><Clipboard className="w-4 h-4" /></button>
            <button onClick={handleDelete} className="p-2"><Trash className="w-4 h-4" /></button>
            {isEditing ? <button onClick={handleSave} className="p-2 bg-green-500 text-white"><Save className="w-4 h-4" /> Save</button> : <button onClick={() => setIsEditing(true)} className="p-2"><Edit className="w-4 h-4" /></button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailsModal;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { X, Maximize, Minimize, Clipboard, Trash, Edit, Image, Heart, Save } from "lucide-react";
// import { Button } from "./button";
// import toast from "react-hot-toast";

// interface Note {
//   _id: string;
//   title?: string;
//   content: string;
//   createdAt: string;
//   favorite: boolean;
//   imageUrl?: string;
// }

// interface NoteDetailsModalProps {
//   isOpen: boolean;
//   note: Note | null;
//   onClose: () => void;
//   onDelete: (id: string) => void;
//   onRename: (id: string, newTitle: string, newContent: string, newFavorite: boolean, imageUrl?: string) => void;
// }

// const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({ isOpen, note, onClose, onDelete, onRename }) => {
//   const [isMaximized, setIsMaximized] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [newTitle, setNewTitle] = useState(note?.title || "Untitled Note");
//   const [newContent, setNewContent] = useState(note?.content || "");
//   const [newFavorite, setNewFavorite] = useState(note?.favorite || false);
//   const [showSaveButton, setShowSaveButton] = useState(false);
//   const [image, setImage] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState(note?.imageUrl || "");

//   useEffect(() => {
//     if (note) {
//       setNewTitle(note.title || "Untitled Note");
//       setNewContent(note.content || "");
//       setNewFavorite(note.favorite);
//       setImageUrl(note.imageUrl || "");
//       setIsEditing(false);
//       setShowSaveButton(false);
//     }
//   }, [note]);

//   if (!isOpen || !note) return null;

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(note.content);
//       toast.success("Note copied to clipboard!");
//     } catch (error) {
//       toast.error("Failed to copy text.");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`/api/notes/${note._id}`);
//       toast.success("Note deleted successfully!");
//       onDelete(note._id);
//       onClose();
//     } catch (error) {
//       toast.error("Error deleting note.");
//     }
//   };

//   const handleSave = async () => {
//     try {
//       let uploadedImageUrl = imageUrl;

//       if (image) {
//         const formData = new FormData();
//         formData.append("file", image);
//         formData.append("noteId", note._id);

//         const uploadResponse = await axios.post("/api/upload-image", formData, {
//           headers: { "Content-Type": "multipart/form-data" }
//         });

//         if (uploadResponse.status === 200) {
//           uploadedImageUrl = uploadResponse.data.url;
//           setImageUrl(uploadedImageUrl);
//         } else {
//           toast.error("Failed to upload image.");
//           return;
//         }
//       }

//       await axios.put(`/api/notes/${note._id}`, { 
//         title: newTitle, 
//         content: newContent, 
//         favorite: newFavorite, 
//         imageUrl: uploadedImageUrl 
//       });

//       onRename(note._id, newTitle, newContent, newFavorite, uploadedImageUrl);
//       toast.success("Note updated successfully!");
//       setIsEditing(false);
//       setShowSaveButton(false);
//     } catch (error) {
//       toast.error("Error saving note.");
//     }
//   };

//   const toggleFavorite = async () => {
//     try {
//       const updatedFavorite = !newFavorite;
//       setNewFavorite(updatedFavorite);
//       setShowSaveButton(true);

//       await axios.put(`/api/notes/${note._id}/favourite`, { favorite: updatedFavorite });
//       toast.success(updatedFavorite ? "Added to Favorites!" : "Removed from Favorites!");
//     } catch (error) {
//       toast.error("Error updating favorite.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className={`bg-white p-6 rounded-lg shadow-lg relative flex flex-col ${isMaximized ? "w-screen h-screen" : "w-1/2 max-h-3/4"}`}>
//         <div className="absolute top-2 right-2 flex gap-2">
//           <button onClick={() => setIsMaximized(!isMaximized)} className="p-2 bg-gray-200 rounded">
//             {isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
//           </button>
//           <button onClick={onClose} className="p-2 bg-red-500 text-white rounded">
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="mb-4 mt-6">
//           {isEditing ? (
//             <input type="text" className="w-full border p-2 rounded" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
//           ) : (
//             <h2 className="text-xl font-bold cursor-pointer" onDoubleClick={() => setIsEditing(true)}>{note.title || "Untitled Note"}</h2>
//           )}
//           <p className="text-gray-500 text-sm">{new Date(note.createdAt).toLocaleString()}</p>
//         </div>

//         <div className="mb-4 flex-grow">
//           {isEditing ? (
//             <textarea className="w-full border p-2 rounded h-40" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
//           ) : (
//             <p className="text-gray-700 cursor-pointer" onDoubleClick={() => setIsEditing(true)}>{note.content}</p>
//           )}
//         </div>

//         {imageUrl && <img src={imageUrl} alt="Uploaded" className="mb-4 w-full h-auto rounded" />}

//         <div className="flex justify-between items-center">
//           {isMaximized && (
//             <div className="flex gap-2">
//               <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="hidden" id="image-upload" />
//               <label htmlFor="image-upload" className="cursor-pointer"><Image className="w-4 h-4" /></label>
//               <button onClick={toggleFavorite} className={`p-2 rounded ${newFavorite ? "text-red-500" : "text-gray-500"}`}><Heart className="w-4 h-4" /></button>
//             </div>
//           )}

//           <div className="flex gap-2">
//             <button onClick={handleCopy} className="p-2"><Clipboard className="w-4 h-4" /></button>
//             <button onClick={handleDelete} className="p-2"><Trash className="w-4 h-4" /></button>
//             {isEditing ? <button onClick={handleSave} className="p-2 bg-green-500 text-white"><Save className="w-4 h-4" /> Save</button> : <button onClick={() => setIsEditing(true)} className="p-2"><Edit className="w-4 h-4" /></button>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteDetailsModal;

// import React, { useState, useEffect } from "react";
// import axios from "axios"; // Import Axios
// import { X, Maximize, Minimize, Clipboard, Trash, Edit, Image, Heart, Save } from "lucide-react";
// import { Button } from "./button";
// import toast from "react-hot-toast";

// interface Note {
//   _id: string;
//   title?: string;
//   content: string;
//   createdAt: string;
//   favorite: boolean;
//   imageUrl?: string; // Image URL field
// }

// interface NoteDetailsModalProps {
//   isOpen: boolean;
//   note: Note | null;
//   onClose: () => void;
//   onDelete: (id: string) => void;
//   onRename: (id: string, newTitle: string, newContent: string, newFavorite: boolean, imageUrl?: string) => void;
// }

// const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({
//   isOpen,
//   note,
//   onClose,
//   onDelete,
//   onRename,
// }) => {
//   const [isMaximized, setIsMaximized] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [newTitle, setNewTitle] = useState(note?.title || "Untitled Note");
//   const [newContent, setNewContent] = useState(note?.content || "");
//   const [newFavorite, setNewFavorite] = useState(note?.favorite || false);
//   const [showSaveButton, setShowSaveButton] = useState(false);
//   const [image, setImage] = useState<File | null>(null); // To store the selected image
//   const [imageUrl, setImageUrl] = useState(note?.imageUrl || ""); // To store the uploaded image URL

//   // Reset state when a new note is opened
//   useEffect(() => {
//     if (note) {
//       setNewTitle(note.title || "Untitled Note");
//       setNewContent(note.content || "");
//       setNewFavorite(note.favorite);
//       setImageUrl(note.imageUrl || "");
//       setIsEditing(false);
//       setShowSaveButton(false);
//     }
//   }, [note]);

//   if (!isOpen || !note) return null;

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(note.content);
//       toast.success("Note copied to clipboard!");
//     } catch (error) {
//       toast.error("Failed to copy text.");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const response = await axios.delete(`/api/notes/${note._id}`);
  
//       if (response.status === 200) {
//         toast.success("Note deleted successfully!");
//         onDelete(note._id);
//         onClose();
//       } else {
//         toast.error("Failed to delete note.");
//       }
//     } catch (error) {
//       toast.error("Error deleting note.");
//       console.error(error);
//     }
//   };
//   const handleSave = async () => {
//     try {
//       let uploadedImageUrl = imageUrl;
  
//       // Upload the image only if it's selected
//       if (image) {
//         const formData = new FormData();
//         formData.append("file", image);
//         formData.append("noteId", note._id);  // Send the note ID
  
//         const uploadResponse = await axios.post("/api/upload-image", formData, {
//           headers: { "Content-Type": "multipart/form-data" }
//         });
  
//         if (uploadResponse.status === 200) {
//           uploadedImageUrl = uploadResponse.data.url;  // Get the image URL from the response
//           setImageUrl(uploadedImageUrl);
//         } else {
//           toast.error("Failed to upload image.");
//           return;
//         }
//       }
  
//       // Update the note only if something has changed (title, content, favorite, or image)
//       if (
//         (newTitle.trim() && newTitle !== note.title) ||
//         newContent !== note.content ||
//         newFavorite !== note.favorite ||
//         uploadedImageUrl !== note.imageUrl
//       ) {
//         const response = await axios.put(`/api/notes/${note._id}`, { 
//           title: newTitle, 
//           content: newContent, 
//           favorite: newFavorite, 
//           imageUrl: uploadedImageUrl 
//         });
  
//         if (response.status === 200) {
//           onRename(note._id, newTitle, newContent, newFavorite, uploadedImageUrl);
//           toast.success("Note updated successfully!");
//         } else {
//           toast.error("Failed to update note.");
//         }
//       }
  
//       setIsEditing(false);
//       setShowSaveButton(false);
//     } catch (error) {
//       console.error("Error saving note:", error);
//       toast.error("Error saving note.");
//     }
//   };
  

//   const toggleFavorite = async () => {
//     try {
//       const updatedFavorite = !newFavorite;
//       setNewFavorite(updatedFavorite);
//       setShowSaveButton(true);

//       const response = await axios.put(`/api/notes/${note._id}/favourite`, { favorite: updatedFavorite });

//       if (response.status === 200) {
//         toast.success(updatedFavorite ? "Added to Favorites!" : "Removed from Favorites!");
//       } else {
//         toast.error("Failed to update favorite status.");
//       }
//     } catch (error) {
//       console.error("Error updating favorite:", error);
//       toast.error("Error updating favorite.");
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files ? e.target.files[0] : null;
//     if (file) {
//       setImage(file);
//       setShowSaveButton(true);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div
//         className={`bg-white p-6 rounded-lg shadow-lg relative flex flex-col ${isMaximized ? "w-screen h-screen" : "w-1/2 max-h-3/4"
//           }`}
//       >
//         {/* Header with buttons */}
//         <div className="absolute top-2 right-2 flex gap-2">
//           <button onClick={() => setIsMaximized(!isMaximized)} className="p-2 bg-gray-200 rounded">
//             {isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
//           </button>
//           <button onClick={onClose} className="p-2 bg-red-500 text-white rounded">
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Note Title */}
//         <div className="mb-4 mt-6">
//           {isEditing ? (
//             <input
//               type="text"
//               className="w-full border p-2 rounded"
//               value={newTitle}
//               onChange={(e) => {
//                 setNewTitle(e.target.value);
//                 setShowSaveButton(true);
//               }}
//             />
//           ) : (
//             <h2 className="text-xl font-bold cursor-pointer" onDoubleClick={() => setIsEditing(true)}>
//               {note.title || "Untitled Note"}
//             </h2>
//           )}
//           <p className="text-gray-500 text-sm">{new Date(note.createdAt).toLocaleString()}</p>
//         </div>

//         {/* Note Content */}
//         <div className="mb-4 flex-grow">
//           {isEditing ? (
//             <textarea
//               className="w-full border p-2 rounded h-40"
//               value={newContent}
//               onChange={(e) => {
//                 setNewContent(e.target.value);
//                 setShowSaveButton(true);
//               }}
//             />
//           ) : (
//             <p className="text-gray-700 cursor-pointer" onDoubleClick={() => setIsEditing(true)}>
//               {note.content}
//             </p>
//           )}
//         </div>

//         {/* Image Preview */}
//         {imageUrl && <img src={imageUrl} alt="Uploaded" className="mb-4 w-full h-auto rounded" />}

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center">
//           {/* Left-side buttons (Image & Favorite) */}
//           <div className="flex gap-2">
//             <Button variant="outline" className="p-2 text-black rounded flex items-center gap-1">
//               <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
//               <label htmlFor="image-upload" className="cursor-pointer">
//                 <Image className="w-4 h-4" />
//               </label>
//             </Button>
//             <Button
//               variant="outline"
//               className={`p-2 rounded flex items-center gap-1 ${newFavorite ? "text-red-500" : "text-gray-500"}`}
//               onClick={toggleFavorite}
//             >
//               <Heart className="w-4 h-4" />
//             </Button>
//           </div>

//           {/* Right-side buttons (Copy, Delete, Rename) */}
//           <div className="flex gap-2">
//             <Button onClick={handleCopy} variant="outline" className="p-2 text-black rounded flex items-center gap-1">
//               <Clipboard className="w-4 h-4" />
//             </Button>
//             <Button onClick={handleDelete} variant="outline" className="p-2 text-black rounded flex items-center gap-1">
//               <Trash className="w-4 h-4" />
//             </Button>
//             {isEditing ? (
//               <Button onClick={handleSave} className="p-2 bg-green-500 text-white rounded flex items-center gap-1">
//                 <Save className="w-4 h-4" /> Save
//               </Button>
//             ) : (
//               <Button onClick={() => setIsEditing(true)} variant="outline" className="p-2 text-black rounded flex items-center gap-1">
//                 <Edit className="w-4 h-4" />
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteDetailsModal;

