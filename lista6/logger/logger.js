const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");

function register(req, res, email, password) {
	if (!(email && password)) {
		return res.status(400).send("all input is required");
	}

	User.findOne({email})
		.then(user => {
			if (user) {
				return res.status(409).send("user already exists");
			}

			bcrypt.hash(password, 10).then(pass => {
				console.log(pass);

				User.create({
					email,
					pass,
				}).then(user => {
	//				const token = jwt.sign({email, password}, token_secret, {expiresIn: "30s"});
					const token = jwt.sign({email, password}, process.env.token_secret, {expiresIn: "30s"});
					res.status(201).json(token);
				})
			});
		});
}

function login(req, res, email, password) {
	User.findOne({email})
		.then(user => {
			if (!user) {
				return res.status(401).send("invalid login");
			}
			console.log(user.password);

//			const token = jwt.sign({email, password}, token_secret, {expiresIn: "1m"});
			const token = jwt.sign({email, password}, process.env.token_secret, {expiresIn: "15m"});
			console.log(token);
			res.status(201).json(token);
		});
}

module.exports = {login, register};
