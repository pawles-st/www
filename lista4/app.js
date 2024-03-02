const http = require("http");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Logger = require("./logger/logger.js")

const dotenv = require("dotenv");
dotenv.config();
//const token_secret = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";

const express = require("express");
const app = express();
const port = 8080;

const User = require("./models/users.js");

const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/notes_db")
	.then(() => {
		console.log("connected to the database");
	}).catch(err => {
		console.log("database connection error:", err);
	});

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json());

const notes = require("./routes/noteRoutes.js");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/note", notes);

app.get("/", (req, res) => {
	const options = {
		hostname: "localhost",
		port: 8080,
		path: "/note",
		method: "GET",
	};

	const request = http.request(options, response => {
		let responseData = "";

		response.on("data", chunk => {
			responseData += chunk;
		})

		response.on("end", () => {
			const data = JSON.parse(responseData);
//			console.log(data);
			res.render("noteview", {data});
		})
	});

	request.on("error", error => {
		console.error("error fetching data from REST API:", error);
		res.status(500).json({message: "A server error has occured"});
	})

	request.end();
});

app.post("/register", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	Logger.register(req, res, email, password);
});

app.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	Logger.login(req, res, email, password);
})

app.listen(port, () => {
	console.log("Server is listening on port", port);
});
