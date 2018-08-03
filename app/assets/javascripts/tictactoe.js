// Code your JavaScript / jQuery solution here

let player1 = "O"
let player2 = "X"
let turn = 0
function player(turn) {
	if (turn%2 === true) {
		return 'X';
	} else {
		return 'O';
}
}


function doTurn(player) {
		turn += 1
		updateState()
		checkWinner()
}

function setMessage(checkWinner) {
	if (checkWinner == true) {
	return "Player #{player} Won!"
}
}
function updateState() {
  const squares = window.document.querySelectorAll('td');
  square = player(turn);
var el = document.getElementById("games");
el.addEventListener("click", () => { updateState(squares); }, false);

}

function checkWinner() {
	const squares = window.document.querySelectorAll('tr')

if (squares[0]==squares[1] && squares[1]==squares[2] || squares[3]==squares[4] && squares[4]==squares[5] || squares[6]==squares[7] && squares[7]==squares[8]) {
return true;
turn = 0
resetFixtures()
	setMessage()
}
}