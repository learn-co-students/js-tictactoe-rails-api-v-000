$( document ).ready(function() {
    attachListeners();
});



var turn = 0 
var currentGame = 0
var gameState = board();

function attachListeners(){
  //get the data-x and data-y values of the clicked square 

  $('td').on("click", function() {
    var x_value = ($(this).data('x'));
    var y_value = ($(this).data('y'));
    var selector =  `[data-x=${x_value}][data-y=${y_value}]`  // per spec format
      doTurn(selector);
    });

  // save your current game 
  $('#save').click(function(event) {
    save();
  });

  // checkout previous game history

    $("#previous").click(function(){
      $.getJSON("/games").success(function(json_games){
        var html = ""
        $.each(json_games.games, function(index, game){
         var id = game.id
         html += `<li><a href="#" class"js-game" data-id="${id}">Game #${id}</a></li>`;
      });
        $("#games").html(html);
      })
    })
  }

function board() {
  allTd = $('td').map(function(index, square) {
    return square.innerHTML;
  });
  return $.makeArray(allTd);
}


function doTurn(selector){
  updateState(selector);
  turn += 1 ;
  checkWinner();
}


function player(){
  // even turns are 0, 2, 4....game starts on zero and an X
  if (isEven(turn)) {
    return "X"
  } else {
    return "O"
  }

}

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
    save(true)
    boardWipe()
  }
 else if (horizontalCheck() === "true" || verticalCheck() === "true" || diagnolCheck()=== "true") {
    turn -= 1   // de-crementing the last turn so we can get the winning mark 
    message("Player " + player() + " Won!")
    save(true)
    boardWipe()
 } else {
  return false
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

function boardWipe(){ 
  turn = 0
  $("td").each(function() {
    ($(this).html("")
  )});
    // ($('#games').append(`<li id>Game ${currentGame}</li>`))
  currentGame = 0 
}


function message(comment){
  $("#message").html(comment);
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
        state: board()
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
};


/// combos for potential wins
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





