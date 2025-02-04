import { Button } from "@/components/ui/button";

export default function AudioModal({
  isOpen,
  onClose,
  transcript,
  onCopyTranscript,
  onSaveNote,
}: {
  isOpen: boolean;
  onClose: () => void;
  transcript: string;
  onCopyTranscript: () => void;
  onSaveNote: () => void;
}) {
  if (!isOpen) return null; // Don't render if the modal is not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4">Transcript</h2>
        <p className="mb-4">{transcript || "No transcription available."}</p>
        <div className="flex gap-2">
          <Button onClick={onCopyTranscript} className="bg-green-500 text-white px-3 py-1.5 text-sm rounded">
            Copy to Clipboard
          </Button>
          <Button onClick={onSaveNote} className="bg-blue-500 text-white px-3 py-1.5 text-sm rounded">
            Save Note
          </Button>
        </div>
        <Button onClick={onClose} className="mt-4 px-3 py-1.5 bg-gray-500 text-white rounded text-sm">
          Close
        </Button>
      </div>
    </div>
  );
}

// // AudioModal.tsx
// import { Button } from "@/components/ui/button";

// export default function AudioModal({
//   isOpen,
//   onClose,
//   transcript,
//   onCopyTranscript,
//   onSaveNote,
//   onStopRecording,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   transcript: string;
//   onCopyTranscript: () => void;
//   onSaveNote: () => void;
//   onStopRecording: () => void;
// }) {
//   if (!isOpen) return null; // Don't render if the modal is not open

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg w-1/3">
//         <h2 className="text-lg font-semibold mb-4">Transcript</h2>
//         <p className="mb-4">{transcript || "No transcription available."}</p>
//         <div className="flex gap-2">
//           <Button onClick={onCopyTranscript} className="bg-green-500 text-white px-3 py-1.5 text-sm rounded">
//             Copy to Clipboard
//           </Button>
//           <Button onClick={onStopRecording} className="bg-red-500 text-white px-3 py-1.5 text-sm rounded">
//             Stop Recording
//           </Button>
//           <Button onClick={onSaveNote} className="bg-blue-500 text-white px-3 py-1.5 text-sm rounded">
//             Save Note
//           </Button>
//         </div>
//         <Button onClick={onClose} className="mt-4 px-3 py-1.5 bg-gray-500 text-white rounded text-sm">
//           Close
//         </Button>
//       </div>
//     </div>
//   );
// }
