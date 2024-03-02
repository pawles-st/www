const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	author: String,
	text: String,
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
