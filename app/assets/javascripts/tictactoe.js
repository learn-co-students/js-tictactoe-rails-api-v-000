var currentGame = 0
const WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

$(document).ready(function() {
    attachListeners();
});  

var player = () => turn % 2 ? 'O' : 'X';

//The $ is a shortcut for jQuery, and provides an interface to the library.
var updateState = (td) => $(td).text(player());

var setMessage = (str) => $('#message').text(str);

function checkWinner() {
    var board = {};
    let result = false;
    $('td').text((index, box) => board[index] = box);
    WIN_COMBINATIONS.forEach(function(place) {
        if ((board[place[0]]).length !== 0 && board[place[0]] === board[place[1]] && board[place[1]] === board[place[2]] ) {
            setMessage(`Player ${board[place[0]]} Won!`)
            return result = true;
        } 
    });
    return result;
}

function doTurn(move) { 
    updateState(move);
    turn++;
    if (checkWinner() === true || tiedGame()) {
        turn = 0;
        $('td').empty();
    } 
}

function tiedGame () {
    let response;
    turn === 9 ? response = true && setMessage("Tie game.") : response = false;
    return response;
}

function attachListeners() {
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
            doTurn(this);
        }
    });

    $('#save').on('click', () => saveGame());
    $('#previous').on('click', () => previousGames());
    $('#clear').on('click', () => clearBoard());
 }

 function clearBoard() {
    $('td').empty();
 }

function saveGame() {
    const state = [];
    $('td').text((index, place) => {
        state.push(place);
    });
    const gameData = { state: state };
    if (currentGame) {
        $.ajax({
            type: 'PATCH',
            url: `/games/${currentGame}`,
            data: gameData
        });
    } else {
        $.post('/games', gameData, function(game) {
            currentGame = game.data.id;
            // $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
            // $("#gameid-" + game.data.id).on('click', () => clearBoard(game.data.id));
        });
    };
}
  
function previousGames() {
    $("div#games").html('');
    $.get('/games', function(games) {
        if (games.data.length > 0) {
            games.data.forEach(function(game){
                var id = game["id"];
                var button = '<button id="game-' + id + '">' + id + '</button>'
                $("div#games").append(button);
                $(`#game-${id}`).on('click', () => loadGame(id));
            });
        }
    })
}

function loadGame(id){
    $.get(`/games/${id}`, function(game) {
        state = game.data.attributes.state
        boxes = document.querySelectorAll("td")
        currentGame = id;
        turn = state.join("").length;
        var i = 0;
        boxes.forEach(function(box) {
            box.innerHTML = state[i];
            i++;
        })
    })
}