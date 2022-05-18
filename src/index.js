const express = require("express");
require("./db/mongoose.js");
const userRouter = require("./routers/userRouter");
const bookRouter = require("./routers/bookRouter");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(bookRouter);

app.listen(port, () => {
	console.log("server is up on port " + port);
});
