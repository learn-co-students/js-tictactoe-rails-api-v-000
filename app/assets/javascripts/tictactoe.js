// Code your JavaScript / jQuery solution here
var turn = 0;
var gameID = 0;

$(document).ready(attachListeners);


function player(){
  //debugger;
  let remainder = turn % 2
  if (remainder === 0){
    return "X";
  } else {
    return "O";
  }
}

function updateState(square){
  square.innerHTML = player();
}

function setMessage(message){
  const messageDiv = window.document.getElementById('message')
  //debugger;
  messageDiv.innerHTML = message;
}

function checkWinner(){
  const WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]
  square = window.document.querySelectorAll("td");
  var state;
  var winplayer;

  for (let combo of WIN_COMBINATIONS){
    if (!(square[combo[0]].innerHTML === "") && square[combo[0]].innerHTML === square[combo[1]].innerHTML && square[combo[1]].innerHTML === square[combo[2]].innerHTML){
      winplayer = square[combo[0]].innerHTML;
      state = true;
      break;
    } else {
      state = false;
    }
  }

  if (state === true){
    saveGame();
    if (winplayer === 'X') {
      setMessage('Player X Won!');
    } else{
      setMessage('Player O Won!');
    }
    return true;
  } else {
    if (turn === 9) {
      saveGame();
      setMessage('Tie game.')
    }
    setMessage('');
    return false;
  }
}


function doTurn(square){
  updateState(square);
  turn += 1;
  checkWinner();
  if (turn === 9){
    //debugger;
    //setMessage('Tie game.');
    turn = 0;
    let squares = window.document.querySelectorAll('td');
    for (let i=0; i < squares.length; i++) {
      squares[i].innerHTML = "";
    }
  }
}

function attachListeners() {
  $("td").click(function() {
    if (this.innerHTML === "" && checkWinner() === false ) {
      doTurn(this)
    }
  })
  $('#previous').on('click', () => showPreviousGames());
  $('#save').on('click', ()=> saveGame());
  $('#clear').on('click', ()=> clearGame());
}


function showPreviousGames () {
  //debugger;
  $('#games').empty();
  $.get('/games', function(data){
    debugger;
    var games = data["data"]
    var gamesList = "";
    games.forEach(function(game){
      //gamesList += '<button class="prevGames" data-id="' + game["id"]+ '">' + game["id"] + '</button></br>';
      gamesList += '<button class="prevgames" id="game["id"] ">' + game["id"] + '</button></br>';
      $("#games").html(gamesList);
      $('.prevgames').on('click', function(){showGame(this)});
      //debugger;
    });
	});
}


function showGame(game){
  gameID = game.innerHTML
  //debugger;
  $.get('/games/'+gameID, function(data){
    console.log(data)
    var board = data["data"]["attributes"]["state"]
    turn = board.filter(Boolean).length;
    $("td").each(function(i){
      //debugger;
      let board = []
      board = data["data"]["attributes"]["state"]
      this.innerHTML = board[i]
      //debugger;

    })

  });
}


function getBoard(){
  var board = $("td").toArray().map((el) => { return el.innerHTML })
  return board;
}

function retrieveGameID() {
  return gameID;
}

function saveGame(){
  debugger;
  //console.log(data)
  //let gameID = retrieveGameID();
  let game = {}
  game = {"state": getBoard()}
  debugger;
  if (gameID === 0) {
    //debugger;
    //var postarray = $.post('/games', game)
    var postarray = $.ajax({
      type: 'POST',
      url: '/games',
      data: game,
      dataType: 'json'
    })
    //$.get('/games', function(data){
    //  debugger;
    //  gameID = data["data"].length
    //  debugger;
    //});
  } else {
    //debugger;
    var patcharray = $.ajax({
      type: 'PATCH',
      url: '/games/'+gameID,
      data: game,
      dataType: 'json'
    })
  }

}


function saveGame2(){
  debugger;
  //console.log(data)
  let gameID = retrieveGameID();
  let game = {}
  game = {"state": getBoard()}
  debugger;
  if (gameID === 0) {
    //debugger;
    //var postarray = $.post('/games', game)
    var postarray = $.ajax({
      type: 'POST',
      url: '/games',
      data: game,
      dataType: 'json'
    })
  } else {
    //debugger;
    var patcharray = $.ajax({
      type: 'PATCH',
      url: '/games/'+gameID,
      data: game,
      dataType: 'json'
    })
  }
}




function clearGame(){
  gameID = 0;
  turn = 0;
  $("td").html("");
}
