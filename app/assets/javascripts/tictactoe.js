const WINCOMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
var turn = 0
var gameID = 0

$(document).ready(function() {
  attachListeners();
});


function player () {
  if ((turn % 2) == 1) {
    return "O"
  } else {
    return "X"
  }
}

function attachListeners () {
  $('td').click( function(){
    box = this
    if(checkWinner() === false && box.innerHTML === ""){
      doTurn(box)}
  })
  $('button#save').click(function(){
    saveGame()
  })
  $('button#previous').click(function(){
    previousGames()
  })
  $('button#clear').click(function(){
    clearGame()
  })
}

function updateState (box) {
  xOrO = player()
  box.innerHTML = xOrO
}

function setMessage (string) {
  $("div#message").html("")
  $("div#message").append(string)
}


function checkWinner() {
  let board = []
  let winner = false
  const WINCOMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

  $("td").each(function(index) {
    board[index] = this.textContent
  })
  WINCOMBINATIONS.some(function(set) {
    if (board[set[0]] === board[set[1]] && board[set[1]] === board[set[2]] && board[set[0]] !== "" ) {
      setMessage(`Player ${board[set[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function doTurn(box) {
    updateState(box)
    turn ++
    if (checkWinner() === true) {
      saveGame()
      clearGame()
    } else if (turn === 9) {
      setMessage("Tie game.")
      saveGame()
      clearGame()
    }
}

function clearGame() {
  let board = document.querySelectorAll("td")
  board.forEach(function(square){
    square.innerHTML = ""
  })
  turn = 0
  gameID = 0
}

function saveGame () {
  let state = []
  $('td').text(function(index, box) {
    state.push(box);
  });
  if (gameID === 0) {
  $.post( "/games", { state: state})
  .done(function(game){
    gameID = game.data.id
  })
} else {
  $.ajax({
  type: 'PATCH',
  url: `/games/${gameID}`,
  data: {state: state}
});
}
}

function previousGames () {
  $.get('/games', function(json) {
    let $game_section = $("#games")
    $game_section.html("")
    if (json.data.length !== 0){
    json.data.forEach(function(game){
    $game_section.append(`<button id="${game.id}">` + `${game.id}` + "</button>" + `${game.attributes["updated-at"]}` + "<br>")
    $(`#${game.id}`).click(function() {
      gameID = game.id
      $.get(`/games/${this.id}`, function(game){
        let state = game.data.attributes.state
        let counter = 0
          $('td').each(function(index, box) {

            box.innerHTML = state[counter]
            counter++
          } )
          turn = state.filter(String).length
          checkWinner()
      })
    })
  })}
})
}
