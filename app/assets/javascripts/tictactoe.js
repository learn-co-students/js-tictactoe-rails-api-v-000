var turn = 0;
var winningCombos = [
										//columns
                    [0,3,6],[1,4,7],[2,5,6],
                    //rows
                    [0,1,2],[3,4,5],[6,7,8],
                    //diagonal
                    [0,4,8],[2,4,6]
                  ];

function attachListeners(){
  $('body').on('click', 'td', function(e){
    doTurn(e);
  });
};

function doTurn(e){
  updateState(e);
  if (checkWinner()){
    console.log(checkWinner());
    resetBoard();
  };
  turn++;
}

function resetBoard(){
  $('td').each(function(){
    $(this).text();
  });
}

function setTurn(){
  var board = getBoard();
  var turnCount = 0;
  for(var i = 0; i < 9; i++){
    var addTurn = board[i] == "" ? 0 : 1;
    turnCount += addTurn;
  };
  turn = turnCount;
}

function checkWinner(){
  board = getBoard();
  console.log(board);
  for(var i = 0; i < 8; i++){
    var cellToCheck = [];
  	for(var j = 0; j < 3; j++){
      cellToCheck.push(board[winningCombos[i][j]]);
  	}

  	if (cellToCheck.join().includes("X,X,X")){
  	  message("Player X Won!");
      return true;
  	} else if (cellToCheck.join().includes("O,O,O")){
  	  message("Player O Won!");
      return true;
  	}
  }
  return false;
}

function player(){
  var token = turn % 2 == 0 ? 'X' : 'O';
  return token;
}

function message(m){
  $("#message").text(m);
}

function getBoard(){
  var board = [];
  $('td').each(function(index){
  	board.push($(this).text());
  });

  return board;
}

function updateState(e){
  $(e.target).text(player());
}

function showBoard(board){
  $('td').each(function(index){
    $(this).text(board[index]);
  });
}
