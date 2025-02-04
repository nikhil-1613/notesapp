// "use client";
// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Mic, Filter, Plus, Image as ImageIcon, LogOut, ChevronDown } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import AudioModal from "@/components/ui/audioModal";
// import NoteModal from "@/components/ui/noteModal";

// interface Note {
//   _id: string;
//   title?: string;
//   content: string;
//   favorite?: boolean;
//   createdAt: string;
// }

// export default function Dashboard() {
//   const router = useRouter();
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOrder, setSortOrder] = useState("newest");
//   const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
//   useEffect(() => {
//     const fetchNotes = async () => {
//       try {
//         const response = await axios.get("/api/notes/", { withCredentials: true });
//         setNotes(response.data.notes);
//       } catch (error) {
//         console.error("Error fetching notes:", error);
//         toast.error("Failed to fetch notes.");
//       }
//     };

//     fetchNotes();
//   }, []);

//   // Filtered and Sorted Notes
//   const filteredNotes = notes
//     .filter((note) => 
//       note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       note.content.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .sort((a, b) => 
//       sortOrder === "newest"
//         ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//     );

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-100 p-4">
//         <h2 className="text-lg font-bold mb-4">AI Notes</h2>
//         <nav>
//           <ul>
//             <li className="bg-purple-200 p-2 rounded mb-2">Home</li>
//             <li className="text-gray-400 p-2 rounded">Favourites</li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <div className="flex justify-between items-center mb-4 relative">
//           {/* Search Input */}
//           <Input 
//             placeholder="Search notes..." 
//             className="w-1/2 border rounded px-4 py-2"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />

//           {/* Sort and Logout */}
//           <div className="flex items-center gap-2 relative">
//             <Button variant="outline" onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}>
//               <Filter className="w-5 h-5" />
//               <ChevronDown className="w-4 h-4 ml-1" />
//             </Button>

//             {/* Sorting Dropdown */}
//             {isSortDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-md">
//                 <button 
//                   className={`block w-full px-4 py-2 text-left ${
//                     sortOrder === "newest" ? "bg-gray-100" : ""
//                   }`}
//                   onClick={() => { setSortOrder("newest"); setIsSortDropdownOpen(false); }}
//                 >
//                   Newest to Oldest
//                 </button>
//                 <button 
//                   className={`block w-full px-4 py-2 text-left ${
//                     sortOrder === "oldest" ? "bg-gray-100" : ""
//                   }`}
//                   onClick={() => { setSortOrder("oldest"); setIsSortDropdownOpen(false); }}
//                 >
//                   Oldest to Newest
//                 </button>
//               </div>
//             )}

//             <Button variant="outline" onClick={() => router.push("/login")}>
//               <LogOut className="w-5 h-5" />
//             </Button>
//           </div>
//         </div>

//         {/* Notes Section */}
//         <div className="grid grid-cols-2 gap-4">
//           {filteredNotes.length > 0 ? (
//             filteredNotes.map((note) => (
//               <Card key={note._id} className="p-4">
//                 <CardContent>
//                   <p className="text-gray-500 text-sm">{new Date(note.createdAt).toLocaleString()}</p>
//                   <h3 className="font-semibold">{note.title || "Untitled Audio Note"}</h3>
//                   <p className="text-gray-700">{note.content}</p>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <p className="text-gray-400">No notes found.</p>
//           )}
//         </div>
//       </main>

//       {/* Bottom Bar */}
//       <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-5 p-5 border border-black rounded-full shadow-lg">
//         <Button
//           variant="outline"
//           className="flex items-center gap-2 px-4 py-2 rounded-full border border-black text-black"
//           onClick={() => setIsNoteModalOpen(true)}
//         >
//           <Plus className="w-6 h-6" />
//         </Button>

//         <Button variant="outline" className="flex items-center gap-2 px-4 py-2 rounded-full border border-black text-black">
//           <ImageIcon className="w-5 h-5" />
//         </Button>

//         <Button
//           className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
//           onClick={() => setIsAudioModalOpen(true)}
//         >
//           <Mic className="w-5 h-5" />
//           Start Recording
//         </Button>
//       </div>

