const http = require("http");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Logger = require("./logger/logger.js");

const dotenv = require("dotenv");
dotenv.config();
const utils = require("./utils");

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

const session = require("express-session");
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
const flash = require("connect-flash");
app.use(flash());

const notes = require("./routes/noteRoutes.js");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/note", notes);

app.get("/", (req, res) => {
	const token = req.headers["authorization"]?.split(" ")[1];
	console.log(token);
	try {
		const user_data = req.flash("user_data")[0];
		console.log(user_data.email);
		const email = user_data.email.replace("@gmail.com", "");
		console.log(email);
		const url_path = "/note/" + email;
		console.log(url_path);
		const options = {
			hostname: "localhost",
			port: 8080,
			path: url_path,
			method: "GET",
		};

		const request = http.request(options, response => {
			let responseData = "";

			response.on("data", chunk => {
				responseData += chunk;
			})

			response.on("end", () => {
				const data = JSON.parse(responseData);
				res.render("noteview", {data});
			})
		});	

		request.on("error", error => {
			console.error("error fetching data from REST API:", error);
			res.status(500).json({message: "A server error has occured"});
		});

		request.end();
	} catch (error) {
		res.send("<h1>No account<h1>");
	}
});

app.post("/register", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	Logger.register(req, res, email, password);
});

app.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const token = jwt.sign({email}, process.env.token_secret, {expiresIn: "15m"});
	console.log(token);
	res.status(201).json(token);
	//Logger.login(req, res, email, password);
});

app.get("/auth", async (req, res) => {
	try {
		res.redirect(utils.request_get_auth_code_url);
	} catch (error) {
		res.sendStatus(500);
		console.log(error.message);
	}
});

app.get(process.env.REDIRECT_URI, async (req, res) => {
	const authorisation_token = req.query;
//	console.log({auth_server_response: authorisation_token});
	try {
		const response = await utils.get_access_token(authorisation_token.code);
//		console.log({data: response.data});
		const {access_token} = response.data;
		const user = await utils.get_profile_data(access_token);
		const user_data = user.data;
		req.flash("user_data", user_data);
		res.redirect("/");
		/*res.send(`
		  <h1> welcome ${user_data.name}</h1>
		  <img src="${user_data.picture}" alt="user_image" />
		`)*/
	} catch (error) {
		console.log("redirect error:", error.message);
		res.sendStatus(500);
	}
});

app.listen(port, () => {
	console.log("Server is listening on port", port);
});
