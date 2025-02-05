"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, LogOut, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import NoteDetailsModal from "@/components/ui/NoteDetailsModal";

interface Note {
  _id: string;
  title?: string;
  content: string;
  favorite: boolean;
  createdAt: string;
}

export default function Favourites() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isNoteDetailsModalOpen, setIsNoteDetailsModalOpen] = useState(false);

  // Fetch favorite notes from API
  useEffect(() => {
    const fetchFavoriteNotes = async () => {
      try {
        const response = await axios.get("/api/notes/favourites", { withCredentials: true });
        setNotes(response.data.notes);
        console.log(response.data.notes);  // Check the response in the console
      } catch (error) {
        console.error("Error fetching favorite notes:", error);
        toast.error("Failed to fetch favorite notes.");
      }
    };
  
    fetchFavoriteNotes();
  }, []);
  

  const openNoteDetails = (note: Note) => {
    setSelectedNote(note);
    setIsNoteDetailsModalOpen(true);
  };

  const closeNoteDetails = () => {
    setIsNoteDetailsModalOpen(false);
    setSelectedNote(null);
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
        <h2 className="text-lg font-bold mb-4">AI Notes</h2>
        <nav>
          <ul>
            <li className="text-gray-400 p-2 rounded" onClick={() => router.push("/dashboard")}>Home</li>
            <li className="bg-purple-200 p-2 rounded mb-2">Favourites</li>
          </ul>
        </nav>
        <div className="absolute bottom-4">
          <p className="text-gray-500">Emmanual Vincent</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4 relative">
          {/* Search Bar */}
          <Input
            placeholder="Search favorite notes..."
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
          favourite={selectedNote?.favorite || false}
          onDelete={() => {
            // Add your delete logic here
          }}
          onRename={(newTitle: string) => {
            // Add your rename logic here
          }}
        />
      </main>
    </div>
  );
}
