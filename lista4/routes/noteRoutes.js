const express = require("express");
const router = express.Router();
const Note = require("../models/notes.js");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const authMiddleware = (req, res, next) => {
//	const token_secret = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";
	const token = req.headers["authorization"]?.split(" ")[1];
	console.log(token);

	if (!token) {
		return res.status(401).send("token needed");
	}

	jwt.verify(token, process.env.token_secret, (err, data) => {
		if (err) {
			return res.status(403).send("invalid token");
		}

		req.user = data;
		next();
	})
}

router.get("/", (req, res) => {
	console.log("router GET request for ALL notes");
	Note.find()
		.then(noteList => {
			console.log(noteList);
			res.status(200);
			res.json(noteList);
		})
		.catch(err => {
			res.status(500);
			res.json({message: "database fetch error"});
			console.error("database fetch error:", err);
		});
});

router.get("/:id", (req, res) => {
	console.log("router GET request for", req.params.id, "note");
	Note.findOne({_id: req.params.id})
		.then(note => {
			console.log(note);
			res.status(200);
			res.json(note)
		})
		.catch(err => {
			res.status(500);
			res.json({message: "database fetch error"});
			console.error("database fetch error:", err);
		});
});

router.post("/", authMiddleware, (req, res) => {
	let newNote = new Note(req.body);
	console.log("router POST request with", newNote);
	if (typeof newNote.author == undefined || typeof newNote.text == undefined){
		res.status(400);
		res.json({message: "invalid request"});
	} else {
		newNote.save()
			.then(noteItem => {
				console.log(noteItem);
				res.status(201);
				res.json(noteItem);
			}).catch(err => {
				res.status(500);
				res.json({message: "database write error"});
				console.error("database write error:", error);
			})
	}
});

router.put("/:id", authMiddleware, (req, res) => {
	console.log("router PUT request for", req.params.id, "note");
	Note.findByIdAndUpdate({_id: req.params.id}, req.body)
		.then(() => {
			console.log("updated id", req.params.id);
			res.status(200);
			res.json({message: "update succesful"});
		}).catch(err => {
			res.status(500);
			res.json({message: "database update error"});
			console.error("database update error:", error);
		})
});

router.delete("/:id", authMiddleware, (req, res) => {
	console.log("router DELETE request for", req.params.id, "note");
	Note.findByIdAndRemove({_id: req.params.id})
		.then(() => {
			console.log("deleted id", req.params.id);
			res.status(200);
			res.json({message: "delete succesful"});
		}).catch(err => {
			res.status(500);
			res.json({message: "database delete error"});
			console.error("database delete error:", error);
		})
});

module.exports = router;
