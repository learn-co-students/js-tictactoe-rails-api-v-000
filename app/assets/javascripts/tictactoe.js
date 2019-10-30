var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
[1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var currentGame = 0;
var turn = 0;

$(function(){
    attachListeners();
});


var player = () => { 
    return turn % 2 === 0 ? "X" : "O";
}

var updateState = (square) => {
    var character = player();
    $(square).text(character);
}

var setMessage = (message) => {
    $("div#message").text(message);
}
function checkWinner() {
    var board = {};
    var winner = false;
  
    $('td').text((index, square) => board[index] = square);
  
    WINNING_COMBOS.some(function(group) {
      if (board[group[0]] !== "" && board[group[0]] === board[group[1]] && board[group[1]] === board[group[2]]) {
        setMessage(`Player ${board[group[0]]} Won!`);
        return winner = true;
      }
    });
  
    return winner;
}

// function boardNotFull(){
//     var board = [];
//     $('td').text((index, square) => board[index] = square);
//     return board.some(function(character){
//         if(character === ""){
//             return true;
//         }
//     });

// }
function doTurn(square) {
    updateState(square);
    turn++;
    if (checkWinner()) {
      saveBoard();
      resetBoard();

    } else if (turn === 9) {
      setMessage("Tie game.");
      saveBoard();
      resetBoard();
    }
  }
function resetBoard(){
    turn = 0;
    $('td').empty();
    currentGame = 0;
}
function attachListeners() {
    $('td').on('click', function() {
      if (!$(this).text() && !checkWinner()) {
        doTurn(this);
      }
    });
  
    $('#previous').on('click', () => {
        showGamesIndex()});
    $('#clear').on('click', () => {
        resetBoard()});
    $('#save').on('click', () => {
        saveBoard();
    });
  }

function saveBoard(){
    var stateArray = [];
    var gameData;
  
    $('td').text((index, square) => {
      stateArray.push(square);
    });
   
    if (currentGame) {
      $.ajax({
        type: 'PATCH',
        url: `/games/${currentGame}`,
        data: { state: stateArray }
      });
    } else {
      $.post('/games', { state: stateArray }, function(game) {
        currentGame = game.data.id;
        $('div#games').append(`<BUTTON id="gameid-${game.data.id}">${game.data.id}</BUTTON><br>`);
        $("BUTTON#gameid-" + game.data.id).on('click', () => {reloadGame(game.data.id)});
      });
    }
}
function reloadGame(gameID) {
    setMessage("");
    $.get("/games/" + gameID, function(response){
        stateArray = response.data.attributes.state;
        id = response.data.id;
        let index = 0;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = stateArray[index];
                index++;
            }
        }

        turn = stateArray.join('').length;
        currentGame = id;

        if (!checkWinner() && turn === 9) {
            setMessage('Tie game.');
        }
    });    
}

function showGamesIndex(){
    $('div#games').empty();
    $.get("/games", function(response){
        if (response.data.length){
            response.data.forEach(game => {
                $('div#games').append(`<BUTTON id="gameid-${game.id}">${game.id}</BUTTON><br>`);
                $("BUTTON#gameid-" + game.id).on('click', () => {reloadGame(game.id)});
            });
        }
    })
}

