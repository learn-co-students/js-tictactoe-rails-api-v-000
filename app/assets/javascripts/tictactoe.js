// Code your JavaScript / jQuery solution here
var winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

let emptyBoard = {state: ["","","","","","","","",""]};
// the turn variable should be decided based on the state of the game?
var turn = 0

function player() {
  return (turn % 2 === 0) ? "X" : "O"
}

function updateState(cell) {
  $(cell).text(player())
}

function doTurn(cell) {
  if(cell.textContent === ""){
    updateState(cell);
    turn++;
    if(checkWinner()){
      saveGame();
      newGame();
    } else if(checkTie()) {
      setMessage("Tie game.")
      saveGame();
      newGame();
    };
  }
  // if the game is over then you need to prevent anything from happening after
}

function attachListeners(){
  // add event listener to each button
  $('#save').on('click', function(e){
    e.preventDefault();
    saveGame();
  });

  $('#previous').on('click', function(e){
    e.preventDefault();
    showPrevious();
  });

  $('#clear').on('click', function(e){
    e.preventDefault();
    newGame();
  });
  // add an event listener to all cells
  var td = document.querySelectorAll("td")
  for(let i = 0; i < td.length; i++) {
    td[i].addEventListener("click", function(e){
      e.preventDefault();
      var cell = this
      doTurn(cell);
    })
    // how can i ensure that inside doTurn() that the "this" value is kept?
    // think i need to bind the call here?
  };
}
// how do i collect all the values from the board => textContent!

function getBoard() {
  let nodes = document.querySelectorAll('td');
  let board = [];
  for(let i = 0; i < nodes.length; i++){
    board.push(nodes[i].textContent);
  };
  return board;
}

function newGame() {
  // empty the cells
  $('td').text("")
  // reset turn count
  turn = 0;
  // clear id of table
  $('table').attr("id", "")
}

function checkWinner() {
  // get the board => getBoard()
  // then run the board against the winning combos
  let board = getBoard();
  var result = false;
  // check if the board would even have a winner yet
  if(board.filter(cell => cell === "X" || cell === "O").length < 4){
    return result;
  } else {
    winningCombos.forEach(function(combo){
      // probably want to move this into another function
      if(board[combo[0]] === "X" && board[combo[1]] === "X" && board[combo[2]] === "X") {
        result = true;
        // invoke setMessage here so that you still return boolean
        setMessage("Player X Won!");
      } else if(board[combo[0]] === "O" && board[combo[1]] === "O" && board[combo[2]] === "O") {
        result = true;
        setMessage("Player O Won!");
      }
    });
    return result;
  }
}

function checkTie() {
  let board = getBoard();
  if(board.filter(cell => cell === "X" || cell === "O").length === 9) {
    return true
  };
}

function setMessage(message) {
  $('#message').text(message)
  // add the tie or winning mesage to the div#message element in DOM
}

function saveGame() {
  // figure out if the game already exists in the system
  // figure out if there's a way to add a hidden object that indicates whether or not it's a saved game (i.e. hide id field?)
  alert("you clicked save")
  // get the state of the board
  var board = {state: getBoard()};
  // var values = $(this).serialize();
  var gameId = $('table').attr("id");
  if (gameId === ""){
    $.post('/games', board);
  } else {
    $.ajax({
      url: '/games' + gameId,
      method: 'PATCH',
      data: board,
      dataType: 'JSON'
    });
  }
  // if not already a game then
    // var posting = $.post('/games', values);
  // if already a game then
    // var updating = $.patch('/games' + id, values)

  // need to check if the game already exists, if it does then update
  // if game doesnt exist, create and save state
  // make call to API #update to save the state
}

function showPrevious() {
  $.get('/games', function(data){
    var $div = $('div#games')
    var games = data["data"]
    var list = document.querySelectorAll('div#games button').length
    for(let i = list; i < games.length; i++) {
      // do i need to look at the IDs on the page and start the iteration there?
      // need to make sure not to repeat anything that's already listed
      createButton($div, games[i]["id"])
    }
  })
}

function createButton(div, game) {
  var button = `<button id="${game}">${game}</button>`;
  div.append(button);
  $("button#" + game).on("click", function(e){
    e.preventDefault();
    var game = this.textContent
    loadGame(game);
  });
}

function loadGame(game) {
  $.get("/games/" + game, function(data){
    var state = data["data"]["attributes"]["state"]
    let nodes = document.querySelectorAll('td');
    var id = data["data"]["id"]
    $('table').attr("id", id)
    for(let i = 0; i < nodes.length; i++){
      nodes[i].textContent = state[i];
    };
  });
}

$(function(){
  attachListeners();
})
