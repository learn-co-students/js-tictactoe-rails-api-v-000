let turn = 0

$(document).ready(function(){
  attachListeners();
  $('#save').click(saveGame);
  $('#previous').click(prevButton);
  $('#clear').click(clearButton);
});

// HELPER FUNCTIONS

//attaches click event listeners
function attachListeners(){
  $('td').click(function(){
    if(!checkWinner() && !checkTie()){
      doTurn(this);
    }}
  )
}

//determines player based on turn
function player(){
  return turn % 2 ? 'O' : 'X';
}

//updates player token
function updateState(position){
  position.innerHTML = player();
}

//sets message based on submitted string
function setMessage(string){
  $("#message").text(string);
}

// responsible for each turn in game
function doTurn(position){
  if (position.innerHTML === ""){
    // Updates board based on clicked element and increases turn counter
    updateState(position);
    turn++;

    //checks for win or tie and resets board/set's message if either state is met
    if(checkWinner()){
      saveGame();
      resetBoard();
    } else if (checkTie()){
      setMessage("Tie game.");
      saveGame();
      resetBoard();
    }
  }
}

//compares current board against winning board combinations
function checkWinner(){
  let winningBoard = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let currentBoard = $('td');

  //iterates through winning board combos, checking to see if any board matches are present.
  //if so, sets message and returns true

  return winningBoard.some(function(currentVal) {
		if (currentBoard[currentVal[0]].innerHTML === currentBoard[currentVal[1]].innerHTML && currentBoard[currentVal[1]].innerHTML === currentBoard[currentVal[2]].innerHTML && currentBoard[currentVal[0]].innerHTML !== "") {
      setMessage(`Player ${currentBoard[currentVal[0]].innerHTML} Won!`);
      return true;
		}
	})
}

//checks to see if turn counter reaches 9 (max turns)
function checkTie(){
  return turn === 9;
}


// resets turn counter and empties all board elements
function resetBoard(){
  $('td').empty();
  $("#games").removeClass();
  turn = 0;
}


//EVENT LISTENERS

function saveGame(){
  boardState = [];
  //push current board state to array for post and patch requests
  $('td').each(function(){
    boardState.push(this.innerHTML);
  });
  if ($('#games')[0].className === ""){
  	//post request for new game
    $.ajax({
      type: 'POST',
      url: '/games',
      data: {state: boardState}
    }).done(function(data) {
    	var id = data.data.id;
    	$("#games").removeClass().addClass(`${id}`);
    })
  } else {
  	//Patch request to update game
    var id = $('#games')[0].className
    $.ajax({
      url: `/games/${id}`,
      data: {state: boardState},
      type: 'PATCH'
    })
  }


}

function prevButton(){
  getPreviousGames();
}

function getPreviousGames(){
  $.get("/games", function (gameObj) {
    //if any previously saved games exist, append a ul and populate with games list indeces
    if (gameObj.data.length > 0){
    	$('#games').empty();
      gameObj.data.forEach(function(game){
        //append each saved game, adding custom id
        $('#games').append(`<button id="game-${game.id}"> ${game.id} </button>`);
        //add click listener to each li item, which triggers a game load to the board
        $(`#game-${game.id}`).click({id: game.id}, function(){
          $("#games").removeClass().addClass(`${game.id}`)
        	$.get('/games/' + game.id, function(data) {
        		var arr = data.data.attributes.state;
        		populateBoard(arr);
        	})
        });
      });
    }})
}

function populateBoard(arr) {
  turn = 0;
  for (let i = 0; i < 9; i++) {
    var squares = $('td');
    if (arr[i] !== ""){
      turn++;
    }
    squares[i].innerHTML = arr[i];
  }
}

function clearButton(){
  resetBoard()
}
