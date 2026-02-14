import mongoose, { Schema, model, models } from 'mongoose';

const GalleryWorkSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the work.'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    category: {
        type: String,
        required: [true, 'Please specify the category.'],
        maxlength: [40, 'Category cannot be more than 40 characters'],
    },
    year: {
        type: String,
        required: [true, 'Please specify the year.'],
    },
    images: {
        type: [String],
        required: [true, 'Please provide at least one image.'],
    },
    price: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description.'],
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default models.GalleryWork || model('GalleryWork', GalleryWorkSchema);
