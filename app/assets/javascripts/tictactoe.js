// Code your JavaScript / jQuery solutio

$( document ).ready(function() {
    attachListeners();
});


var turn = 0;
var currentGame;

// GAME WINNING COMBOS
function verticalCheck(){
    if ( $('td')[0].innerHTML === "X" && $('td')[3].innerHTML === "X" && $('td')[6].innerHTML === "X" ||
         $('td')[1].innerHTML === "X" && $('td')[4].innerHTML === "X" && $('td')[7].innerHTML === "X" || 
         $('td')[2].innerHTML === "X" && $('td')[5].innerHTML === "X" && $('td')[8].innerHTML === "X" ||
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
  
// game logic
function isEven(turn) {
    return turn % 2 == 0;
 }

 function player(){
    if (isEven(turn)) {
      return "X"
    } else {
      return "O"
    }
  
  }
 
 function updateState(selector){
   var selector = selector
   $(selector).html(player());
 }

 function setMessage(comment){
    $("#message").html(comment);
  }

  function doTurn(selector){
    updateState(selector);
    turn += 1 ;
    checkWinner();
  }
  
  function clear(){ 
    save()  // save the state of the board - need this to save state of the winning board
    $("td").each(function() {
      ($(this).html("")
    )});
    turn = 0
    currentGame = 0 
  }

  function checkWinner(){
    if (horizontalCheck() === "false" && verticalCheck() === "false" && diagnolCheck()=== "false" && fullBoard() === "true"){
       setMessage("Tie game") 
       clear()
     }
    else if (horizontalCheck() === "true" || verticalCheck() === "true" || diagnolCheck()=== "true") {
       turn -= 1 
       setMessage("Player " + player() + " Won!")
       clear()
    } else {
     return false
    }
   }
   
/////////////////////////////////////////////


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