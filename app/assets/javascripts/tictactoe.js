// Code your JavaScript / jQuery solution here
$(document).ready(function () {
	let game = new Game(-1);

	$("td").click(function() {
		game.updateState(this);
	});	
});

function OnClick(){}

class Game {  
  constructor (id, boardArr = []) {
    this.boardArr = boardArr;
		this.id = id;
  }
	
	checkWinner() {
		const transformArray = this.transformBoard();

		const winningSumm = this.lookForWinners(transformArray);

		let msg = "";
		if (winningSumm === 3) {
			msg = "Player X Won!";
		} else if (winningSumm === -3) {
			msg = "Player O Won!";
		}
		
		this.setMessage(msg);
		return msg;
	}


	setMessage(message) {
		$("div#message").innerHTML = message;
	}
	
	updateState(square) {
		square.innerText = this.player();
	}

	player() { 
		let count = 0;
		let board = this.getBoard();
		
		for (let i = 0; i < board.length; i++) {
			if (board[i].innerText !== "") {
				count++;
			}
		}
		return count % 2 === 0 ? "X" : "O";
	}

private

	getBoard() { return $("td"); }

	transformBoard() {
		let baseArray = [[0, 0, 0],[0, 0, 0],[0, 0, 0]];
		let board = this.getBoard();
		
		for (let i = 0; i < board.length; i++) {
			const square = board[i];

			const x = parseInt(square.dataset["x"]);
			const y = parseInt(square.dataset["y"]);

			let baseValue = 0;
			if (square.innerText === "X") { 
				baseValue = 1 
			} else if (square.innerText === "O") { 
				baseValue = -1
			}

			baseArray[y][x] = baseValue;
		}
		return baseArray;	
	}

	lookForWinners(boardTransform) {
		const tuples = [];
		tuples.push(boardTransform[0]);
		tuples.push(boardTransform[1]);
		tuples.push(boardTransform[2]);
		tuples.push([boardTransform[0][0], boardTransform[0][1], boardTransform[0][2]]);
		tuples.push([boardTransform[1][0], boardTransform[1][1], boardTransform[1][2]]);
		tuples.push([boardTransform[2][0], boardTransform[2][1], boardTransform[2][2]]);
		tuples.push([boardTransform[0][0], boardTransform[1][1], boardTransform[2][2]]);
		tuples.push([boardTransform[0][2], boardTransform[1][1], boardTransform[2][0]]);

		for (let i = 0; i < tuples.length; i++) {
			const examRtn = this.examineOneTuple(tuples[i]); 
			if (examRtn !== 0) {
				return examRtn;
			}
		}
		return 0;
	}

	examineOneTuple(tuple) {
		const summ = tuple.reduce(function (total, item) { return total + item;  }, 0);
		if (summ === 3 || summ === -3) {
			return summ;
		}
		return 0;
	}

}

