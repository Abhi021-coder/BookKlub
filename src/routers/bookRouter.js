const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const auth = require("../middleware/auth");

router.post("/books", auth, async (req, res) => {
	const book = new Book({
		...req.body,
		owner: req.user._id,
	});

	try {
		await book.save();
		res.status(201).send(book);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.get("/books", async (req, res) => {
	const books = await Book.find({});
	try {
		res.status(201).send(books);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.get("/books/:id", async (req, res) => {
	const _id = req.params.id;

	try {
		const book = await Book.findById(_id);
		if (!book) {
			return res.status(401).send("!user not found");
		}

		res.status(201).send(book);
	} catch (e) {
		res.status(500).send(e);
	}
});

//FOR SEARCH A BOOK BY BOOK NAME
router.get("/books/search/:key", async (req, res) => {
	let Name = req.params.key.toUpperCase();
	let data = await Book.find({
		$or: [{ Name: { $regex: Name } }],
	});
	res.send(data);
});

router.patch("/books/:id", async (req, res) => {
	const updates = Object.keys(req.body);
	const allowUpdates = ["name", "price"];
	const isValidOperation = updates.every((update) =>
		allowUpdates.includes(update)
	);
	if (!isValidOperation) {
		return res.status(400).send("Error : Invaild update");
	}

	try {
		const book = await Book.findById(req.params.id);
		updates.forEach((update) => (book[update] = req.body[update]));
		book.save();

		if (!book) {
			return res.status(404).send("book is not found");
		}
		res.status(201).send(book);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.delete("/books/:id", async (req, res) => {
	try {
		const book = await Book.findByIdAndDelete(req.params.id);
		if (!book) {
			return res.status(404).send("book not found");
		}
		res.status(201).send(book);
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
