import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associated user
    title: { type: String, required: false },
    content: { type: String, required: true }, // Text content of the note
    isAudio: { type: Boolean, default: false }, // Flag for audio note
    audioUrl: { type: String }, // If the note is audio, store the audio file URL
    favorite: { type: Boolean, default: false }, // Favorite flag
    image: { data: Buffer, contentType: String }, // Image stored as a file (optional)
  },
  { timestamps: true }
);

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);
export default Note;

// import mongoose from "mongoose";

// const NoteSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Associated user
//     title: { type: String, required: true },
//     content: { type: String, required: true }, // Text content of the note
//     isAudio: { type: Boolean, default: false },  // Flag for audio note
//     audioUrl: { type: String },  // If the note is audio, store the audio file URL
//     favorite: { type: Boolean, default: false },  // Favorite flag
//   },
//   { timestamps: true }
// );

// const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);
// export default Note;
