$(document).ready(() => {
  attachListeners();
});


var WIN_COMBOS =  [[0,1,2],
                   [3,4,5],
                   [6,7,8],
                   [0,3,6],
                   [1,4,7],
                   [2,5,8],
                   [0,4,8],
                   [6,4,2]];

var turn = 0



function player() {
  return turn % 2 == 0 ? "X" : "O";
};


function updateState(box){
  $(box).text(player());
};


function setMessage(string){
  $("#message").text(string);
}


function checkWinner(){
 var board = {};
 var winner = false;

 $('td').text ((index, box) => board[index] = box);

 WIN_COMBOS.forEach(function(combo){
   if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== ""){
     setMessage(`Player ${board[combo[0]]} Won!`);
     return winner = true;
   }
 });
 return winner;
}



function doTurn(box){
  turn++;
  updateState(box)
  if(checkWinner()) {
    saveGame();
    resetBoard();
  } else if(tieGame()){
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
};



function tieGame(){
  if(turn === 9){
    saveGame();
    return true;
  };
};


function saveGame(){
  var state = [];
  var gameData;
  // grab the text that's in the square
  $('td').text((index, square) => {
    //push the text that's in the square into the state array
    state.push(square);
  });
  //put current game's status into gameData hash
  gameData = {state: state};
  if(currentGame){
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post("/games", gameData, function(game){
      currentGame = game.data.id
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button></br>`);
      $(`#gameid-${game.data.id}`).on('click', () => getGame(game.data.id));
    }
  )}
};
