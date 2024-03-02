function addNote() {
	if (typeof token !== "undefined") {
		let data = {};
		data.author = document.getElementById("author-insert").value;
		data.text =  document.getElementById("text-insert").value;
		const json = JSON.stringify(data);

		const xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:8080/note/");
		xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
		xhr.setRequestHeader("Authorization", "Bearer " + token);
		xhr.responseType = "json";
		xhr.onload = () => {
			if (xhr.readyState == 4 && xhr.status == 201) {
				console.log(xhr.response);
				location.reload();
			} else {
				console.log("error:" + xhr.status);
			}
		}
		xhr.send(json);
	}
}

function removeNote(elem) {
	if (typeof token !== "undefined") {
		const xhr = new XMLHttpRequest();
		const note = elem.parentElement;
		xhr.open("DELETE", "http://localhost:8080/note/" + note.id);
		xhr.setRequestHeader("Authorization", "Bearer " + token);
		xhr.responseType = "json";
		xhr.onload = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				console.log(xhr.response);
				note.remove();
			} else {
				console.log("error:" + xhr.status);
			}
		}
		xhr.send();
	}
}

function editNote(elem) {
	if (typeof token !== "undefined") {
		console.log("edit");
		const note = elem.parentElement;

		let data = {};
		data.author = document.getElementById("author" + note.id).value;
		data.text =  document.getElementById("text" + note.id).value;
		const json = JSON.stringify(data);

		const xhr = new XMLHttpRequest();
		xhr.open("PUT", "http://localhost:8080/note/" + note.id);
		xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
		xhr.setRequestHeader("Authorization", "Bearer " + token);
		xhr.onload = () => {
			if (xhr.readyState == 4 && xhr.status == "200") {
				console.log(xhr.response);
			} else {
				console.log("error:" + xhr.status);
			}
		}
		xhr.send(json);
	}
}

function login() {
	console.log("log in");

	let data = {};
	data.email = document.getElementById("email-login").value;
	data.password = document.getElementById("password-login").value;
	const json = JSON.stringify(data);
	console.log(data);

	const xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8080/login");
	xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
	xhr.onload = () => {
		if (xhr.readyState == 4 && xhr.status == "201") {
			token = xhr.response;
			token = token.substring(1, token.length - 1);
			console.log(token);
		} else {
			console.log("error:" + xhr.status);
		}
	}
	xhr.send(json);
}

function register() {
	console.log("register");

	let data = {};
	data.email = document.getElementById("email-register").value;
	data.password = document.getElementById("password-register").value;
	const json = JSON.stringify(data);

	const xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8080/register");
	xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
	xhr.onload = () => {
		if (xhr.readyState == 4 && xhr.status == "201") {
			token = xhr.response;
			token = token.substring(1, token.length - 1);
			console.log(token);
		} else {
			console.log("error:" + xhr.status);
		}
	}
	xhr.send(json);
}
