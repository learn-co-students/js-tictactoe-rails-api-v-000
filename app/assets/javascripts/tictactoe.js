  var turn = 0;

   var player = function(){
    if (turn % 2 == 0){
      return "X";
    }
    else {
      return "O";
    }
  }

  var doTurn = function(event){
    updateState(event);
    turn += 1;
  }

  function attachListeners(){
    $("tbody").on("click", function(event){
      doTurn(event)
    });
  }

  var updateState = function(event){
    $(event.target).html(player());
  }


$(function(){
  attachListeners();
  });


// need a function to call in the html that decides what turn it is and then returns X or O 
// call checkWinner function to see if someone has won  or check tie. 
// if they win or tie then you need to save the game and then reseet the game