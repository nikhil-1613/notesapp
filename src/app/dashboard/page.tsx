
"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Filter, Plus, Image as ImageIcon, LogOut, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AudioModal from "@/components/ui/audioModal";
import NoteModal from "@/components/ui/noteModal";
import NoteDetailsModal from "@/components/ui/NoteDetailsModal";

interface Note {
  _id: string;
  title?: string;
  content: string;
  favorite: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isNoteDetailsModalOpen, setIsNoteDetailsModalOpen] = useState(false);
  const [username, setUsername] = useState("");



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUsername(res.data.user.userName);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);



  const openNoteDetails = (note: Note) => {
    setSelectedNote(note);
    setIsNoteDetailsModalOpen(true);
  };

  const closeNoteDetails = () => {
    setIsNoteDetailsModalOpen(false);
    setSelectedNote(null);
  };


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

    // const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    const SpeechRecognition =
      window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      throw new Error("Speech recognition is not supported in this browser.");
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    // recognition.onerror = (event: SpeechRecognitionEvent) => toast.error("Error: " + event.error);
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      toast.error("Error: " + event.error);
    };
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
  // Save Transcribed Note
  const saveAudioNote = async () => {
    if (!transcript.trim()) {
      toast.error("No text to save.");
      return;
    }

    // Extract first two words as title
    const words = transcript.trim().split(/\s+/);
    const title = words.slice(0, 2).join(" ") || "Untitled Audio Note";

    try {
      const response = await axios.post(
        "/api/notes/audio",
        { transcript, title },
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
  const filteredNotes = notes
    .filter((note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-4">ALL Notes</h2>
        <nav>
          <ul>
            <li className="bg-purple-200 p-2 rounded mb-2">Home</li>
            <li className="text-gray-400 p-2 rounded" onClick={() => router.push("/favourites")}>Favourites</li>
          </ul>
        </nav>

        {/* <p className="text-gray-500">Emmanual Vincent</p> */}
        <div className="absolute bottom-4 ml-[80px] ">
          <p className="text-gray-500">{username || "Guest"}</p>
        </div>


      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4 relative">
          {/* Search Bar */}
          <Input
            placeholder="Search notes..."
            className="w-1/2 px-4 py-2 rounded-md border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-shadow shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex items-center gap-2 relative">
            {/* Sort Dropdown Button */}
            <Button
              variant="outline"
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
              <Filter className="w-4 h-4" /> <ChevronDown className="w-4 h-4" />
            </Button>

            {/* Sort Dropdown Menu */}
            {isSortDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-md shadow-lg w-48 z-10">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-purple-100 transition"
                  onClick={() => {
                    setSortOrder("newest");
                    setIsSortDropdownOpen(false);
                  }}
                >
                  Newest to Oldest
                </button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-purple-100 transition"
                  onClick={() => {
                    setSortOrder("oldest");
                    setIsSortDropdownOpen(false);
                  }}
                >
                  Oldest to Newest
                </button>
              </div>
            )}

            {/* Logout Button */}
            <Button
              variant="outline"
              className="border border-gray-300 rounded-md hover:bg-gray-100 transition"
              onClick={() => router.push("/login")}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="grid grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div key={note._id} className="p-4 cursor-pointer transition hover:shadow-lg" onClick={() => openNoteDetails(note)}>
              <Card>
                <CardContent>
                  <p className="text-gray-500 text-sm">{new Date(note.createdAt).toLocaleString()}</p>
                  <h3 className="font-semibold">{note.title || "Untitled Audio Note"}</h3>
                  <p className="text-gray-700 truncate">{note.content}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Note Details Modal */}
        <NoteDetailsModal
          isOpen={isNoteDetailsModalOpen}
          note={selectedNote}
          onClose={closeNoteDetails}
          onDelete={() => {
            // Add your delete logic here
          }}
          onRename={(newTitle: string) => {
            // Add your rename logic here
            console.log(newTitle)
          }}
        />

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