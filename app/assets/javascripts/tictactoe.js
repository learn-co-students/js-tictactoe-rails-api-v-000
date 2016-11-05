// Board:
// 00 10 20
// 01 11 21
// 02 12 22

const winCombos = [
	[
		[0,0],
		[1,0],
		[2,0],
	],
	[
		[0,1],
		[1,1],
		[2,1],
	],
	[
		[0,2],
		[1,2],
		[2,2],
	],
	[
		[0,0],
		[0,1],
		[0,2],
	],
	[
		[1,0],
		[1,1],
		[1,2],
	],
	[
		[2,0],
		[2,1],
		[2,2],
	],
	[
		[0,0],
		[1,1],
		[2,2],
	],
	[
		[2,0],
		[1,1],
		[0,2],
	],
];

function attachListeners() {

};

function doTurn() {

};

function player() {

};

function updateState() {

};

function checkWinner(array) {
	for (let i = 0; i < array.length; i++) {
		let winCombo = array[i];
		let x = winCombo[0];
		let y = winCombo[1];
		let select = $('[data-x="' + x + '"][data-y="' + y + '"]')
		if (select === "X") {
			console.log('X' + i)
		} else if (select === "O") {
			console.log('O' + i)
		};
	};
	// If there is a winner:
	// const winner = "Player X Won!" or "Player O Won!"

	message(winner);
};

function message(string) {
	$('#message').text(string);
};