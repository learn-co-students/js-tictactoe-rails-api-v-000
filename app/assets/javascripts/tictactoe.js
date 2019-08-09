var turn = 0;
var gameId = 0;
var winning =  [
                [0,1,2], [3,4,5], [6,7,8],
                [0,3,6], [1,4,7], [2,5,8],
                [0,4,8], [2,4,6]
              ];

var player = () => turn % 2 ? "O" : "X";

var updateState = (square) => square.innerHTML = player();

var setMessage = (string) => $("#message").text(string);

var spaceTaken = (space) => space === "X" || space === "O" ? true : false;


var currentBoardArray = () => {
  let currentBoard = [];
  for(let i = 0; i < 9; i++){
    let square = $("td")[i].innerHTML
    currentBoard.push(square)
  }
  return currentBoard;
}

var checkWinner = () => {
  let board = currentBoardArray()
  let won = false
    winning.forEach(combo => {
      if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] ){
        won = true


        setMessage(`Player ${board[combo[0]]} Won!`)
       }
     })
   return won
  };

var doTurn = (clickedSquare) =>{
  updateState(clickedSquare);
  turn++;

  let win = checkWinner();

  if(win === true){
    saveOrCreate();
    clearBoard();
  }else if (boardFull() === true && win === false){
    setMessage("Tie game.")
    saveOrCreate();
    clearBoard();
   }
}



function saveGame(){
  $.ajax ({
    url: `/games/${gameId}`,
    type: 'PATCH',
    data: {
      state: currentBoardArray()

    }
  })

}

function saveOrCreate(){
  if(gameId === 0){
    newGame();
  }else{
    saveGame();
  }
}

function newGame(){
  let newGame = $.post('/games', {state: currentBoardArray()})
  newGame.done(function(data){
    gameId = data["data"]["id"]
  })
}

function clearBoard(){
  $("td").text("");
  turn = 0;
  gameId = 0;
}

function boardFull(){
  let full = true
  board = currentBoardArray()
  board.forEach( square => {
    if(square === ""){
    full = false
    }
  })
  return full;
}

function attachListeners() {
  $('td').on('click', function() {
    if (this.innerHTML === "" && !checkWinner()) {
      doTurn(this);
    }
  })

  $('#save').on('click', function (){
     saveOrCreate()
  })

  $('#previous').on('click', function (){
    $.get('/games', function(response){
      $("#games").text("")
      response["data"].forEach(function(item){
        $("#games").append(`<button id="game-${item["id"]}" onclick="getGame(${item["id"]})">Game # ${item["id"]}</button>`)
      })
    })

  })

  $('#clear').on('click', function (){
    clearBoard();
  })

}

function getGame(id){
  $.get('/games/' + id, function(response){
    populateBoard(response["data"]["attributes"]["state"])
    gameId = response["data"]["id"]
    //turn = getGameTurn()
  })
}

function populateBoard(arr){
  for(let i = 0; i < arr.length; i++){
    $("td")[i].innerHTML = arr[i]
  }
    turn = getGameTurn()
}

function getGameTurn(){
  count = 0;
  currentBoardArray().forEach(item =>{
    if(spaceTaken(item) === true){
      count++
    }
  })
  return count
}




$(function() {
  attachListeners()
});
