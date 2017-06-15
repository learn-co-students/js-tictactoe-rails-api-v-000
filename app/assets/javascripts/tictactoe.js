$(function(){
  attachListeners();
});

var turn = 0;
var currentGame;

function attachListeners(){
  $('td').on('click', function(e){
    doTurn(e);
  });

  $('#previous').on('click', function(){
    insertPrevGames();
  });

  $('#games').on('click', function(e){
    loadSavedGame(e);
  });

  $('#save').on('click', function(){
    save();
  });
}

function doTurn(e){
  updateState(e);
  if (checkWinner()){
    save(true);
    resetBoard();
  }
  else {
    turn += 1
  }
}

function insertPrevGames(){
  $.get('/games', function(data){
    var games = data["games"];
    if (games.length > 0){
      var gameHtml = "";
      games.forEach(function(game){
        gameHtml += ("<div data-gameid=" + game.id + ">" + game.id + "</div>");
      });
      $('#games').append(gameHtml);
    }
  });
}

function loadSavedGame(e){
  var id = e.target.textContent
  $.get('/games/' + id, function(data){
    currentGame = data["game"]["id"];
    turn = 0;
    var state = data["game"]["state"]
    for (var i = 0; i < state.length; i++) {
      if (state[i] == "X" || state[i] == "O"){
        turn += 1;
      }
      $('[data-x=' + i%3 + '][data-y=' + Math.floor(i/3) + ']').text(state[i]);
    }
  });
}

var save = function(reset=false){
  var method;
  var reqUrl;
  if (currentGame) {
    method = "PATCH";
    reqUrl = '/games/' + currentGame;
  }
  else {
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
      }
      else {
        currentGame =  resp["id"] || resp["game"]["id"];
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

  if ((td1.textContent != "") && td1.textContent == td2.textContent && td2.textContent == td3.textContent){
    message("Player " + player() + " Won!");
    return true;
  }
  else if ((td4.textContent != "") && td4.textContent == td5.textContent && td5.textContent == td6.textContent) {
    message("Player " + player() + " Won!");
    return true;
  }
  else if ((td7.textContent != "") && td7.textContent == td8.textContent && td8.textContent == td9.textContent) {
    message("Player " + player() + " Won!");
    return true;
  }
  else if ((td1.textContent != "") && td1.textContent == td4.textContent && td4.textContent == td7.textContent) {
    message("Player " + player() + " Won!");
    return true;
  }
  else if ((td2.textContent != "") && td2.textContent == td5.textContent && td5.textContent == td8.textContent) {
    message("Player " + player() + " Won!");
    return true;
  }
  else if ((td3.textContent != "") && td3.textContent == td6.textContent && td6.textContent == td9.textContent) {
    message("Player " + player() + " Won!");
    return true;
  }
  else if ((td1.textContent != "") && td1.textContent == td5.textContent && td5.textContent == td9.textContent) {
    message("Player " + player() + " Won!");
    return true;
  }
  else if ((td3.textContent != "") && td3.textContent == td5.textContent && td5.textContent == td7.textContent) {
    message("Player " + player() + " Won!");
    return true;
  }
  else {
    if (turn == 8){
      message("Tie game");
      return true;
    }
    else{
      return false;
    }
  }

}

function updateState(e){
  var td = e.target;
  $(td).text(player());
}

function player(){
  if (turn%2 === 0 ){
    return "X";
  }
  else {
    return "O";
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
