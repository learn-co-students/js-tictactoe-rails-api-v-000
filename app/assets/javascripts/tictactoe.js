$( document ).ready(function() {
    attachListeners();
});


var turn = 0 
var currentGame 


function attachListeners(){
  
  //get the data-x and data-y values of the clicked square  - this is a move
  $('td').on("click", function() {
    var x_value = ($(this).data('x'));
    var y_value = ($(this).data('y'));
    var selector =  `[data-x=${x_value}][data-y=${y_value}]`  // per spec format
      doTurn(selector);
    });

  // save your current game event listener
$("#save").click(function() {
    save();
  })

  // get all the old games event listener
  $("#previous").click(function() {
    getAllGames();
  })

  //load an old game to the dom if the old games button was clicked - step 1 
  $("#games").click(function(event) {
    var state = parseState(event)
    swapGame(state, getGameId(event))
  })

 }

 var parseState = function(event) {
  return $(event.target).data("state").split(",")
}
var getGameId = function(event) {
  return $(event.target).data("gameid")
}


// just gets the current state of the board
var getMarks = function() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
}


var save = function(resetCurrentGame) {
  var url, method;
  if(currentGame) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: getMarks()
      }
    },
    success: function(data) {
      if(resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
}

// this fires an ajax get request to pull all the game json
var getAllGames = function() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games)
  })
}

// opens the list of games up for selecting and adds them to the OM
var showGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  })
  $("#games").html(dom);
}

// displays the json of the game board if the specific list item is clicked
var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var swapGame = function(state, id) {
  placeMarks(state);
  currentGame = id;
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






/////////////////////////////////////////////////////////////////////////

/// TIC TAC TOE GAME LOGIC

function isEven(turn) {
   return turn % 2 == 0;
}

function updateState(selector){
  var selector = selector
  $(selector).html(player());
}

function checkWinner(){
 if (horizontalCheck() === "false" && verticalCheck() === "false" && diagnolCheck()=== "false" && fullBoard() === "true"){
    message("Tie game") 
    boardWipe()
  }
 else if (horizontalCheck() === "true" || verticalCheck() === "true" || diagnolCheck()=== "true") {
    turn -= 1   // de-crementing the last turn so we can get the winning mark 
    message("Player " + player() + " Won!")
    boardWipe()
 } else {
  return false
 }
}

function player(){
  // even turns are 0, 2, 4....game starts on zero and an X
  if (isEven(turn)) {
    return "X"
  } else {
    return "O"
  }

}


function doTurn(selector){
  updateState(selector);
  turn += 1 ;
  checkWinner();
}


function message(comment){
  $("#message").html(comment);
}


function boardWipe(){ 
  save()  // save the state of the board - need this to save state of the winning board
  $("td").each(function() {
    ($(this).html("")
  )});
  turn = 0
  currentGame = 0 
}


// GAME WINNING COMBOS
function verticalCheck(){
  if ( $('td')[0].innerHTML === "X" && $('td')[3].innerHTML === "X" && $('td')[6].innerHTML === "X" ||
       $('td')[1].innerHTML === "X" && $('td')[4].innerHTML === "X" && $('td')[7].innerHTML === "X" || 
       $('td')[2].innerHTML === "X" && $('td')[5].innerHTML === "X" && $('td')[8].innerHTML === "X" ||
       // check the O's for the same 
       $('td')[0].innerHTML === "O" && $('td')[3].innerHTML === "O" && $('td')[6].innerHTML === "O" ||
       $('td')[1].innerHTML === "O" && $('td')[4].innerHTML === "O" && $('td')[7].innerHTML === "O" || 
       $('td')[2].innerHTML === "O" && $('td')[5].innerHTML === "O" && $('td')[8].innerHTML === "O" )
  {
       return "true"
  } else {
       return "false"
  }
}

function diagnolCheck(){
  if ( $('td')[0].innerHTML === "X" && $('td')[4].innerHTML === "X" && $('td')[8].innerHTML === "X" || 
       $('td')[2].innerHTML === "X" && $('td')[4].innerHTML === "X" && $('td')[6].innerHTML === "X" ||
       // check the O's for the same
       $('td')[0].innerHTML === "O" && $('td')[4].innerHTML === "O" && $('td')[8].innerHTML === "O" || 
       $('td')[2].innerHTML === "O" && $('td')[4].innerHTML === "O" && $('td')[6].innerHTML === "O" )
  {
      return "true"
  } else {
      return "false"
  }
}

function horizontalCheck(){
  if ( $('td')[0].innerHTML === "X" && $('td')[1].innerHTML === "X" && $('td')[2].innerHTML === "X" ||
       $('td')[3].innerHTML === "X" && $('td')[4].innerHTML === "X" && $('td')[5].innerHTML === "X" || 
       $('td')[6].innerHTML === "X" && $('td')[7].innerHTML === "X" && $('td')[8].innerHTML === "X" ||
       // check the O's for the same 
       $('td')[0].innerHTML === "O" && $('td')[1].innerHTML === "O" && $('td')[2].innerHTML === "O" ||
       $('td')[3].innerHTML === "O" && $('td')[4].innerHTML === "O" && $('td')[5].innerHTML === "O" || 
       $('td')[6].innerHTML === "O" && $('td')[7].innerHTML === "O" && $('td')[8].innerHTML === "O" )
  {
       return "true"
  } else {
       return "false"
  }
}


function fullBoard() {
  if ( $('td')[0].innerHTML === "" || $('td')[1].innerHTML === "" ||
       $('td')[2].innerHTML === "" || $('td')[3].innerHTML === "" ||
       $('td')[4].innerHTML === "" || $('td')[5].innerHTML === "" ||
       $('td')[6].innerHTML === "" || $('td')[7].innerHTML === "" ||
       $('td')[8].innerHTML === "" ){
    return "false"
  } else {
    return "true"
  }
}





