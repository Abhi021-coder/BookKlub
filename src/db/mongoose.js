// const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/book-manager-api", {
// 	useNewUrlParser: true,
// });

const mongoose = require("mongoose");
const url =
	"mongodb+srv://book:book@cluster0.evbih.mongodb.net/book?retryWrites=true&w=majority";
mongoose
	.connect(url)
	.then(() => {
		console.log("DB success");
	})
	.catch((err) => {
		console.log("DB error", err);
	});
