import { useState } from "react";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: { title: string, content: string, favorite: boolean }) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [favorite, setFavorite] = useState(false);

  const handleSubmit = () => {
    const noteData = {
      title,
      content,
      favorite,
    };

    onSave(noteData); // Pass noteData to the parent
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null; // Hide modal if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add Note</h2>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        {/* Content Input */}
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        ></textarea>

        {/* Checkbox for Favorite */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={favorite}
            onChange={() => setFavorite(!favorite)}
          />
          <label>Mark as Favorite</label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;

// import { useState } from "react";
// interface NoteModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (formData: FormData) => void;
// }

// const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave }) => {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [favorite, setFavorite] = useState(false);

//   const handleSubmit = () => {
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("content", content);
//     formData.append("favorite", favorite.toString());

//     onSave(formData); // Pass formData to the parent
//     onClose(); // Close the modal after saving
//   };

//   if (!isOpen) return null; // Hide modal if not open

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h2 className="text-lg font-semibold mb-4">Add Note</h2>

//         {/* Title Input */}
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full p-2 border rounded mb-2"
//         />

//         {/* Content Input */}
//         <textarea
//           placeholder="Content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="w-full p-2 border rounded mb-2"
//         ></textarea>

//         {/* Checkbox for Favorite */}
//         <div className="flex items-center gap-2 mb-2">
//           <input
//             type="checkbox"
//             checked={favorite}
//             onChange={() => setFavorite(!favorite)}
//           />
//           <label>Mark as Favorite</label>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-2">
//           <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteModal;