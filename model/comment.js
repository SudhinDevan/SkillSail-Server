import mongoose, { Schema } from "mongoose";

const {Schemam, model } = mongoose;

const comment = new Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    reply:{
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
})