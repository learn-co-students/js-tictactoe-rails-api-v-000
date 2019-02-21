// Code your JavaScript / jQuery solution here

$(document).ready(function (){
  attachListeners()
})

var winningComb = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var turn = 0;
var squares = $("td")
var currentGame = 0

var player = () => turn % 2  ? 'O' : 'X';

function updateState(el) {
  $(el).text(player())
}

function checkWinner() {
  var board = []
  var isWinner = false
  squares = $("td")

  for (i = 0; i < 9; i++) {
    board.push(squares[i].textContent)
  }

  winningComb.some(function(el){
    if (board[el[0]]!==""  && board[el[0]] == board[el[1]] && board[el[1]] == board[el[2]]){
      setMessage(`Player ${board[el[0]]} Won!`)
      isWinner = true
    }
  })
  return isWinner
}



function doTurn(el) {

    updateState(el)
    turn ++
    if (checkWinner()){
      saveGame();
      resetBoard();
    } else {
      if (turn === 9) {
        setMessage("Tie game.")
        saveGame();
        resetBoard();
      }
    }
  }

function attachListeners() {
  $("td").on("click", function(){
    if (!$.text(this) && !checkWinner()){
      doTurn(this)
    }
  });
  $("#previous").on("click", prevButton)
  $("#save").on("click", saveGame)
  $("#clear").on("click", resetBoard)
}

function setMessage(str){
  $("div#message").text(str)
}

function saveGame(){
  var jqBoard = $("td").map(function(idx, el){
    return el.textContent
  })
  var board = $.makeArray(jqBoard)
  var gameData = {state: board}


  if (currentGame !== 0){
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', {state: board}, function(data){
      currentGame = parseInt(data.data.id)
    })
  }
}

function resetBoard(){
  $("td").empty();
  turn = 0;
  currentGame = 0;
}

function prevButton(){
  $("#games").empty();
  $.get('/games', function(data){
    savedGames = data.data
    if (savedGames.length > 0) {
      savedGames.forEach(function(game){
        $("#games").append(`<button id="gameid-${game.id}">${game.id}</button>`)
        $(`#gameid-${game.id}`).on("click", function() {reloadGame(game.id)})
      })
    }
  })
}

function reloadGame(gameId){
  document.getElementById("message").innerHTML = '';
  currentGame = gameId
  $("td").empty();
  turn = 0;
  $.get(`/games/${gameId}`, function(game){
    // $("td").text('');
      if (!!game.data.attributes){
        var arr = game.data.attributes.state
        $.each(arr, function(i, val){
          if (val !== '') {
            turn++
          }
          var x = i % 3
          var y = Math.floor(i / 3)
          document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = val
        })
      }
    })
  }

  // $.map($("td"), function(el, i){
    //
    //   el.innerHTML = arr[i]
    // })
