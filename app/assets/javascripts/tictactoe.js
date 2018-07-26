// Code your JavaScript / jQuery solution here
var turn = 0

var currentlyPlaying = 0

var gameId = 0

var WIN_COMBOS = [
     [0,1,2],
     [3,4,5],
     [6,7,8],
     [0,3,6],
     [1,4,7],
     [2,5,8],
     [0,4,8],
     [2,4,6]
  ]
$(document).ready(function(){
  attachListeners()
})

// function getBoard(){
//   return $("td").toArray().map(function(element){
//     return element.innerHTML
//   })
// }

function player(){
  var even = turn %2 === 0
  if (even){
  return 'X'}
  else {
    return "O"
  }
}

function updateState(td){
  td.innerHTML = player()
}

function setMessage(message){
  $("#message").text(message)
}

function checkWinner(){
  // let board = getBoard();
  //
  // for(let el of win_combinations){
  //    if (board[el[0]] === 'X' && board[el[1]] === 'X' && board[el[2]] === 'X'){
  //     setMessage("Player X Won!")
  //     return true
  //   }
  //    else if (board[el[0]] === 'O' && board[el[1]] === 'O' && board[el[2]] === 'O'){
  //     setMessage("Player O Won!")
  //     return true
  //     }
  //   }
  // return false

  var winner = false;
  var board = {}
  $('td').text((index, square) => board[index] = square);

  WIN_COMBOS.forEach(position => {
    if(board[position[0]] === board[position[1]] && board[position[1]] == board[position[2]]
    && board[position[0]] !== ""){
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner;
}

function doTurn(square){
  updateState(square);
  turn ++;

  if (checkWinner()){
    turn = 0;
    $("td").empty()
    saveGame()
  }
  else if (turn === 9){
  setMessage("Tie game.")
  clearGame()
  saveGame()
  }
}

function attachListeners(){
  $('td').on("click", function(){
    if(!$.text(this) && !checkWinner()){
      doTurn(this);
      }
    })
    $("#previous").on("click", () => previousGame())
    $("#save").on("click", () => saveGame())
    $("#clear").on("click", () => clearGame())
  }

function clearGame(){
  $('td').empty()
  turn = 0
  currentlyPlaying = 0
}

function previousGame(){
  $("#games").empty()
  $.get('/games').done(function(games){
    games.data.forEach(function(game){
      $("#games").append(`<button id="gameid-${game.id}">Game Number: ${game.id}</button></br>`)
      $('#gameid-' + game.id).click(() => resumeGame(game.id));
    })
  })
}

function resumeGame(gameId){
  $("#message").text("")
  let id = gameId;
  $.get(`/games/${gameId}`, function(game){
    let state = game.data.attributes.state
    $('td').text((index, square) => state[index])
    currentlyPlaying = id
    turn = state.join('').length

    checkWinner()
  })
}

function saveGame() {
  let state = $('td').toArray().map(e => e.innerText);
  if (currentlyPlaying) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentlyPlaying}`,
      dataType: 'json',
      data: {state : state}
    });
  } else {
    $.post('/games', {state: state}, function(game) {
      currentlyPlaying = game.data.id
    });
  };
}
