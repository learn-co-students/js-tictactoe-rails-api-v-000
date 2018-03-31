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

var turn = 0;
var currentGame = 0;
var cells = document.querySelectorAll('td')

function attachListeners(){
  // add event listener to each button
  $('button#save').on('click', function(){
    saveGame();
  });

  $('button#previous').on('click', function(){
    showPrevious();
  });

  $('button#clear').on('click', function(){
    newGame();
  });

  $('td').on('click', function(){
    if(!$.text(this) && !checkWinner()){
      // if there isn't already something in the cell and there is no winner, take the turn
      doTurn(this);
    };
  });
}

function doTurn(cell) {
  updateState(cell);
  turn++;
  if(checkWinner()){
    saveGame();
    newGame();
  } else if(turn === 9) {
    setMessage("Tie game.")
    saveGame();
    newGame();
  };
}

function player() {
  return (turn % 2 === 0) ? "X" : "O"
}

function updateState(cell) {
  $(cell).text(player())
}

function checkWinner() {
  let board = getBoard();
  var result = false;
  winningCombos.forEach(function(combo){
    if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      result = true;
      setMessage(`Player ${board[combo[0]]} Won!`);
    }
  });
  return result;
}

function setMessage(message) {
  $('div#message').text(message)
}

function getBoard() {
  let board = [];
  for(let i = 0; i < cells.length; i++){
    board.push(cells[i].textContent);
  };
  return board;
}

function setBoard(state) {
  for(let i = 0; i < cells.length; i++){
    cells[i].textContent = state[i];
  };
}

function newGame() {
  $('td').text("");
  turn = 0;
  currentGame = 0;
}

function saveGame() {
  let board = {state: getBoard()};
  if (currentGame){
    $.ajax({
      url: `/games/${currentGame}`,
      method: 'PATCH',
      data: board,
      dataType: 'JSON'
    }).done(function(data){
      let id = data.data.id;
      currentGame = id;
    });
  } else {
    $.post('/games', board, function(data){
      let id = data.data.id;
      currentGame = id;
    });
  };
}

function showPrevious() {
  $.get('/games', function(data){
    let $div = $('div#games');
    let games = data.data;
    let list = document.querySelectorAll('div#games button').length;
    for(let i = list; i < games.length; i++) {
      createButton($div, games[i]["id"]);
    }
  })
}

function createButton(div, game) {
  var button = `<button id="${game}">${game}</button>`;
  div.append(button);
  $("button#" + game).click(function(e){
    let game = this.textContent
    loadGame(game);
  });
}

function loadGame(game) {
  $.get("/games/" + game, function(data){
    let state = data.data.attributes.state;
    let id = data.data.id;
    currentGame = id;
    turn = state.filter(c => c !== "").length;
    setBoard(state);
  });
}

$(function(){
  // wait until the document is ready before attaching the event listeners
  attachListeners();
})
