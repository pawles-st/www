/*function reload_images() {
	const images = document.getElementsByTagName("img");
	console.log(images);
	Array.from(images).forEach(element => {
		console.log(element.getAttribute("lazysrc"));
		element.src = element.getAttribute("lazysrc");
	});
}

console.log("loading");
reload_images();*/

function load(img) {
	let loading = new Promise((resolve, reject) => {
		img.setAttribute("src", img.getAttribute("lazysrc"));
		img.onload = () => {resolve(img);};
		img.onerror = () => {reject(img);};
	})
	return loading;
}

Promise.all([
	load(document.getElementById("img1")),
	load(document.getElementById("img2")),
	load(document.getElementById("img3")),
	load(document.getElementById("img4")),
	load(document.getElementById("img5")),
	load(document.getElementById("img6")),
	load(document.getElementById("img7")),
]).then(() => {
	console.log("loading successful");
}).catch(() => {
	console.log("error while loading");
});

console.log("loading images");
