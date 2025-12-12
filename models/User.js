import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        require: true,
        type: String,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        require: true
    }
}, {timestamps: true})

export default mongoose.model('User', UserSchema)