$('document').ready(function(){

  attachListeners();
});

var currentState;
var turn = 0;
var gameId;
var currentGame = 0;

function newGame(){
  var state = [];
  $('td').each(function(index, cell){
    state.push($(cell).text());
  });
  currentState = state;
  saveGame();

  $('td').each(function(index, cell){
    $(cell).text('');
  });

  turn = -1;
  gameId =undefined;
}


function attachListeners(){
  $('td').click(function(){
    var clean = '';
    message(clean);
    doTurn(this);
  });

  $('#save').click(function(){
    saveGame();
  });

  $('#previous').click(function(){
    getAllGames();
  });

  $("#games").click(function(event) {
  var state = parseState(event)
  swapGame(state, getGameId(event))
  });
};


function doTurn(data){


  var position = data
  checkWinner();
  updateState(position);
  turn++;

};

//////////////    WIN COMBOS  //////////////////

function winCombos(){

  switch(3){

    // All X combos ///
    case $("td[data-x=0]:contains('X')").length:
      return true
      break;
    case $("td[data-x=1]:contains('X')").length:
      return true
      break;
    case $("td[data-x=2]:contains('X')").length:
      return true
      break;
    case $("td[data-x=0][data-y=0]:contains('X'), td[data-x=1][data-y=1]:contains('X'), td[data-x=2][data-y=2]:contains('X')" ).length:
      return true
      break;
    case $("td[data-x=0][data-y=0]:contains('X'), td[data-x=1][data-y=0]:contains('X'), td[data-x=2][data-y=0]:contains('X')" ).length:
      return true
      break;
    case $("td[data-x=0][data-y=1]:contains('X'), td[data-x=1][data-y=1]:contains('X'), td[data-x=2][data-y=1]:contains('X')").length:
      return true
      break;
    case $("td[data-x=0][data-y=2]:contains('X'), td[data-x=1][data-y=2]:contains('X'), td[data-x=2][data-y=2]:contains('X')" ).length:
      return true
      break;
    case $("td[data-x=2][data-y=0]:contains('X'), td[data-x=1][data-y=1]:contains('X'), td[data-x=0][data-y=2]:contains('X')" ).length:
      return true
      break;

      // All O combos //

    case $("td[data-x=0]:contains('O')").length:
      return true
      break;
    case $("td[data-x=1]:contains('O')").length:
      return true
      break;
    case $("td[data-x=2]:contains('O')").length:
      return true
      break;
    case $("td[data-x=0][data-y=0]:contains('O'), td[data-x=1][data-y=1]:contains('O'), td[data-x=2][data-y=2]:contains('O')" ).length:
      return true
      break;
    case $("td[data-x=0][data-y=0]:contains('O'), td[data-x=1][data-y=0]:contains('O'), td[data-x=2][data-y=0]:contains('O')" ).length:
      return true
      break;
    case $("td[data-x=0][data-y=1]:contains('O'), td[data-x=1][data-y=1]:contains('O'), td[data-x=2][data-y=1]:contains('O')").length:
      return true
      break;
    case $("td[data-x=0][data-y=2]:contains('O'), td[data-x=1][data-y=2]:contains('O'), td[data-x=2][data-y=2]:contains('O')" ).length:
      return true
      break;
    case $("td[data-x=2][data-y=0]:contains('O'), td[data-x=1][data-y=1]:contains('O'), td[data-x=0][data-y=2]:contains('O')" ).length:
      return true
      break;
    default:
    return false;
  }
};


function gameData(){
  return {"game":{"state": currentState}};

}

function saveGame(){
  // debugger;
if (gameId){

  $.ajax({
    url: "/games/" + gameId,
    method: "PATCH",
    data: gameData()

  });
} else{
  $.ajax({
     url: "/games",
     method: "POST",
     data: gameData(),
   }).done (function(resp){
       gameId = resp.game.id;
     })
  }
};



var getAllGames = function() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games)
  })
}

var showGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  })
  $("#games").html(dom);
}

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var parseState = function(event) {
  return $(event.target).data("state").split(",")
}
var getGameId = function(event) {
  return $(event.target).data("gameid")
}


var swapGame = function(state, id) {
  placeMarks(state);

  gameId = id;
  turn = findTurn(state);
}

var findTurn = function(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}


var placeMarks = function(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
}




// function getAllGames(){
//
//   var response = [];
//   $.ajax({
//     url: "/games",
//     method: "GET",
//     data: ["game"]
//   }).done (function(resp){
//
//     $.each(resp.games, function(index, cell){
//       response.push(cell.id);
//     })
//     response;
//     $('#games').children().text(response);
//
//   })
// }


function checkWinner(){

  if (winCombos() == true ){
    var mess = "Player " + player() + " Won!";
    gameReset(mess);
  } else if (turn == 9){
    debugger;
    tie();
  }else{
    false
  }
};


function tie() {
  var thereIsATie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      thereIsATie = false;
    }
  });
  if (thereIsATie){
  var mess = "";
  mess = "Tie game";
  gameReset(mess);
}
}




function updateState(position){
  var state = [];
    $(position).text(player());
    checkWinner();
    $('td').each(function(index, cell){

      state.push($(cell).text());
    });
    currentState = state;
};



function player(){
  if (turn % 2 === 0){
    return "X"
  }else{
    return "O"
  }
}

function message(message){
  $('#message').html(message);
}


////////  Resetting Game /////

function gameReset(mess){
  message(mess);
  newGame();
}
