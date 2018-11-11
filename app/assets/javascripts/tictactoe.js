// Code your JavaScript / jQuery solution here

// button#save
// button#previous
// button#clear

var turn = 0;
let winner;
let possibles = [];

const wins = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

function player() {
  return turn % 2 === 0 ? "X" : "O";
}


function updateState(space) {
  $(space).text(player())
}


function setMessage(winner) {
  $("#message").text(`Player ${winner} Won!`)
}

// function winChecker(board) {
//
//   for (const el of wins) {
//       possibles.unshift([board[el[0]],board[el[1]],board[el[2]]]);
//   }
//
//   for (const el of possibles) {
//       if(el[0] == "X" && el[1] == "X" && el[2] == "X") {
//   		winner = "X"
//   	} else if(el[0] == "O" && el[1] == "O" && el[2] == "O") {
//           winner = "O"
//       } else {
//   		winner = false
//   	};
//   }
//
//   possibles = []
//
//   return winner
//
// }


function checkWinner() {
  // if() {
  //   setMessage(winner);
  //   return true
  // }; else {
  //   return false
  // };

  // 	for (const element of myArray) {
	//     console.log(element);
	// }
}


function doTurn() {
  ++turn;
  updateState();
  // need to pass in clicked element above
  checkWinner();
}


function attachListeners() {

}