//       {/* Modals */}
//       <NoteModal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} onSave={(handleSaveNote) => {}} />
//       <AudioModal isOpen={isAudioModalOpen} onClose={() => setIsAudioModalOpen(false)} transcript="" onCopyTranscript={() => {}} onSaveNote={() => {}} />
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Filter, Plus, Image as ImageIcon, LogOut } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AudioModal from "@/components/ui/audioModal";
import NoteModal from "@/components/ui/noteModal";

interface Note {
  _id: string;
  title?: string;
  content: string;
  favorite?: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  

  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch notes from API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/api/notes/", { withCredentials: true });
        setNotes(response.data.notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to fetch notes.");
      }
    };

    fetchNotes();
  }, []);

  // Open/Close Modal Functions
  const openNoteModal = () => {
    setIsNoteModalOpen(true);
    setIsAudioModalOpen(false);
  };

  const openAudioModal = () => {
    setIsAudioModalOpen(true);
    setIsNoteModalOpen(false);
  };

  const closeModals = () => {
    setIsNoteModalOpen(false);
    setIsAudioModalOpen(false);
  };

  // Start Voice Recognition and Open Audio Modal
  const startVoiceRecognition = () => {
    openAudioModal();
    setTranscript("");
    toast.success("Recording started...");

    const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    recognition.lang = "en-IN";
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => toast.error("Error: " + event.error);

    recognition.start();

    recordingTimerRef.current = setTimeout(() => {
      stopVoiceRecognition();
      closeModals();
      toast.success("Recording stopped after 1 minute.");
    }, 60000);
  };

  // Stop Voice Recognition
  const stopVoiceRecognition = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
    }
  };

  // Save Transcribed Text to Database
  const saveAudioNote = async () => {
    if (!transcript.trim()) {
      toast.error("No text to save.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/notes/audio",
        { transcript },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.status === 201) {
        toast.success("Audio note saved successfully!");
        setNotes((prevNotes) => [response.data.note, ...prevNotes]);
        closeModals();
      } else {
        toast.error("Failed to save note.");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Error saving note.");
    }
  };

  // Copy transcript to clipboard
  const copyTranscriptToClipboard = () => {
    navigator.clipboard.writeText(transcript).then(() => {
      toast.success("Transcript copied to clipboard!");
    }).catch((error) => {
      toast.error("Failed to copy: " + error.message);
    });
  };

  // Save a Text Note
  const handleSaveNote = async (noteData: { title: string; content: string; favorite: boolean }) => {
    try {
      const response = await axios.post(
        "/api/notes/",
        noteData,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.status === 201) {
        toast.success("Note added successfully!");
        setNotes((prevNotes) => [response.data.note, ...prevNotes]);
        closeModals();
      } else {
        toast.error("Failed to add note.");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Error adding note.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-4">AI Notes</h2>
        <nav>
          <ul>
            <li className="bg-purple-200 p-2 rounded mb-2">Home</li>
            <li className="text-gray-400 p-2 rounded">Favourites</li>
          </ul>
        </nav>
        <div className="absolute bottom-4">
          <p className="text-gray-500">Emmanual Vincent</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <Input placeholder="Search" className="w-1/2 border rounded px-4 py-2" />
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={() => router.push("/login")}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="grid grid-cols-2 gap-4">
          {notes.map((note) => (
            <Card key={note._id} className="p-4">
              <CardContent>
                <p className="text-gray-500 text-sm">{new Date(note.createdAt).toLocaleString()}</p>
                <h3 className="font-semibold">{note.title || "Untitled Audio Note"}</h3>
                <p className="text-gray-700">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-5 p-5 border border-black rounded-full shadow-lg">
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-black text-black"
          onClick={openNoteModal}
        >
          <Plus className="w-6 h-6" />
        </Button>

        <Button variant="outline" className="flex items-center gap-2 px-4 py-2 rounded-full border border-black text-black">
          <ImageIcon className="w-5 h-5" />
        </Button>

        <Button
          onClick={isRecording ? stopVoiceRecognition : startVoiceRecognition}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
        >
          <Mic className="w-5 h-5" />
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>

      {/* Modals */}
      <NoteModal isOpen={isNoteModalOpen} onClose={closeModals} onSave={handleSaveNote} />
      <AudioModal isOpen={isAudioModalOpen} onClose={closeModals} transcript={transcript} onCopyTranscript={copyTranscriptToClipboard} onSaveNote={saveAudioNote} />
    </div>
  );
}
