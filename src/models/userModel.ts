import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
    },

    userName:{
        type:String,
        required:true,
    }
})
const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;