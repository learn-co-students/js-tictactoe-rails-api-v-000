const WIN_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
var turn = 0;
var currentGame = 0

$(function(){
  attachListeners()
})

function player(){
    if (turn % 2 === 0) {
      return "X"
    } else {
      return "O"
    }
}

function updateState(move){
  var result = player()

  $(move).text(result);
}

function setMessage(string){
  $("#message").text(string)
}

function checkWinner() {
  var winner = false
  var board = $('td').toArray('td').map(e => e.textContent)

  WIN_COMBOS.forEach(function(combo){
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      winner = true
      message = 'Player ' + board[combo[0]] + ' Won!'
      setMessage(message)
    }
  })
  return winner
}

function doTurn(move){
  updateState(move)
  turn++
  if (checkWinner()){
    $('td').text('')
    turn = 0
    saveGame()
  } else if (turn === 9) {
    setMessage('Tie game.')
    $('td').text('')
    turn = 0
    saveGame()
  }
}

function attachListeners(){
  $('td').on("click", function() {
    if (this.textContent === '' && !checkWinner()){
      doTurn(this)
    }
  })

  $('#previous').on("click", function(){
    previousGames()
  })

  $('#save').on("click", function(){
    saveGame()
  })

  $('#clear').on("click", function(){
    $('td').text('')
    turn = 0
    currentGame = 0
  })
}

function previousGames(){
  $.ajax({
    type: "get",
    url: "/games",
    success: function(response){
      if (response.data.length > 0){
        response.data.forEach(function(game){
          //debugger
          if($('#game' + game.id).length === 0){
            $('#games').append('<button id="game' + game.id + '">'+game.id+'</button>')
            $(`#game${game.id}`).on('click', function(){
              restoreGame(game)
            })
          }
        })
      }
    }
  })
}

function saveGame(){
  var state = $('td').toArray('td').map(e => e.textContent)
  if (currentGame){

    $.ajax({
      type: "patch",
      url: `/games/${currentGame}`,
      data: {state: state}
    })
  } else {
    $.post("/games", {state: state}, function(game){
      currentGame = game.data.id
      $('#games').append('<button id="game' + game.data.id + '">'+game.data.id+'</button>')
      $(`#game${game.data.id}`).on('click', function(){
        restoreGame(game)
      })
    })
  }
}

function restoreGame(game){

  $.ajax({
    type: 'get',
    url: `/games/${game.id}`,
    success: function(response){
      var state = response.data.attributes.state
      turn = state.filter(e => e !== '').length
      currentGame = game.id
      $.each(state, function(index) {
	     $(`td:eq(${index})`).text(this)
      })
    }
  })
}
