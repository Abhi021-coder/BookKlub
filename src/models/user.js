const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("email is invalid");
			}
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 7,
		validate(value) {
			if (value.toLowerCase().includes("password")) {
				throw new Error("you cannot set password as password");
			}
		},
	},
	age: {
		type: Number,
		validate(value) {
			if (value < 0) {
				throw new Error("Age must be positive");
			}
		},
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

userSchema.virtual("books", {
	ref: "Book",
	localField: "_id",
	foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = await jwt.sign(
		{ _id: user._id.toString() },
		"finalyearproject"
	);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("email is invalid");
	}
	const isMatched = await bcrypt.compare(password, user.password);
	if (!isMatched) {
		throw new Error("password is incorrect");
	}
	return user;
};

// hash the plain text password before saving
userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	return next;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
