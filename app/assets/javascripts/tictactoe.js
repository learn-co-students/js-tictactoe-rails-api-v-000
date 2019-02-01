// Code your JavaScript / jQuery solution here
// var table = $("td");
// var count = 0;
// var i;
// for (i=0; i<table.length; i++) {
//   if (table[i].innerHTML != "") {count = count + 1}
// }
//debugger
var turn = 0;
var winning = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

var currentGameID = "notsaved"

function player() {
  if (turn % 2 == 0) { var cplayer = "X"}
  else { var cplayer = "O"}
  return cplayer
}

function updateState (element) {
  // debugger
  var token = player();
  if (element.innerHTML == ""){
    element.innerHTML = token;
  }

}



// player = function() {
//   if (turn % 2 == 0) { var cplayer = "X"}
//   else { var cplayer = "O"}
//   return cplayer
// }

function setMessage (string) {
  // debugger
  var temp = document.getElementById('message');
  temp.innerHTML = string;
}

function checkWinner () {
var table = $("td");
var answer = false;
var i = 0;
var combo = [];

for (i = 0; i < winning.length; i++) {

  if (table[winning[i][0]].innerHTML == "X" && (table[winning[i][0]].innerHTML == table[winning[i][1]].innerHTML) && (table[winning[i][1]].innerHTML == table[winning[i][2]].innerHTML)){
    setMessage ("Player X Won!")
    combo.push(...winning[i]);
    //debugger
  } else if (table[winning[i][0]].innerHTML == "O" && (table[winning[i][0]].innerHTML == table[winning[i][1]].innerHTML) && (table[winning[i][1]].innerHTML == table[winning[i][2]].innerHTML)) {
    setMessage ("Player O Won!")
    combo.push(...winning[i]);
  }
}

  if (combo.length > 0) {
    return true
  } else {
    return false
  }

}

function doTurn (element) {
  // debugger
  if (element.innerHTML === ""){
    updateState(element)
    turn = turn + 1;
  }

  // console.log(turn)
  var xy = checkWinner();
    if (xy == true) {
      // saveGame();
      // debugger
      saveGame()
      var table = $("td");
      var i;
        for (i=0; i<table.length; i++) {
          table[i].innerHTML = ""
        }
      turn = 0;
      currentGameID = "notsaved";

    } else if (!xy && turn == 9) {
      //debugger
      setMessage ("Tie game.")
      saveGame()
      var table = $("td");
      var i;
        for (i=0; i<table.length; i++) {
          table[i].innerHTML = ""
        }
      turn = 0;
      currentGameID = "notsaved";
    }

}

function isgameOver() {
  if (checkWinner() === true || turn === 9){
    return true
  } else {
    return false
  }
}

function saveGame() {

  var currentBoard = [];
  var currentGameBoardParams;
  var table = $("td");

      for(i=0;i<table.length;i++) {
      currentBoard.push(table[i].innerHTML);
      }
      // debugger
  currentGameBoardParams = { state: currentBoard };
  if (currentGameID === "notsaved") {
    // var temp = $.get('/games');
    // temp.done(function(allthegames){
    //   debugger
    // });
    var posting = $.post('/games', currentGameBoardParams);
    posting.done(function(new_game_data){
      // debugger
      currentGameID = new_game_data.data.id;
    });
  } else {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGameID}`,
      data: currentGameBoardParams
    });
  }
}

function clearGame () {

    $("td").empty();
    turn = 0;
    currentGameID = "notsaved";
}

function previousGames() {
  $('#games').empty();
  var posting = $.get('/games');
  posting.done(function(games_data){
    // debugger
    if (games_data.data.length > 0){

      var array = games_data.data
      // debugger
      array.forEach(createButton)
    }
  });
}

// function loadGame(id) {
//   debugger
// }

function attachListeners() {
var table = $("td");
var test = table[0];
var i;
  for (i=0; i<table.length; i++) {
    table[i].addEventListener("click", function(){
      //debugger
      if (!isgameOver()) {
        element = this;
        doTurn(element)
      }

    });
  }

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
  $('#clear').on('click', () => clearGame());
}

function createButton (game) {
  // debugger
  $('#games').append(`<button id=game-`+game.id+`>`+game.id+`</button><br>`);
  $('#game-'+game.id).on('click', () => loadGame(game.id));

}

function loadGame(game_id) {

      currentGameID = game_id;
      var posting = $.get('/games/'+currentGameID);
      posting.done(function(game_data){

        var table = $("td");
        var board = game_data.data.attributes.state;
        var i;
        for (i=0; i<table.length; i++) {
          table[i].innerHTML = board[i];
        }
        turn = 9 - board.filter(cell => cell === "").length;
        // debugger
      });
// debugger
}

window.addEventListener("load",function() {
  attachListeners();
});
