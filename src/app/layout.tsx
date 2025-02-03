import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Toaster position="top-right" />
                {children}
            </body>
        </html>
    );
}
