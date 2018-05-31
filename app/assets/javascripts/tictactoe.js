//why does this not work with const???
var WINNERS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(document).ready(function(){
    attachListeners();
})

function player() {
    let p = oddOrEven(turn);
    return p;
}

function oddOrEven(num){
    if(num % 2 == 0)
        return "X";
    return "O";
}

function updateState(square) {
    let p = player()
    $(square).text(p)
}

function setMessage(winner) {
    $('#message').text(winner)
}

function checkWinner() {
    let board = {};
    let winner = false;
    $('td').text((index, square) => board[index] = square);
    WINNERS.some(function(combo) {
        if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
          setMessage(`Player ${board[combo[0]]} Won!`);
          return winner = true;
        }
      });
    return winner;
}

function doTurn(square) {
    updateState(square);
    turn++;
    if (checkWinner()) {
        saveGame();
        resetBoard();
    } else if (turn === 9) {
        setMessage("Tie game.")
        saveGame();
        resetBoard();
    }
}

function resetBoard() {
    $('td').empty();
    turn = 0;
    currentGame = 0;
}

function attachListeners() {
    $('td').on('click', function(){
        if (!$.text(this) && !checkWinner()) {
            doTurn(this);
        }
    });
    $('#save').on('click', function(){
        saveGame();
    });
    $('#previous').on('click', function(){
        showPreviousGames();
    });
    $('#clear').on('click', function() {
        resetBoard();
    })
}

function saveGame() {
    let state = [];
    let currentData;

    //get board info and put into state array
    $('td').text(function(index, square) {
        state.push(square);
    });
    //put the entire state array into the data object
    currentData = {state: state };
    // if this is the first game, currentGame will be zero, and do a post.  If currentGame has value (not first game), do a patch
    if (currentGame) {
    // see this for patch info syntax https://stackoverflow.com/questions/11461414/ajax-json-doesnt-get-sent-in-patch-only/13439828
        $.ajax({
            url: `/games/${currentGame}`,
            data: currentData,
            type: 'PATCH',
            contentType : 'application/json'
        });
    } else {
        // do an ajax post
        $.post('/games', currentData, function(game) {
            currentGame = game.data.id;
            $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
            $("gameid-" + game.data.id).on('click', function () {
                loadGame(game.data.id)
            })
        });
    };
}

function loadGame(theId) {
    //empty message div
    $('#message').empty();
    $.get(`/games/${theId}`, function(data) {
        var currentId = data.data.id;
        var currentState = data.data.attributes.state;
   
        let i = 0;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                $(`[data-x="${x}"][data-y="${y}"]`).html(currentState[i])
                i++;
            }
        }

        // get the turn count by adding up the number of filled in boxes in the array
        turn = currentState.join('').length;
        //get the current id from the ajax request, and change the global variable
        currentGame = currentId;

        if (!checkWinner() && turn === 9) {
            setMessage("Tie game.")
        }
    });
}

function showPreviousGames() {
    $('#games').empty();
    $.get("/games", function(games){
        if (games.data.length) {
            games.data.forEach(function(game){
                var gameHTML = `<button id="gameId-${game.id}">${game.id}</button><br>`
                $('#games').append(gameHTML)
                $(`#gameId-${game.id}`).on('click', function(){
                    loadGame(game.id)
                });
            });
        }; 
    });
}




