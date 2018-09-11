// Code your JavaScript / jQuery solution here
var turn = 0; //used to keep track of which player's turn it is. Even = X odd = O
var board = ["","","","","","","","",""]; // keeps track of where each player has gone


function player(){      //determines which player's turn it is
  var t = "O";
  if (turn % 2 === 0){
    t = "X"
  };
  return t;
}

function attachListeners(){
  $('td').click(function(){

    doTurn(this)
  });

}

function doTurn(t){

  updateState(t)

  checkWinner()
  turn = turn + 1;
}

function updateState(v){
  var xo = player()
  if ($(v).text() === ""){
    $(v).text(xo)
  }
  if (v.dataset.y === "0"){
    switch (v.dataset.x){
      case '0':
      board[0] = xo;
      break;
      case '1':
      board[1] = xo;
      break;
      case '2':
      board[2] = xo;
    }
  }
  if (v.dataset.y === "1"){
    switch (v.dataset.x){
      case '0':
      board[3] = xo;
      break;
      case '1':
      board[4] = xo;
      break;
      case '2':
      board[5] = xo;
    }
  }
  if (v.dataset.y === "2"){
    switch (v.dataset.x){
      case '0':
      board[6] = xo;
      break;
      case '1':
      board[7] = xo;
      break;
      case '2':
      board[8] = xo;
    }
  }
}


function checkWinner(){
  const winning = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]]
  var bool = false;
  winning.forEach(element => {
    if ((board[element[0]] === "X" && board[element[1]] === "X" && board[element[2]] === "X") || (board[element[0]] === "O" && board[element[1]] === "O" && board[element[2]] === "O")){

      bool = true;
      var message = "Player " + board[element[0]] + " Won!"
      setMessage(message)

    }
  })
  return bool;
}

function setMessage(winner){

      document.getElementById("message").innerHTML = winner
}

$(document).ready(function() {
  attachListeners()
});
