import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String, // We'll store the hashed password here
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default models.User || model('User', UserSchema);
