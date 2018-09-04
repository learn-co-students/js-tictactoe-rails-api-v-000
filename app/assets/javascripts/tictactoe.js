// Code your JavaScript / jQuery solution here
// $( "td:contains('x')" )
var turn = 0
var id = null
const newGame = $("table")
const winCombinations = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]]
]

function isEven(n) {
   return n % 2 == 0;
}

function player(){
  return isEven(turn) ? 'X' : 'O'
}

function updateState(element){
  $(element).html(player())
}

function setMessage(message){
  $('#message').html(message)
}

function checkWinner(){
  let winner = ""
  let winningCombo = winCombinations.find( combo => {
    const value1 = $(`td[data-x='${combo[0][0]}'][data-y='${combo[0][1]}']`).html()
    const value2 = $(`td[data-x='${combo[1][0]}'][data-y='${combo[1][1]}']`).html()
    const value3 = $(`td[data-x='${combo[2][0]}'][data-y='${combo[2][1]}']`).html()
    winner = value1
    return value1 !== "" && value1 === value2 && value2 === value3
  })
    if (winningCombo) {
      saveGame();
      setMessage(`Player ${winner} Won!`);
      return true;
    } else {
      return false;
    }
}

function checkTie(){
  let board = []
  $("td").each(function(index, item){
    board.push(item.innerHTML)
  })
  const tie = board.findIndex(element => {
    return element === ""
  })
 return tie < 0 ? true : false
}

function doTurn(element){
  updateState(element)
  turn += 1
  if (checkWinner()) {
    clearGame();
  } else if (checkTie()) {
    saveGame();
    clearGame();
    setMessage("Tie game.");
  }
}


function saveGame(){
  let game = {
    state: []
  }
  $('td').each(function(){
    game["state"].push($(this).text())
  })
  if (id === null) {
   $.post('/games', game).done(function(data){
     id = data["data"]["id"]
   })
 } else {
   $.ajax({
      url: '/games/' + id,
      method: 'PATCH',
      data: game,
      });
    setMessage("Game Saved");
 }
}

function clearGame(){
  $('td').text("");
  turn = 0
  id = null
}

function loadGame(element){
  id = element.dataset["id"]
  $.get('/games/' + id, function(data){
    let gameState = data["data"]["attributes"]["state"];
    debugger;
    id = data["data"]["id"];
    turn = gameState.join('').length
    $('td').each(function(index, element){
      element.innerHTML = gameState[index]
    })
  })
}


function previousGames(){
  $.get('/games', function(data){
    data["data"].forEach(function(item){
      if ($(`button[data-id='${item["id"]}']`).text() == false ){
        $('#games').append('<button data-id =' + item["id"] + ' onclick="loadGame(this)"> Game #' + item["id"] + '</button>');
      }
    })
  })
}

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $('#save').on("click", function(){
    saveGame();
  });
  $('#previous').on('click', function(){
    previousGames();
  });
  $('#clear').on('click', function(){
    clearGame();
  });

  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    };
  });
}
