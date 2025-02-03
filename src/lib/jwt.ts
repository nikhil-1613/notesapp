import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production

export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, SECRET, { expiresIn: "7d" }); // Token valid for 7 days
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return null;
    }
};
