const http = require("http");
const url = require("url");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});

const express = require("express");
const app = express();
const port = 8080;

const Note = require("./models/notes.js");
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://localhost:27017/notes_db")
	.then(() => {
		console.log("connected to the database");
	}).catch(err => {
		console.log("database connection error:", err);
	});

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

const noteList = [
	{
		id: 1,
		author: "me",
		text: "I like ice cream",
	},
	{
		id: 2,
		author: "also me",
		text: "I like ..."
	},
];

app.get("/note", (req, res) => {
	console.log("GET request for ALL notes");
//	res.render("noteview", {noteList});
	Note.find()
		.then(noteList => {
			res.render("noteview", {noteList})
//			res.end(JSON.stringify(noteList));
		}).catch(err => {
			console.log("note reading error:", err);
		})
//	res.end(JSON.stringify(notes));
})

app.get("/note/:id", (req, res) => {
	console.log("GET request for", req.params.id, "note");
	Note.findOne({"_id": req.params.id}, (err, result) => {
		if (err) {throw err;}
		res.end(JSON.stringify(result));
	})
})

app.post("/note", urlencodedParser, (req, res) => {
	console.log("POST request");
	Note.insertOne(req.body.note, (err, result) => {
		if (err) {throw err;}
		res.redirect("/note");
	})
})

app.put("/note/:id", urlencodedParser, (req, res) => {
	console.log("PUT request for", req.body.id, "note");
	Note.updateOne({"_id": req.params.id}, {author: req.body.author, text: req.body.text}, (err, result) => {
		if (err) {throw err;}
		res.redirect("/note");
	})
})

app.delete("/note/:id", (req, res) => {
	console.log("DELETE request for", req.params.id, "note");
	Note.deleteOne({"_id": req.params.id}, (err, obj) => {
		if (err) {throw err;}
		res.redirect("/note");
	})
})

app.listen(port, () => {
	console.log("Server is listening on port", port);
})
