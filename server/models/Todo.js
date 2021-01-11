const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("Todo", todoSchema);