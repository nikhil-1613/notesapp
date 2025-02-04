import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { X, Maximize, Minimize, Clipboard, Trash, Edit, Image, Heart, Save } from "lucide-react";
import { Button } from "./button";
import toast from "react-hot-toast";

interface Note {
  _id: string;
  title?: string;
  content: string;
  createdAt: string;
  favorite: boolean;
}

interface NoteDetailsModalProps {
  isOpen: boolean;
  note: Note | null;
  favourite:Boolean,
  onClose: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string, newContent: string, newFavorite: boolean) => void;
}

const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({
  isOpen,
  note,
  onClose,
  onDelete,
  onRename,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(note?.title || "Untitled Note");
  const [newContent, setNewContent] = useState(note?.content || "");
  const [newFavorite, setNewFavorite] = useState(note?.favorite || false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Reset state when a new note is opened
  useEffect(() => {
    if (note) {
      setNewTitle(note.title || "Untitled Note");
      setNewContent(note.content || "");
      setNewFavorite(note.favorite);
      setIsEditing(false);
      setShowSaveButton(false);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      toast.success("Note copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy text.");
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(note._id);
      onClose();
    } catch (error) {
      toast.error("Error deleting note");
    }
  };

  const handleSave = async () => {
    try {
      // Check if title, content, or favorite has changed
      if (
        (newTitle.trim() && newTitle !== note.title) ||
        newContent !== note.content ||
        newFavorite !== note.favorite
      ) {
        // Make the API request to update the note
        const response = await axios.put(`/api/notes/${note._id}`, { title: newTitle, content: newContent, favorite: newFavorite });
  
        // Check the response and show success message if it was successful
        if (response.status === 200) {
          // Update the parent component with the new values
          onRename(note._id, newTitle, newContent, newFavorite);
          toast.success("Note updated successfully!");
        } else {
          toast.error("Failed to update note.");
        }
      }
  
      setIsEditing(false);
      setShowSaveButton(false);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Error saving note.");
    }
  };
  
  const toggleFavorite = () => {
    setNewFavorite((prev) => !prev);
    setShowSaveButton(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className={`bg-white p-6 rounded-lg shadow-lg relative flex flex-col ${
          isMaximized ? "w-screen h-screen" : "w-1/2 max-h-3/4"
        }`}
      >
        {/* Header with buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button onClick={() => setIsMaximized(!isMaximized)} className="p-2 bg-gray-200 rounded">
            {isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <button onClick={onClose} className="p-2 bg-red-500 text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Note Title */}
        <div className="mb-4 mt-6">
          {isEditing ? (
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                setShowSaveButton(true);
              }}
            />
          ) : (
            <h2 className="text-xl font-bold cursor-pointer" onDoubleClick={() => setIsEditing(true)}>
              {note.title || "Untitled Note"}
            </h2>
          )}
          <p className="text-gray-500 text-sm">{new Date(note.createdAt).toLocaleString()}</p>
        </div>

        {/* Note Content */}
        <div className="mb-4 flex-grow">
          {isEditing ? (
            <textarea
              className="w-full border p-2 rounded h-40"
              value={newContent}
              onChange={(e) => {
                setNewContent(e.target.value);
                setShowSaveButton(true);
              }}
            />
          ) : (
            <p className="text-gray-700 cursor-pointer" onDoubleClick={() => setIsEditing(true)}>
              {note.content}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          {/* Left-side buttons (Image & Favorite) */}
          <div className="flex gap-2">
            <Button variant="outline" className="p-2 text-black rounded flex items-center gap-1">
              <Image className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className={`p-2 rounded flex items-center gap-1 ${newFavorite ? "text-red-500" : "text-gray-500"}`}
              onClick={toggleFavorite}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Right-side buttons (Copy, Delete, Rename) */}
          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" className="p-2 text-black rounded flex items-center gap-1">
              <Clipboard className="w-4 h-4" />
            </Button>
            <Button onClick={handleDelete} variant="outline" className="p-2 text-black rounded flex items-center gap-1">
              <Trash className="w-4 h-4" />
            </Button>
            {isEditing ? (
              <Button onClick={handleSave} className="p-2 bg-green-500 text-white rounded flex items-center gap-1">
                <Save className="w-4 h-4" /> Save
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="p-2 text-black rounded flex items-center gap-1">
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailsModal;



// import React, { useState, useEffect } from "react";
// import { X, Maximize, Minimize, Clipboard, Trash, Edit, Image, Heart, Save } from "lucide-react";
// import { Button } from "./button";

// interface Note {
//   _id: string;
//   title?: string;
//   content: string;
//   createdAt: string;
// }

// interface NoteDetailsModalProps {
//   isOpen: boolean;
//   note: Note | null;
//   onClose: () => void;
//   onDelete: (id: string) => void;
//   onRename: (id: string, newTitle: string, newContent: string) => void;
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
//   const [showSaveButton, setShowSaveButton] = useState(false);

//   // Reset state when a new note is opened
//   useEffect(() => {
//     if (note) {
//       setNewTitle(note.title || "Untitled Note");
//       setNewContent(note.content || "");
//       setIsEditing(false);
//       setShowSaveButton(false);
//     }
//   }, [note]);

//   if (!isOpen || !note) return null;

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(note.content);
//       alert("Note copied to clipboard!");
//     } catch (error) {
//       alert("Failed to copy text.");
//     }
//   };

//   const handleDelete = () => {
//     onDelete(note._id);
//     onClose();
//   };

//   const handleSave = () => {
//     if ((newTitle.trim() && newTitle !== note.title) || newContent !== note.content) {
//       onRename(note._id, newTitle, newContent);
//     }
//     setIsEditing(false);
//     setShowSaveButton(false);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div
//         className={`bg-white p-6 rounded-lg shadow-lg relative flex flex-col ${
//           isMaximized ? "w-screen h-screen" : "w-1/2 max-h-3/4"
//         }`}
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

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center">
//           {/* Left-side buttons (Image & Favorite) */}
//           <div className="flex gap-2">
//             <Button variant="outline" className="p-2 text-black rounded flex items-center gap-1">
//               <Image className="w-4 h-4" />
//             </Button>
//             <Button variant="outline" className="p-2 text-black rounded flex items-center gap-1">
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
