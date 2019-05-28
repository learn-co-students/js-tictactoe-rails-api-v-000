var turn = 0
const winningCombo =
      [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ]

$(document).ready(function() { 
  attachListeners();
 });

var player = () => turn % 2 ? 'O' : 'X';


function updateState(element) {
  element.innerHTML = player();
}

function setMessage(message) {
  $( "#message" ).text(message)
}

function checkWinner() {
  const board = [];
  let winner = false;
  $("td").text(function(i, token){
    board[i] = token;
  });
  winningCombo.forEach(function(combo){
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== ""){
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });
    return winner;
}



function doTurn(element) {

  if (element.innerHTML !== ""){
  return "try another element"
}

  updateState(element);
  turn ++;

  if (checkWinner()){
    $("td").empty()
    turn = 0
  }
  else if (turn === 9) {
    setMessage("Tie game.")

  }

}

function attachListeners() {
  $("td").on("click", function(){
    if (!checkWinner()) {
      doTurn(this)

    }
  });

    $("#save").on("click", function(saveGame) {
    });


    $("#previous").on("click", function(previousGame) {

    });


    $("#clear").on("click", function() {
        $("td").empty()
  });
}

  function previousGame() {
    $.get("/games")
  }

  function saveGame() {

  }
