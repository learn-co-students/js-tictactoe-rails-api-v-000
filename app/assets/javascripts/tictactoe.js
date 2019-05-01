// Code your JavaScript / jQuery solution here
var currentGame = 0;
var turn = 0;
var board = [];

$(document).ready(function() {
  attachListeners();
  //window.onload = () => {}
});

function attachListeners() {
  $('#save').on('click', function() {
      saveGame();
  });

  $('#previous').on('click', function() {
    previousGames();
  });

  $('#clear').on('click', function() {
    clearGame();
  });

  $('td').on("click", function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

}

function doTurn(square) {
  updateState(square)
    turn++
  if (valid(square)){
    turn = turn + 1
    saveGame()
    //debugger
  }else
  if (checkWinner()){
    saveGame()
    clearGame()
  }else
    if (turn ===  9){
      setMessage("Tie game.")
      saveGame()
      clearGame()
  }
};


function valid(square){
 if (square.innerHTML === "X")
 //debugger
   return false
 if (square.innerHTML === "O")
   return false
 else
   return true
}

function saveGame() {

  var state = Array.from($("td"), td => td.innerText)
  var params = { state: state }

  if (currentGame)
    $.ajax({
      method: `PATCH`,
      url: `/games/${currentGame}`,
      data: params
    });

  else
    $.post("/games", params, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => loadGame(game.data.id));
    });

}

function previousGames() {
  //gameButtons();
  $("div#games").html('');
  $.get('/games', function(games) {
  if (games.data.length > 0) {
    games.data.forEach(function(game){
      var id = game["id"];
      var button = '<button id="game-' + id + '">' + id + '</button>'
      $("div#games").append(button);
      $(`#game-${id}`).on('click', () => loadGame(id));
    });
  }
})
  //$.ajax({
  //  method: "GET",
  //  url: "/games"
  //});
};

function loadGame(id){
$.get(`/games/${id}`, function(game) {
    squares = document.querySelectorAll("td")
    state = game.data.attributes.state
    currentGame = id;
    turn = state.join("").length;
    var i = 0;
    squares.forEach(function(square) {
      square.innerHTML = state[i];
      i++;
    })
  })
}

//function Buttons(gamesData) {
//  var gameButtons = "gamesDiv.children"
//  var out;
//    var i;
//    for(i = 0; i < gameButtons.length; i++) {
//        out += '<a href="' + gameButtons + '">' + $("games") + '</a><br>';
        //debugger
//    }
  //debugger
//    document.getElementById("games").innerHTML = out;
//};

function clearGame() {
  turn = 0;
  $('td').empty();
  currentGame = 0;
};

function gameplay(square) {
  valid(square);
}

function player() {
  if (turn % 2 === 0)
    return "X";
  else
    return "O";
  };

var square = $("td");
//var playerToken = player();

function updateState(square) {
   square.innerHTML = player();
};

var messageDiv = $("#message");

function setMessage(string) {
  messageDiv.html(string);
};


function checkWinner(){

    WIN_COMBINATIONS= [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [6,4,2],

  ]

   board = []
     document.querySelectorAll("td").forEach(function(square){
     board.push(square.innerHTML)
 })

var winner = false

 WIN_COMBINATIONS.forEach(function(win) {
   win_index_1 = win[0]
   win_index_2 = win[1]
   win_index_3 = win[2]

    place_1 = board[win_index_1]
   place_2 = board[win_index_2]
   place_3 = board[win_index_3]


    if (place_1 === place_2 && place_2 === place_3 && place_1 !== ""){
      setMessage(`Player ${ place_1 } Won!`)
      return winner = true}
   })
 return winner

}
