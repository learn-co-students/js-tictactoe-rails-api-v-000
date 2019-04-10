// Code your JavaScript / jQuery solution here

$(document).ready(function () {
	let game = new Game(-1);
	const games = [];	


	$("td").click(function() {
		game.doTurn(this);
	});

	$("button#clear").click(function(e) {
		e.preventDefault();
		const id = game.id;
		game = new Game(id);
		game.resetBoard();
	});	

	$("button#save").click(function(e) {
		e.preventDefault();
		game.updateDB();
	});

	$("button#previous").click(function(e) {
		e.preventDefault();
		game.previousGames();
	});

	$("button.previous-game").click(function(e) {
		e.preventDefault();
		game.loadPrevious(1);
	});
});

class Game {  
  constructor (id, boardArr = []) {
		this.boardArr = boardArr;
		this.id = id;
		this.turn = 0;
		this.winner = false;
  }
	
	loadPreviousGame(id) {
		alert(id);		

	}

	previousGames() {
		$.ajax({
			type: 'GET',
			url: "http://localhost:3000/games.json",
			processData: true,
			contentType: 'application/json',
			}).done(( data ) => {
				const htmlStr = data["data"].map((item) => { return this.createPreviousButton(item["id"]); }).join("");		
				$("div#games")[0].innerHTML = htmlStr;		
				});
	}

	updateDB() {
		const board = this.getBoard();
		const boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (let i = 0; i < board.length; i++) {
			const square = board[i];

			const x = parseInt(square.dataset["x"]);
			const y = parseInt(square.dataset["y"]);

			const txt = square.innerText;
			
			if (txt === "X") {
				boardArray[x + 3 * y] = 1;
			} else if (txt === "O") {
				boardArray[x + 3 * y] = -1;
			}
		}
		
		let jVar;
		const putUri = "http://localhost:3000/games/".concat((this.id), ".json");
		
		if (this.id < 0) {
			jVar = {state: boardArray};
		} else {
			jVar = {id: this.id, state: boardArray};
		}

		if (this.id < 0) {
			$.ajax({
				type: 'POST',
				url: "http://localhost:3000/games.json",
				data: JSON.stringify(jVar),
				processData: true,
				contentType: 'application/json',
				}).done(( data ) => {
					this.id = parseInt(data["data"]["id"]);
				});
		} else {
			$.ajax({
				type: 'POST',
				url: putUri,
				data: JSON.stringify(jVar),
				headers: {"X-HTTP-Method-Override": "PUT"},
				processData: true,
				contentType: 'application/json',
			});
		}
	}

	resetBoard() {
		this.boardArr = [];
		const board = this.getBoard();

		for (let i = 0; i < board.length; i++) {
			board[i].innerText = "";
		}

		this.setMessage("");
	}

	doTurn(square) {
		if (this.winner) {
			return true;
		}

		this.updateState(square);
		this.turn++;
		this.winner = this.checkWinner();
		return this.winner;
	}

	checkWinner() {
		const transformArray = this.transformBoard();

		const winningSumm = this.lookForWinners(transformArray);

		let rtn = false;
		let msg = "";
		if (winningSumm === 3) {
			msg = "Player X Won!";
			rtn = true;
		} else if (winningSumm === -3) {
			msg = "Player O Won!";
			rtn = true;
		}
		
		this.setMessage(msg);
		return rtn;
	}


	setMessage(message) {
		$("div#message")[0].innerHTML = message;
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

// ================================================
// Functions I'd like to be Private Below
// ================================================

	getBoard() { 
		return $("td"); 
	}

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
		tuples.push([boardTransform[0][0], boardTransform[1][0], boardTransform[2][0]]);
		tuples.push([boardTransform[0][1], boardTransform[1][1], boardTransform[2][1]]);
		tuples.push([boardTransform[0][2], boardTransform[1][2], boardTransform[2][2]]);
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

	createPreviousButton(id) {
		return `<p><button data-id="${id}" class"previous-game">Previous Game - ID: ${id}</button></p>`;
	}
}

