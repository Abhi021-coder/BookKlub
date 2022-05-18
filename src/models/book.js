const mongoose = require("mongoose");
const validator = require("validator");
const bookSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	price: { type: Number, required: true },
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
