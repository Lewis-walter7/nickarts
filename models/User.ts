import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        // Normalised on write so lookups (which lowercase the input) always match
        // and the unique index cannot be sidestepped by casing.
        lowercase: true,
        trim: true,
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
