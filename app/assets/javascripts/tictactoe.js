  var winCombinations = [
    [0,1,2], // Top row
    [3,4,5], // Middle row
    [6,7,8], // Bottom row
    [0,3,6], // Left Column
    [1,4,7], // Middle Column
    [2,5,8], // Right Column
    [0,4,8], // Diagnoal L to R
    [2,4,6]  // Diagnoal R to L
  ]

// $(document).ready(function() {
//     $('td').on("click", function (e) {
//       if (e.target.dataset && e.target.innerHTML == "") {
//         e.target.innerHTML = doTurn()
//       }
//   }); 
// });

// $('tr[id^=mytablerow-]').on('click', function(){
//    if ( $('a#action-toggle').text() == 'Enabled' ) {
//        alert('action enabled'); 
//    }
// });
var board = {}

var getBoard = () => {
  var index = 0
  document.querySelectorAll("[data-y='0']").forEach(function(row){
     board[index] = row
     index ++
  })
  document.querySelectorAll("[data-y='1']").forEach(function(row){
     board[index] = row
     index ++
  })
  document.querySelectorAll("[data-y='2']").forEach(function(row){
     board[index] = row
     index ++
  })
}
getBoard()

var turn = 0

function updateState() {
  return player()
}

function attachListeners() {
}
var message = string => {
  document.getElementById('message').innerHTML = `<p>${string}</p>`
}


function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function doTurn() {
  if (!checkWinner()){
    let playerTurn = updateState()
    turn += 1
    return playerTurn
  }
 }


var attachListener = function () {
  $(document).ready(function() {
    $('td').on("click", function (e) {
      if (e.target.dataset && e.target.innerHTML == "") {
        e.target.innerHTML = doTurn()
      }
    }); 
  });
}

attachListener()


function checkWinner() {
  getBoard()
  winCombinations.forEach(function(line) {
    if (board[line[0]].innerText == board[line[1]].innerText && board[line[2]].innerText == board[line[1]].innerText && board[line[0]].innerText != ""){
      message(`Player ${board[line[0]].innerText} Won!`)
      return true
    }
  })
}

