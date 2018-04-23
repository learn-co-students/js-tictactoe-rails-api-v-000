// Code your JavaScript / jQuery solution here

var turn = 0

function attachListeners() {
  var squares = document.querySelectorAll('td')
  
  for(var i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', function(event) {
      if (!$.text(this) && !checkWinner()) {
      doTurn(this);
      }
    })
  }
  
  $('button#previous').on('click', function(e) {
    $.ajax({
      method: "GET",
      url: '/games'
    }).success(function(response) {
      console.log(response)
    })
    
    e.preventDefault()
  })
}

$(document).ready(() => {
  attachListeners()
})

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

function fullBoard() {
  var squares_ndx = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  return squares_ndx.every(squareTaken)
}

function squareTaken(index) {
  if(cellValue(index).indexOf("X") > -1 || cellValue(index).indexOf("O") > -1) {
    return true
  } else {
    return false
  }
}

function cellValue(index) {
  var squares = document.querySelectorAll('td');
  return squares[index].innerHTML
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
  if(square.innerHTML === "" && !gameWon) {
    updateState(square)
    turn++
    var gameWon = checkWinner()
    var gameTie = fullBoard() && !gameWon
  
    if (gameWon || gameTie) {
      if (gameTie) {
        setMessage('Tie game.')  
      }
      turn = 0
      
      $('td').empty()
      setMessage('')
     }
  }
}

function setMessage(string) {
  document.getElementById("message").append(string);
}

// function previous() {
//   console.log("previous method")
  
// }





