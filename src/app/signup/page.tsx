
"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState(""); 

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post("/api/auth/signup", { email, password, userName });
            if (res.status === 201) {
                toast.success("Signup successful! Redirecting...");
                setTimeout(() => router.push("/login"), 1500);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.error || "Signup failed");
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSignup} className="bg-black p-6 rounded-lg shadow-md w-full sm:w-96">
                <h2 className="text-2xl font-semibold mb-4 font-sans text-white text-center">Signup</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 rounded w-full mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 rounded w-full mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Username"
                    className="border p-2 rounded w-full mb-2"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Signup</button>

                {/* Clickable entire text */}
                <p 
                    className="text-blue-400 text-center mt-4 cursor-pointer hover:underline"
                    onClick={() => router.push("/login")}
                >
                    Already have an account? Lets login
                </p>
            </form>
        </div>
    );
}
