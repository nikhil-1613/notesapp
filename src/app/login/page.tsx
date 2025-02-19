"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const res = await axios.post("/api/auth/login", { email, password });
            if (res.status === 200) {
                toast.success("Login successful! Redirecting...");
                localStorage.setItem("username", res.data.userName);
                setTimeout(() => router.push("/dashboard"), 1500);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.error || "Login failed");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-black p-6 rounded-lg shadow-md w-full sm:w-96">
                <h2 className="text-2xl font-semibold mb-4 font-sans text-white text-center">Login</h2>
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
                <button
                    type="submit"
                    className={`p-2 rounded w-full ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p 
                    className="text-blue-400 text-center mt-4 cursor-pointer hover:underline"
                    onClick={() => router.push("/signup")}
                >
                    Dont have an account? Create now
                </p>
            </form>
        </div>
    );
}

// "use client"
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import toast from "react-hot-toast";

// export default function Login() {
//     const router = useRouter();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             const res = await axios.post("/api/auth/login", { email, password });
//             if (res.status === 200) {
//                 toast.success("Login successful! Redirecting...");
//                 localStorage.setItem("username",res.data.userName);
//                 setTimeout(() => router.push("/dashboard"), 1500);
//             }
//         } catch (err) {
//             if (axios.isAxiosError(err)) {
//                 toast.error(err.response?.data?.error || "Login failed");
//             } else {
//                 toast.error("An unexpected error occurred");
//             }
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <form onSubmit={handleLogin} className="bg-black p-6 rounded-lg shadow-md w-full sm:w-96">
//                 <h2 className="text-2xl font-semibold mb-4 font-sans text-white text-center">Login</h2>
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     className="border p-2 rounded w-full mb-2"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     className="border p-2 rounded w-full mb-4"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>

//                 {/* Clickable entire text to navigate to Signup */}
//                 <p 
//                     className="text-blue-400 text-center mt-4 cursor-pointer hover:underline"
//                     onClick={() => router.push("/signup")}
//                 >
//                     Dont have an account? Create now
//                 </p>
//             </form>
//         </div>
//     );
// }
