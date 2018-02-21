 $(document).ready(attachListeners)


 function attachListeners(){
 	
 	$("td").click(function(){
 	 		if(this.innerHTML === ""){
 	 		doTurn(this)
 		}else{
  alert("can't go there");	
		};
 	});

 	$("#save").click(function(){
 		saveGame()
 	});

 	$("#clear").click(function(){
 		saveGame();
	 	turn = 0;
	 	board = {}
	 	$("td").html("")
 	});

 	$("#previous").click(function(){
 		for(const key in store){
 			$('div#games').append(store[key])
 			console.log(store[key])
 		};
 	});
};

var turn = 0;
var gameId = 0
var store = {games: []}


function saveGame(){
 	if (this.gameId===0){
    this.id = ++gameId
    this.board = $('td')
 		
    store.games.push(this.id, this.board)
    
  } else {this.board = $('td')}
}

function player(){
	return (turn % 2 === 0 ? "X" : "O");
};

function doTurn(args){
	turn++;
	 updateState(args)
	 
	 if (checkWinner()){
	 	saveGame();
	 	turn = 0;
	 	board = {}
	 	$("td").html("")
	 }

	 else if (turn === 9){
	 	setMessage("Tie game.")
	 	saveGame();
	 };
};

function updateState(args){
	let selectedSquare = args
	selectedSquare.append(player())
	
};

function setMessage(message){
	alert(message)
	 $('#message').append(innerHTML = message)
};


function checkWinner(){
	let board = {}
	let winner = false
	$('td').text((index, square) => board[index] = square);
	
	if (board[0] ==="X" && board[1] ==="X" & board[2] ==="X"){setMessage("Player X Won!");;  return winner = true}
	else if (board[3] ==="X" && board[4] ==="X" & board[5] ==="X"){setMessage("Player X Won!");return winner = true}
	else if (board[6] ==="X" && board[7] ==="X" & board[8] ==="X"){setMessage("Player X Won!");return winner = true}
	else if (board[0] ==="X" && board[3] ==="X" & board[6] ==="X"){setMessage("Player X Won!");return winner = true}
	else if (board[1] ==="X" && board[4] ==="X" & board[7] ==="X"){setMessage("Player X Won!");return winner = true}
	else if (board[2] ==="X" && board[5] ==="X" & board[8] ==="X"){setMessage("Player X Won!");return winner = true}
	else if (board[0] ==="X" && board[4] ==="X" & board[8] ==="X"){setMessage("Player X Won!");return winner = true}
	else if (board[6] ==="X" && board[4] ==="X" & board[2] ==="X"){setMessage("Player X Won!");return winner = true}

	else if (board[0] ==="O" && board[1] ==="O" & board[2] ==="O"){setMessage("Player O Won!");return winner = true}
	else if (board[3] ==="O" && board[4] ==="O" & board[5] ==="O"){setMessage("Player O Won!");return winner = true}
	else if (board[6] ==="O" && board[7] ==="O" & board[8] ==="O"){setMessage("Player O Won!");return winner = true}
	else if (board[0] ==="O" && board[3] ==="O" & board[6] ==="O"){setMessage("Player O Won!");return winner = true}
	else if (board[1] ==="O" && board[4] ==="O" & board[7] ==="O"){setMessage("Player O Won!");return winner = true}
	else if (board[2] ==="O" && board[5] ==="O" & board[8] ==="O"){setMessage("Player O Won!");return winner = true}
	else if (board[0] ==="O" && board[4] ==="O" & board[8] ==="O"){setMessage("Player O Won!");return winner = true}
	else if (board[6] ==="O" && board[4] ==="O" & board[2] ==="O"){setMessage("Player O Won!"); return winner = true}
	else {return winner=false}
};




//------------------------------------------------

//const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
//                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];


//this looks better but only works with combo 0,1,2

// function checkWinner(){
// 	let board = {}
// 	let winner = false
// 	$('td').text((index, square) => board[index] = square);

// 	for (const element of WINNING_COMBOS) {
		

// 		if(board[element[0]]==="X" && board[element[1]] === "X" & board[element[2]]==="X"){
//   			return winner = true && setMessage("Player X Won!")
//   		} else if (board[element[0]]==="O" && board[element[1]] === "O" & board[element[2]]==="O"){
//   			return winner = true && setMessage("Player O Won!")
//   		} else{
//   			return winner = false
//   		};
// 		};
// 	};