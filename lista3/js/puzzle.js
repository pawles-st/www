const IMG_INPUT = document.getElementById("puzzle-image");

let _puzzleSize;
let _img;
let _canvas;

let _puzzleWidth;
let _puzzleHeight;
let _pieceWidth;
let _pieceHeight;

let _pieces;
let _empty;

let _mouse;

// reload state

function resume() {
	console.log(localStorage.getItem("pieces"));
	_pieces = JSON.parse(localStorage.getItem("pieces"));
	_empty = JSON.parse(localStorage.getItem("empty"));
	_img = new Image();
	_img.addEventListener("load", reloadState);
	_img.src = JSON.parse(localStorage.getItem("src"));
}

function reloadState() {
	_puzzleWidth = _img.width;
	_puzzleHeight = _img.height;
	_canvas = document.getElementById("canvas");
	_stage = _canvas.getContext("2d");
	_canvas.width = _puzzleWidth;
	_canvas.height = _puzzleHeight;
	_canvas.style.border = "1px solid white";
	puzzleInit();
	_mouse = {x: 0, y: 0};
	_canvas.addEventListener("click", onTileClick);
	document.addEventListener("mousemove", onMouseMove);
	_canvas.addEventListener("mouseout", onMouseOut);
	_stage.fillStyle = "#1188CC";
	_stage.fillRect(_empty.x, _empty.y, _pieceWidth, _pieceHeight);
	_stage.fillStyle = "#009900";
	for (i = 0; i < _pieces.length; i++) {
		piece = _pieces[i];
		console.log(piece);
		console.log(_img);
		_stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
		console.log("drawn");
	}
}

resume();

// display the chosen image

function puzzleDisplay() {
	loadImage();
}

// load the selected image into _img variable

function loadImage() {
	//const selectedFile = IMG_INPUT.files[0];
	_img = new Image();
	_img.addEventListener("load", setCanvas);
	_img.src = document.getElementById("puzzle-image").value //"images/red-black-tree.jpg";
	localStorage.setItem("src", JSON.stringify(_img.src));
	//_img.src = selectedFile.name;
}

// setup the canvas for the current image

function setCanvas() {

	// init canvas with _img

	_puzzleWidth = _img.width;
	_puzzleHeight = _img.height;
	_canvas = document.getElementById("canvas");
	_stage = _canvas.getContext("2d");
	_canvas.width = _puzzleWidth;
	_canvas.height = _puzzleHeight;
	_canvas.style.border = "1px solid white";

	// show the image on the canvas

	_stage.drawImage(_img, 0, 0);
}

// begin the puzzle game

function puzzleBegin() {
	puzzleInit();
	buildPieces();
	shufflePieces();
}

// initialise the puzzle

function puzzleInit() {
	if (_img !== undefined) {
		_puzzleSize = document.getElementById("puzzle-size").value;
		_pieceWidth = Math.floor(_puzzleWidth / _puzzleSize);
		_pieceHeight = Math.floor(_puzzleHeight / _puzzleSize);
		_puzzleWidth = _pieceWidth * _puzzleSize;
		_puzzleHeight = _pieceHeight * _puzzleSize;
		_canvas.width = _puzzleWidth;
		_canvas.height = _puzzleHeight;
	} else {
		console.log("no image");
	}
}

// create the array of pieces

function buildPieces() {
	let i;
	let piece;
	let xPos = _pieceWidth;
	let yPos = 0;

	// split image into pieces

	_pieces = [];
	for (i = 1; i < _puzzleSize * _puzzleSize; i++) {
		piece = {};
		piece.sx = xPos;
		piece.sy = yPos;
		_pieces.push(piece);
		xPos += _pieceWidth;
		if (xPos >= _puzzleWidth) {
			xPos = 0;
			yPos += _pieceHeight;
		}
	}
}

// shuffle and draw the pieces

