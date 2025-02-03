import mongoose from "mongoose";

export async function connect (){
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notes-app");
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB connection lost. Reconnecting...");
    });

}

