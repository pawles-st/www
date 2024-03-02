function show_bar() {
	const navlist = document.getElementById("navlist");
	if (navlist.className === "navigation") {
		navlist.className = "navigation shown";
	} else {
		navlist.className = "navigation";
	}
}  

document.getElementById("menu-button").onclick = show_bar;
