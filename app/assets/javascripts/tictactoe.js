// Code your JavaScript / jQuery solution here
var turn = 0
// var squares = document.querySelectorAll('td');

function player() {
  if(turn%2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  var current_player = player()
  square.innerHTML = current_player
}

function setMessage(string) {
  document.getElementById("message").append(string);
}

function cellValue(index) {
  var squares = document.querySelectorAll('td');
  return squares[index].innerHTML
}

function squareTaken(square) {
  if(cellValue(square).indexOf("X") > -1 || cellValue(square).indexOf("O") > -1) {
    return true
  } else {
    return false
  }
}

// TODO: Display Tie game when board full and game has not been won.
function fullBoard() {
  var squares = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  return squares.every(squareTaken)
}

function checkWinner() {
  var winnersArray = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ].some(function(combo) {
    if (cellValue(combo[0]) === cellValue(combo[1]) &&
        cellValue(combo[1]) === cellValue(combo[2]) &&
        squareTaken(combo[0])) {
      setMessage(`Player ${cellValue(combo[0])} Won!`);
      return true;
    } else {
      return false;
    }
  });
  
  return winnersArray;
}

function doTurn(square) {
  updateState(square);
  var gameWon = checkWinner();
  
  if(fullBoard() && !gameWon) {
    setMessage('Tie game.');
  } 
  
  turn++;
  
  if (gameWon) {
    turn = 0
    var squares = document.querySelectorAll('td');
    for(var i = 0; i < squares.length; i++) {
      squares[i].innerHTML = '';
    }
  }
}

function attachListeners() {
  // var squares = $('td')
  $('td').on('click', function(){
    // debugger;
    doTurn(this);});
  // var squares = document.querySelectorAll('td');
  // for(var i = 0; i < squares.length; i++) {
  //   squares[i].addEventListener("click", function(event){
  //     event.stopPropagation();
  //     doTurn(this)
  //   });
  // }
}


