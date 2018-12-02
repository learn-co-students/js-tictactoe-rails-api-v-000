// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0
var winCombos = [[0,1,2],
                   [3,4,5],
                   [6,7,8],
                   [0,3,6],
                   [1,4,7],
                   [2,5,8],
                   [0,4,8],
                   [2,4,6]];

function player(){
  if (turn % 2 === 0){
    return 'X';
  }
  else {
    return 'O';
  }
};

function updateState(square){
  $(square).text(player());
};

function setMessage(string){
  $('#message').text(string);
};

function checkWinner(){
  var winner
  var board = Array.from(document.querySelectorAll("td")).map(x => x.innerHTML)
  winCombos.forEach(function(combo) {
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && !!board[combo[2]]) {
      winner = board[combo[2]]
    }
  })
  if (!!winner) {
    setMessage(`Player ${winner} Won!`)
  }
  return !!winner
};

function doTurn(square){
  updateState(square)
  turn++
  if (checkWinner()) {
      saveGame()
      resetBoard()
    }
  else if (turn === 9) {
      setMessage("Tie game.")
      saveGame()
      resetBoard()
    }
};


  function saveGame() {
    var board = Array.from(document.querySelectorAll("td")).map(x => x.innerHTML)
    if (!!currentGame) {
      $.ajax({type:'PATCH', url:`/games/${currentGame}`, data: {state:board}});
    } else {
      $.post('/games', {state:board}, function(data){
        currentGame = data.data.id
      })
    }
  }

  var previousGames = () => {
  $.get('/games', function(data) {
    var gamesData = data.data
    if (!!gamesData) {
      var buttons = ``
      gamesData.forEach((game) =>
      buttons += `<button style="display: block;" type="button" class="previous-game" onclick="displayGame(${game.id})" data-id="${game.id}">Game ${game.id}</button>`
    )}
    $("#games").html(buttons)
  })
}

var displayGame = (gameId) => {
  $.get(`/games/${gameId}`, function(data) {
    currentGame = gameId
    var board = document.querySelectorAll("td")
    var state = data.data.attributes.state
    board.forEach((space, i) => { space.innerHTML = state[i]})
    turn = 9 - (state.length - state.filter(String).length)
  })
  checkWinner()
}

var resetBoard = () => {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

$(function() {
    attachListeners()
  })

  function handleInnerText(text){
    if (text) {
      return text.trim()
    } else {
      return text
    }
  }

  function attachListeners() {
    $("td").on('click', function() {
      if (!handleInnerText(this.innerHTML) && !checkWinner()) {
        doTurn(this)
      }
    })

    $("button#save").on('click', () => {
      saveGame()
    })

    $("button#previous").on('click', () => {
      previousGames()
    })

    $("button#clear").on('click', () => {
      resetBoard()
    })
}