function shufflePieces() {

	// shuffle array of pieces

	_pieces = shuffleArray(_pieces);

	_stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
	let i;
	let piece;
	let xPos = _pieceWidth;
	let yPos = 0;

	// draw the pieces
	
	_stage.fillStyle = "#1188CC";
	_stage.fillRect(0, 0, _pieceWidth, _pieceHeight);
	for (i = 0; i < _pieces.length; i++) {
		piece = _pieces[i];
		piece.xPos = xPos;
		piece.yPos = yPos;
		_stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
		//_stage.strokeRect();
		xPos += _pieceWidth;
		if (xPos >= _puzzleWidth) {
			xPos = 0;
			yPos += _pieceHeight;
		}
	}
	_mouse = {x: 0, y: 0};
	_empty = {x: 0, y: 0};
	_canvas.addEventListener("click", onTileClick);
	_canvas.addEventListener("mousemove", onMouseMove);
	_canvas.addEventListener("mouseout", onMouseOut);
}

function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}
/*
function shuffleArray(arr) {
	let i = arr;

	for (let )
}
*/

// move piece on click

function onTileClick(event) {
	_currentPiece = findPiece(event);
	if (_currentPiece != null && checkMoveable()) {

		// swap positions

		let newEmpty = {xPos: _currentPiece.xPos, yPos: _currentPiece.yPos};
		_currentPiece.xPos = _empty.x;
		_currentPiece.yPos = _empty.y;
		_empty.x = newEmpty.xPos;
		_empty.y = newEmpty.yPos;

		// clear tiles

		_stage.clearRect(_currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
		_stage.clearRect(_empty.x, _empty.y, _pieceWidth, _pieceHeight);

		// draw the tiles

		_stage.fillRect(_empty.x, _empty.y, _pieceWidth, _pieceHeight);
		_stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
	}
	console.log(_mouse.x, _mouse.y);
	localStorage.setItem("pieces", JSON.stringify(_pieces));
	localStorage.setItem("empty", JSON.stringify(_empty));
}

// find the piece that was clicked

function findPiece(event) {
	if (event.layerX || event.layerX == 0) {
		_mouse.x = event.layerX - _canvas.offsetLeft;
		_mouse.y = event.layerY - _canvas.offsetTop;
	} else if (event.offsetX || event.offsetX == 0) {
		_mouse.x = event.offsetX - _canvas.offsetLeft;
		_mouse.y = event.offsetY - _canvas.offsetTop;
	}
	let i;
	let piece;
	for (i = 0; i < _pieces.length; i++) {
		piece = _pieces[i];
		if (_mouse.x < piece.xPos || _mouse.x > piece.xPos + _pieceWidth || _mouse.y < piece.yPos || _mouse.y > piece.yPos + _pieceHeight) {
			// piece not hit
		} else {
			return piece;
		}
	}
	return null;
}

// check if current piece is next to the emtpy tile

function onMouseMove(event) {
	for (i = 0; i < _pieces.length; i++) {
		piece = _pieces[i];
		_stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
	}
	_currentPiece = findPiece(event);
	if(_currentPiece != null && checkMoveable()) {
		console.log("can move");
		_stage.clearRect(_currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
		_stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
		_stage.globalAlpha = 0.4;
		_stage.fillStyle = "#009900";
		_stage.fillRect(_currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
//		_stage.restore();
		_stage.globalAlpha = 1;
		_stage.fillStyle = "#1188CC";
	}
}

function onMouseOut(event) {
	_currentPiece = findPiece(event);
	if(_currentPiece != null && checkMoveable()) {
		_stage.clearRect(_currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
		_stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
	}
}

function checkMoveable() {
	if ((Math.abs(_currentPiece.xPos - _empty.x) == _pieceWidth && _currentPiece.yPos - _empty.y == 0) || (_currentPiece.xPos - _empty.x == 0 && Math.abs(_currentPiece.yPos - _empty.y) == _pieceHeight)) {
		return true;
	} else {
		return false;
	}
}
