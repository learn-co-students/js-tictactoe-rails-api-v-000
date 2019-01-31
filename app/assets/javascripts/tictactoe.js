// Code your JavaScript / jQuery solution here

var turn = 0;
var currentGame = 0;

// WIN_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]
// ];

  $(document).ready(function() {
    attachListeners()
  });

  function attachListeners() {
    // attach listener on click of a square in 'td'
    $('td').on('click', function(e){
      e.preventDefault();

      // if no text in the square and no winner
      if(!$.text(this) && !checkWinner()) {
        // call the turn function
        doTurn(this);
      }
    });
    // add click events for save, previous and clear

    $('#save').on('click',() => saveGame());
    $('#previous').on('click',() => previousGames());
    $('#clear').on('click',() => resetBoard());
  };

 function player() {
   return turn % 2 === 0 ? "X" : "O"
 };


 function doTurn(square) {
   updateState(square)
   turn++;
   if(checkWinner()) {
     saveGame();
     resetBoard();
   }else if(tieGame()){
       setMessage("Tie game.");
       saveGame();
       resetBoard();
     }
   };

 function updateState(square) {
   let token = player();
   $(square).text(token);
 };

 function setMessage(message) {
   $("#message").text(message)
 };


 function checkWinner() {
   const WIN_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]
   ];

   var board = {};
   var winner = false;

   $('td').text((index, square) => board[index] = square);

   WIN_COMBOS.forEach(function(combo) {
     if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
       setMessage(`Player ${board[combo[0]]} Won!`);
       return winner = true;
     }
   });
   return winner;
 };


  function tieGame(){
      if(turn === 9){
      saveGame();
      return true;
   };
 };

  function saveGame() {
    var state = [];
    var gameData;

    // grab the text that's in the square
    $('td').text((index, square) => {
    // push the text that's in the square into the state array
      state.push(square);
  });
  // put current game's status into gameData hash
    gameData = {state: state};

    if(currentGame){
      $.ajax({
      type: "PATCH",
      url:`/games/${currentGame}`,
      data:gameData
    });
  }else{
  $.post("/games", gameData, function(game){
    currentGame = game.data.id
    $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id} </button><br>`);
    $(`#gameid-${game.data.id}`).on('click',() => getGame(game.data.id));
  }
)}
};

  function getGame(gameid) {
    // get JSON object and then store that game's state/status
    $.get(`/games/${gameid}`, function(game){
        state = game.data.attributes.state;

        // add state to game
        $.map($('td'), function(square, i) {
          square.innerHTML = state[i];
        });
        // set currentGame based on game selected so can go back to game and continue play
        currentGame = gameid;
        // need correct turn so player picks up where left off on same game
        turn = state.join("").length
      })
    };

  function resetBoard() {
      $('td').empty();
      turn = 0;
      currentGame = 0;
  };

  function previousGames() {
    // empty list of games
      $('#games').empty();
      // request for JSON object
      $.get('/games', (savedGames) => {
        // save the response in savedGames
          if (savedGames.data.length) {
              savedGames.data.forEach(game => {
                // if there are games iterate through to assign game id to the buttons
                  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
                  $(`#gameid-${game.id}`).on('click', () => getGame(game.id));
              })
          }
      })
  }
