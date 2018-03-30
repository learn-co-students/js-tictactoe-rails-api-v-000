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
var turn = 0;

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
  td.forEach(function(cell){
    cell.addEventListener("click", function(e){
      e.preventDefault();
      var cell = this
      doTurn(cell);
    });
  });
}

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
  // remove message from box
  // need to prevent any other turns from being taken...
}

function checkWinner() {
  // get the board => getBoard() then run the board against the winning combos
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
  var board = {state: getBoard()};
  var gameId = $('table').attr("id");
  if (gameId === undefined || gameId === ""){
    // maybe instead i need to see if there's a call to be made first?
    var newGame = $.post('/games', board);
    newGame.done(function(data){
      var id = data["data"]["id"]
      $('table').attr("id", id)
    });
  } else {
    var updateGame = $.ajax({
      url: '/games/' + gameId,
      method: 'PATCH',
      data: board,
      dataType: 'JSON'
    });
    updateGame.done(function(data){
      var id = data["data"]["id"]
      $('table').attr("id", id)
    });
  };
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
  $("button#" + game).click(function(e){
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
    $('div#message').text("")
    turn = state.filter(c => c === "X" || c === "O").length
  });
}

$(function(){
  // wait until the document is ready before attaching the event listeners
  attachListeners();
})
