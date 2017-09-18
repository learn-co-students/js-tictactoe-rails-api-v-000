$(document).ready(function() {
  attachListeners();
});

var turn = 0;
var currentGame = 0;
var winCombo =  [
  [0, 4, 8], //diagonal 1
  [2, 4, 6], //diagonal 2
  [0, 1, 2], //top row
  [3, 4, 5], //middle row
  [6, 7, 8], //bottom row
  [0, 3, 6], //left columns
  [1, 4, 7], //middle columns
  [2, 5, 8] //right columns
];

var board =  [" ", " ", " ", " ", " ", " ", " ", " ", " "];

function player() {
  if (turn%2 === 0 | turn === 0) {
    return "X"
  } else if (turn%2 === 1) {
    return "O"
  }
}

function updateState(cell) {
  var token = player()
  $(cell).append(token)
}

function message(string) {
  document.getElementById('message').innerHTML = (string)
}

function currentBoard() {
  var board = []
  $('td').each(function() {
    board.push($(this).text())
  })
  return board
}

function checkWinner() {
  var won  = false
  var board = currentBoard()
  for (var i = 0; i < winCombo.length; i++) {
    var combo = winCombo[i]
    if (board[combo[0]] ==  board[combo[1]] && board[combo[1]] == board[combo[2]] && board[combo[1]] != "") {
      message(`Player ${board[combo[1]]} Won!`)
      won = true
    }
  }
  return won
}

function clearBoard() {
  $('td').empty()
  turn = 0
  currentGame = 0
}

function doTurn(cell) {
  updateState(cell)
  turn ++
  var done = checkWinner()
  if (done === true) {
    saveGame()
    clearBoard()
  } else if (done === false && turn === 9){
    message("Tie game.")
    saveGame()
    clearBoard()
  }
}

function saveGame(){
  if (currentGame === 0) {
    $.post('/games', {state: currentBoard()}).done(function(response) {
      currentGame = response.data['id']
    });
  } else {
    $.ajax({
      type: 'PATCH',
      url: "/games/" + currentGame,
      data: {
        game: {
          state: currentBoard()
        }
      }
    });
  }
}

function listPrevious() {
  $.get("/games").done(function(response) {
    if (response.data.length) {
      var buttons = response.data.map(game => `<button>${game["id"]}</button>`)
      $("#games").html(buttons)
    }
  })
}

function attachListeners() {
  $('td').on('click', function(){
    if ($(this).is(':empty') && turn != 9 && !checkWinner()){
      doTurn(this);
    };
  });
    $('#save').on('click', function(){
        saveGame();
    })

    $('#previous').on('click', function(){
        listPrevious();
    })

    $('#clear').on('click', function(){
        clearBoard();
    })

    $('#games').on("click", function (event) {
        $.get(`/games/${event.target.innerHTML}`).done(function(response){
            var state = response.data.attributes.state
            $('td').each(function(i, td) {
                td.innerHTML = state[i]
            })
            turn = state.filter(function(t){
                 return t !=""
            }).length

            currentGame = response.data.id
        })
    })


}
