
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Filter, Plus, Image as ImageIcon } from "lucide-react";

export default function Dashboard() {
  const [notes] = useState([
    {
      id: 1,
      type: "audio",
      title: "Engineering Assignment Audio",
      content:
        "I'm recording an audio to transcribe into text for the assignment of engineering in terms of actors.",
      time: "Jan 30, 2025 • 5:26 PM",
      duration: "00:09",
      image: true,
    },
    {
      id: 2,
      type: "text",
      title: "Random Sequence",
      content: "ssxscscscsc",
      time: "Jan 30, 2025 • 5:21 PM",
    },
  ]);

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
        {/* Search & Sort */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search"
            className="w-1/2 border rounded px-4 py-2"
          />
          <Button variant="outline">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Notes Section */}
        <div className="grid grid-cols-2 gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="p-4">
              <CardContent>
                <p className="text-gray-500 text-sm">{note.time}</p>
                <h3 className="font-semibold">{note.title}</h3>
                <p className="text-gray-700">{note.content}</p>
                {note.type === "audio" && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm bg-gray-300 px-2 py-1 rounded">
                      {note.duration}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom Bar (Centered with Increased Size) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 p-5 border border-black rounded-full shadow-lg">
        {/* Add Note Button */}
        <Button className="flex items-center gap-2 px-4 py-2 rounded-full border border-transparent text-black">
          <Plus className="w-5 h-5" />
        </Button>

        {/* Add Image Button */}
        <Button className="flex items-center gap-2 px-4 py-2 rounded-full border border-transparent  text-black">
          <ImageIcon className="w-5 h-5" />
        </Button>

        {/* Start Recording Button */}
        <Button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">
          <Mic className="w-5 h-5" />
          Start Recording
        </Button>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Mic, Search, Filter } from "lucide-react";

// export default function Dashboard() {
//   const [notes, setNotes] = useState([
//     {
//       id: 1,
//       type: "audio",
//       title: "Engineering Assignment Audio",
//       content:
//         "I'm recording an audio to transcribe into text for the assignment of engineering in terms of actors.",
//       time: "Jan 30, 2025 • 5:26 PM",
//       duration: "00:09",
//       image: true,
//     },
//     {
//       id: 2,
//       type: "text",
//       title: "Random Sequence",
//       content: "ssxscscscsc",
//       time: "Jan 30, 2025 • 5:21 PM",
//     },
//   ]);

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
//         <div className="absolute bottom-4">
//           <p className="text-gray-500">Emmanual Vincent</p>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         {/* Search & Sort */}
//         <div className="flex justify-between items-center mb-4">
//           <Input
//             placeholder="Search"
//             className="w-1/2 border rounded px-4 py-2"
//           />
//           <Button variant="outline">
//             <Filter className="w-5 h-5" />
//           </Button>
//         </div>

//         {/* Notes Section */}
//         <div className="grid grid-cols-2 gap-4">
//           {notes.map((note) => (
//             <Card key={note.id} className="p-4">
//               <CardContent>
//                 <p className="text-gray-500 text-sm">{note.time}</p>
//                 <h3 className="font-semibold">{note.title}</h3>
//                 <p className="text-gray-700">{note.content}</p>
//                 {note.type === "audio" && (
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="text-sm bg-gray-300 px-2 py-1 rounded">
//                       {note.duration}
//                     </span>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </main>

//       {/* Floating Action Button */}
//       <div className="fixed bottom-6 right-6">
//         <Button className="bg-red-500 text-white px-6 py-3 rounded-full flex items-center gap-2">
//           <Mic className="w-5 h-5" /> Start Recording
//         </Button>
//       </div>
//     </div>
//   );
// }
