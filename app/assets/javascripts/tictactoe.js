$('document').ready(function(){

  attachListeners();
});

var currentState;
var turn = 0;
var gameId;


function attachListeners(){
  $('td').click(function(){
    doTurn(this);
  });

  $('#save').click(function(){
    saveGame();
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

function checkWinner(){
  if (winCombos() == true ){
    message("Player " + player() + " Won!")
    gameReset();
  }else if(turn+1 === 9){
    message("Tie game")
    gameReset();
    return "tie";
  }else{
    return false
  }
};




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

function gameReset(){
  var turn = 0;
  $('td').text('');
}
