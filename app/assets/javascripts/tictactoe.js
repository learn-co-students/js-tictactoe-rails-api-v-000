$(function(){
  attachListeners();
});

var turn = 0;
var currentGame;

function attachListeners(){
  $('td').on('click', function(e){
    doTurn(e)
  });

  $('#games').on('click', function(e){
    loadSavedGame(e);
  });

  $('#previous').on('click', function(e){
    getAllGames();
  });

  $('#save').on('click', function(){
    save();
  });
}

function doTurn(e) {
  updateState(e);
  if (checkWinner()){
    save(true);
    resetBoard();
  } else {
    turn += 1;
  }
}

function insertPrevGames(){
  $.get('/games', function(data){
    var games = data["games"];
    if (games.length > 0){
      var gameString = "";
      games.forEach(function(game){
        gameString += ("<div data-gameid=" + game.id + ">" + game.id + "</div>");
      });
      $('#games').append(gameString);
    }
  });
}

function loadSavedGame(e){
  var id = e.target.textContent;
  $.get('/games/' + id, function(data){
    currentGame = data["id"];
    turn = 0;
    var state = data["state"];
    for (var i = 0; i < state.length; i++) {
      if (state[i] == "X" || state[i] == "O") {
        turn += 1;
      }
      $('[data-x=' + i % 3 + '][data-y=' + Math.floor(i/3) + ']').text(state[i]);
    }
  });
}

var getAllGames = function(){
  $.getJSON("/games").done(function(response) {
    showGames(response.games)
  })
}

var showGames = function(games) {
  var dom = $()
  games.forEach(function(game){
    dom = dom.add(showGame(game));
  });
  $('#games').html(dom)
}

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var save = function(reset=false){
  var method;
  var reqUrl;
  if (currentGame) {
    method = "PATCH";
    reqUrl = '/games/' + currentGame;
  } else {
    method = "POST";
    reqUrl = '/games';
  }
  $.ajax({
    url: reqUrl,
    type: method,
    dataType: 'json',
    data: { 'game': {
      'state': currentState(),
      'id': currentGame
      }
    },
    success: function(resp, text, xhr){
      if(reset){
        currentGame = 0;
      } else {
        currentGame = resp["id"] || resp["game"]["id"];
      }
    }
  });
}

var currentState = function(){
  var state = [];

  $('td').each(function(index,td){
    state.push($(td)[0].innerText);
  });
  return state;
}

function checkWinner(){
  var td1 = $('td[data-x="0"][data-y="0"]')[0];
  var td2 = $('td[data-x="1"][data-y="0"]')[0];
  var td3 = $('td[data-x="2"][data-y="0"]')[0];

  var td4 = $('td[data-x="0"][data-y="1"]')[0];
  var td5 = $('td[data-x="1"][data-y="1"]')[0];
  var td6 = $('td[data-x="2"][data-y="1"]')[0];

  var td7 = $('td[data-x="0"][data-y="2"]')[0];
  var td8 = $('td[data-x="1"][data-y="2"]')[0];
  var td9 = $('td[data-x="2"][data-y="2"]')[0];
  const winningTds = [
    [td1, td2, td3],[td4, td5, td6],[td7, td8, td9],
    [td1, td4, td7],[td2, td5, td8],[td3, td6, td9],
    [td1, td5, td9],[td3, td5, td7]
  ]
  var msg = "";
  var won = false;
  winningTds.forEach(function(td){
    if (td[0].textContent === "X" && td[1].textContent === "X" && td[2].textContent === "X")  {
      msg = "Player X Won!";
      won = true;
    } else if (td[0].textContent === "O" && td[1].textContent === "O" && td[2].textContent === "O") {
      msg = "Player O Won!";
      won = true;
    } else {
      if (turn == 8) {
        msg = "Tie game";
        won = true;
      }
    }
  });
  message(msg);
  return won;
}

function updateState(e){
  var td = e.target;
  if (td.textContent !== "X" && td.textContent !== "O") {
    $(td).text(player());
  }
}

function player() {
  if (turn%2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function message(string){
    $('#message').text(string);
}

function resetBoard(){
  turn = 0;
  $('td').each(function(){
    $(this).html("");
  });
}
