// Code your JavaScript / jQuery solution here

var turn = 0;
//debugger
function player() {
  if ((turn % 2) == 0) {
     return 'X'
   } else {
     return 'O'
   }
}

function updateState(td) {
var token = player();
td.innerText = token
}

function setMessage(message) {
// debugger
  // document.getElementById("div#message").innerHTML = message
    $("div#message").append(message);
}

  function checkWinner() {
    var newArray = []
    var board = {};
    const WIN_COMBINATIONS = [
    [0,1,2],// Top row
    [3,4,5],  // Middle row
    [6,7,8],  // bottom row
    [0,3,6], // Left column
    [1,4,7],  // Middle column
    [2,5,8],  // Right column
    [2,4,6], // right diagonal
    [0,4,8] // left diagonal
  ]
  $("td").text((index, square) => board[index] = square)
   //debugger
  // for (var i = 0; i < 9; i++) {
  //     newArray.push($("td")[i].innerHTML);
  //   }
    var found = false
  var result =  WIN_COMBINATIONS.find(function(combo) {
      if (board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] ) {
      found = true
      return found
    } else {
      found = false
      return found
    }
    });
    console.log(result)
    if (result === undefined) {
      return false;

    } else {
      var message = ''
      if (board[result[0]] === 'X') {
        message = 'Player X Won!'
        setMessage(message);
        return true;
      } else if(board[result[0]] === 'O') {
        message = 'Player O Won!'
        setMessage(message);
        return true;
      }
    }
  }








// step 1: gather board data from td element.
  // $("div#message").append(message);
  // td.innerText

// step 2: iterate through the win combinations to
// see if the board data contains any wins

  //debugger
//   WIN_COMBINATIONS = [
//   [0,1,2], // Top row
//   [3,4,5],  // Middle row
//   [6,7,8],  // bottom row
//   [0,3,6], // Left column
//   [1,4,7],  // Middle column
//   [2,5,8],  // Right column
//   [2,4,6], // right diagonal
//   [0,4,8] // left diagonal
// ]
//   if ( WIN_COMBINATIONS[0][6] || WIN_COMBINATIONS[0][7] ) {
//     return true;
//   } else {
//     return false;
//   }
// }

// debugger
  // var aMessage = document.getElementById("div#message");
  // var node = document.createTextNode(message);
  // aMessage.appendChild(node);
