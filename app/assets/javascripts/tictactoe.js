const winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
var turn = 0
var currentGame = 0

$(document).ready(function() {
  attachListeners()
});

function attachListeners() {
  $('td').on('click', function(event) {
    doTurn(event)
  })

  $('#previous').on('click', function(event){
    getPrevious(event)
  })

  $('#save').on('click', function(event) {
    handler()
  })
}

function doTurn(event) {
  updateState(event)
  checkWinner()
}

function save(event) {
  var values = getTableValues();
  var posting = $.ajax({
      type: "POST",
      data: {game:{state:values}},
      url: "/games",
  });
  posting.done(function(data) {
    currentGame = data.game.id
  })
}

function clearBoard() {
  $('td').each(function(index, value){
    value.innerHTML = ''
  });
  currentGame = 0
  turn = 0
}

function getPrevious(event) {
  $.get('/games').done(function(data) {
    var ul = ''
    data.games.forEach(function(game) {
      ul += '<p onclick="getGame(this)">' + game.id + '</p>'
    })
    $('#games').html(ul)
  })
}

function getGame(game) {
  var oldGame = $.get('/games/'+game.innerHTML)
  oldGame.done(function(data){
    var state = data.game.state
    $('td').each(function(index, value){
      value.innerHTML = state[index]
    });
    currentGame = data.game.id
    turn = 0
  })
}

function getTableValues() {
  var data = []
  $('td').each(function() {
    data.push(this.innerHTML)
  })
  return data
};

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(event) {
  return event.target.innerHTML = player()
}

function checkWinner() {
  var board = getTableValues()
  winCombos.forEach(function(winCombo) {
    if (board[winCombo[0]] === player() && board[winCombo[1]] === player() && board[winCombo[2]] === player()) {
      message("Player " + player() + " Won!")
      handler()
      clearBoard()
    }
  })
  if (turn === 8) {
    message("Tie game")
    handler()
    clearBoard()
  }
  turn += 1
  return false
}

function handler() {
  if (currentGame) {
    patchOldGame()
  } else {
    save()
  }
}

function message(string) {
  $('#message').html(string)
}

function patchOldGame() {
  var values = getTableValues();
  var posting = $.ajax({
      type: 'PATCH',
      data: {game:{state:values}},
      url: "/games/" + currentGame,
  });
}
