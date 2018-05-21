//Code your JavaScript / jQuery solution here
  
$(document).ready(function(){
  attachListeners() 
})

var turn = 0;
var currentGameId = 0;
var board = ["", "", "", "", "", "", "", "", "" ]

function player () {
  return turn % 2 === 0 ? "X" : "O"
}
  
function updateState(element) {
  var currentPlayerToken = player()
  element.innerHTML = currentPlayerToken;
} 

function setMessage(string) {
  $("div#message").append(string)
}

function full(array) {
  if($.inArray("", array) === -1) {
    return true
  }else{return false}
}

function getBoard () {
  var currentBoard = [].slice.call($('td')).map(x => x.innerHTML);
  return currentBoard
}

function checkWinner() {
  
  const winCombinations = [
    [0, 1, 2], //top row win
    [3, 4, 5], //Middle row win
    [6, 7, 8], //Bottom row win
    [0, 3, 6], //left column win
    [1, 4, 7], //middle column win
    [2, 5, 8], //right column win
    [0, 4, 8], //left diagonal win
    [2, 4, 6]  //right diagonal win
  ]
  
  var arrayLength = winCombinations.length;
  var result = false
  var board = getBoard()
  for (var i = 0; i < arrayLength; i++) {
    //check if board contain any winCombinations
    
    if ((board[winCombinations[i][0]] === "X" && board[winCombinations[i][1]] === "X" && board[winCombinations[i][2]] === "X") || (board[winCombinations[i][0]] === "O" && board[winCombinations[i][1]] === "O" && board[winCombinations[i][2]] === "O"))  {
      // board = $.Array
      var winningTocken = board[winCombinations[i][0]]
      setMessage(`Player ${winningTocken} Won!`)
      result = true
      saveGame()
    } 
}
  return result 
}

function doTurn (element) {
 
  updateState(element)
  if(full(getBoard())) {
    setMessage("Tie game.")
    saveGame()
  }
  if (checkWinner() || full(getBoard())) {
    turn = 0
    return [].slice.call($('td')).map(x => x.innerHTML = "");
  }
   turn += 1
}

function attachListeners() {
  
   squares = $("td")
    
    for (var i = 0; i < squares.length; i++) {
      
      $(squares[i]).on("click", function(event) {
        
        event.preventDefault();
        
        if (this.innerHTML === "" && !checkWinner()) {
          doTurn(this)  
        }
        
      })//onClick
    }//forloop

    $("#previous").on("click", (event) => {
      //event.preventDefault();
      const gameDiv = $("#games")
      gameDiv.empty()
      
      $.get( "/games", ( games ) => {
        if(games.data.length) {
            games.data.forEach(game => {
            gameDiv.append(`<button id="gameid-${game.id}">${game.id}</button>`)
            $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
          });
        }
      });
    })

    $('#clear').on('click', () => resetBoard());

    $('#save').on('click', (event) => saveGame());
}

function reloadGame(gameID) {
  document.getElementById('message').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => {
    const gameData = JSON.parse(xhr.responseText).data;
    const gameId = gameData.id;
    const state = gameData.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;
    currentGameId = gameId;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGameId = 0;
}

function saveGame() {
  jQuery.ajax({
    type: 'PUT',
    url: '/games/',
    data: data,
    success: function addCell() {

    }
});
}

function saveGame() {
  var state = []

  var squares = $('td')
  squares.text(function(index, square) {
    state.push(square);
  });

  // Create game object to send back to rails api
  var gameData = { state: state }

  if (currentGameId) {
    $.ajax({
      type: 'PATCH',
      url: '/games/' + currentGameId,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game){
      currentGameId = game.data.id
      $("#games").append(`<button id="gameid-${currentGameId}">${currentGameId}</button><br/>`);
      $("#gameid-" + currentGameId).on('click', function(){
        reloadGame(currentGameId);
      });
    });
  }
}


