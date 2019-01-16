// Code your JavaScript / jQuery solution here

const WIN_COMBINATIONS = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

var turn = 0
// if turn modulus 2 = 0, that means it will be falsey, and therefore returns the right side (X), 
// and any odd number % 2 = 1, so it would be truthy, and then return the left side (O)
var player = () => turn % 2 == 0 ? "X" : "O" 

var currentGame = 0

$(document).ready(function () {
  attachListeners()
})

var updateState = (square) => {
  var token = player();
  $(square).text(token);
}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  let td = []
  let winner = false
  $("td").text(function (index, text) { td.push(text) })

  WIN_COMBINATIONS.forEach(function (combo) {
    if( td[combo[0]] == td[combo[1]] &&
      td[combo[1]] == td[combo[2]] &&
      td[combo[0]] != ""){
      var winnerToken = td[combo[0]]
      winner = true;
      setMessage(`Player ${winnerToken} Won!`)
    }
  });
  return winner;
}

var doTurn = (square) => {
  // checkWinner()
  updateState(square)
  turn++
  if (checkWinner() == true) {
    resetBoard()
  } else if (turn == 9) {
    setMessage("Tie game.")
    resetBoard()
  }
}

var attachListeners = () => {
  tdClicked()
  $('#previous').on('click', () => previousGames());
  saveGame()

}

let resetBoard = () => {
  $("td").empty()
  turn = 0
}

var previousGames = () => {
  
    $.get("/games", function (data) {
      data.data.forEach(function (game) {
        gameState()
      })
      // $.post('/games', { state: td }, function (data) {
      //   debugger
      //   $("#games").append(`<button >${data.data.id}</button>`)
      //   debugger
      // })
      console.log(data.data)
      // debugger
     
    
    })
    // debugger
    // alert(this.state)

}

var gameState = (game) => {
  $("#games").append(`<button id="game-${game.id}">${game.id}</button>`)
  $(`#game-${game.id}`).on('click', relodeGame(game.id) 
    
  )
} 

function relodeGame(id) {
  $.get(`/games/${id}`, function (params) {
    debugger
  })
}
var saveGame = () => { 
  var gameData;
  $("#save").on("click", function () {
    // alert("save game")
    let td = []

    gameData = { state: td };
    $("td").text(function (index, text) { td.push(text) })
    if (currentGame) { // if currentGame has already been set with save button
      // debugger
      $.ajax({
        type: 'PATCH',  //patch over already saved game
        url: `/games/${currentGame}`,
        data: gameData
      });
    } else {  // if currentGame is still 0 (Note: 0 is *not* truthy in JavaScript)
      $.patch('/games', gameData, function (game) {  // save game first time
        currentGame = game.data.id; // save game first time
        $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
        $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
      });
    }




    // $.post('/games', {state: td}, function (data) {
    //   debugger
      
    //   // $("#games").append(`<button >${data.data.id}</button>`)
    //   // debugger
    // })
    // var values = $(this).serialize();

    // var updating = $.post('/games', values);
  })
}








var tdClicked = () => {
  $("td").on("click", function () {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
}