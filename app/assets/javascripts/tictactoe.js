// Code your JavaScript / jQuery solution here
var winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

// let emptyBoard = ["","","","","","","","",""];
// the turn variable should be decided based on the state of the game?
var turn = 0

function player() {
  return (turn % 2 === 0) ? "X" : "O"
}

function updateState(cell) {
  $(cell).text(player())
}

function doTurn(cell) {
  if(cell.textContent === ""){
    updateState(cell);
    turn++;
    if(checkWinner()){
      // reset the board and set turn counter to 0
      resetBoard();
      turn = 0;
    } else if(checkTie()) {
      setMessage("Tie game.")
      resetBoard();
      turn = 0;
    };
  }
}

function attachListeners(){
  // add event listener to each button
  $('#save').on('click', function(e){
    e.preventDefault();
    saveGame();
  });

  $('#previous').on('click', function(e){
    e.preventDefault();
    showPrevious();
  });

  $('#clear').on('click', function(e){
    e.preventDefault();
    newGame();
  });
  // add an event listener to all cells
  var td = document.querySelectorAll("td")
  for(let i = 0; i < td.length; i++) {
    td[i].addEventListener("click", function(e){
      e.preventDefault();
      var cell = this
      doTurn(cell);
    })
    // how can i ensure that inside doTurn() that the "this" value is kept?
    // think i need to bind the call here?
  };
}
// how do i collect all the values from the board => textContent!

function getBoard() {
  let nodes = document.querySelectorAll('td');
  let board = [];
  for(let i = 0; i < nodes.length; i++){
    board.push(nodes[i].textContent);
  };
  return board;
}

function resetBoard() {
  $('td').text("")
}

function checkWinner() {
  // get the board => getBoard()
  // then run the board against the winning combos
  let board = getBoard();
  var result = false;
  // check if the board would even have a winner yet
  if(board.filter(cell => cell === "X" || cell === "O").length < 4){
    return result;
  } else {
    winningCombos.forEach(function(combo){
      // probably want to move this into another function
      if(board[combo[0]] === "X" && board[combo[1]] === "X" && board[combo[2]] === "X") {
        result = true;
        // invoke setMessage here so that you still return boolean
        setMessage("Player X Won!");
      } else if(board[combo[0]] === "O" && board[combo[1]] === "O" && board[combo[2]] === "O") {
        result = true;
        setMessage("Player O Won!");
      }
    });
    return result;
  }
}

function checkTie() {
  let board = getBoard();
  if(board.filter(cell => cell === "X" || cell === "O").length === 9) {
    return true
  };
}

function setMessage(message) {
  $('#message').text(message)
  // add the tie or winning mesage to the div#message element in DOM
}

function saveGame() {
  alert("you clicked save")
  // need to check if the game already exists, if it does then update
  // if game doesnt exist, create and save state
  // make call to API #update to save the state
}

function newGame() {
  alert("you clicked clear")
  // reset board to empty state
}

function showPrevious() {
  alert("you clicked show previous")
  // make call to index and render list of games
}

$(function(){
  attachListeners();
})
