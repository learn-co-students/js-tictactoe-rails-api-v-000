var turn = 0;
var gameId = 0;

const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

$(function () {
    attachListeners()
});

function attachListeners() {
    $('td').on('click', function() {
        if(!$.text(this) && !checkWinner()) {
            doTurn(this);
        }    
    });

    $('#save').on('click', function() {
        saveGame()
    })

    $('#previous').on('click', function(){
        previousGames()
    })

    $('#clear').on('click', function(){
        resetBoard()
    })
}

// need to build a function that adds count to turn after every move in order for this to work
function player() {
    if (turn % 2 === 0) {
      return "X"
    } else {
      return "O"
    }
  }
  

function updateState(square) {
    square.innerHTML = player()
}

function setMessage(string) {
    $('#message').text(string)
}

function checkWinner() {
    let winner = false
    boardValues = Array.from($('td')).map(e => e.innerHTML)
    winCombinations.some(winCombo => { 
        if (boardValues[winCombo[0]] !== "" && boardValues[winCombo[0]] === boardValues[winCombo[1]] && boardValues[winCombo[1]] === boardValues[winCombo[2]] ) {
            setMessage("Player " + boardValues[winCombo[0]] + " Won!")
            return winner = true
        }
    })
    return winner
}

function doTurn(square) {
    updateState(square)
    turn += 1

    if (checkWinner()) {
        saveGame()
        clearBoard()
    } else if (turn === 9){
        setMessage("Tie game.")
        saveGame()
        clearBoard()
    }
}

function clearBoard() {
    $('td').empty();
    turn = 0;
    gameId = 0;
}

function resetBoard() {
    $('td').empty();
    $('#message').empty();
    $('#games').empty();
    turn = 0;
    gameId = 0;
  }

function saveGame() {
    gameState = Array.from($('td')).map(e => e.innerHTML)
    gameData = {state: gameState}
    if (gameId !== 0) {
        $.ajax({
        type: "PATCH",
        url: `/games/${gameId}`,
        data: gameData 
        })
    } else {
        $.post('/games', gameData, function(game){
            gameId = game.data.id
            $('#games').append(`<button data-id=${gameId} onclick="getGame(${gameId})">Game ${gameId}</button><br>`)
        })
    }
}

function previousGames() {
    $.get('/games', function(games){
        let gameIds = games.data.map(game => `<button data-id=${game.id} onclick="getGame(${game.id})">Game ${game.id}</button><br>`)
        $('#games').html(gameIds)
    })
}

function getGame(id) {
    $.get(`/games/${id}`, function(game){
        let state = game.data.attributes.state 
        let tds = Array.from($('td')).map(e => e.innerHTML)

        $('td').text(function(i) {
                return state[i]
            })  
        
        // for(let i = 0; i < state.length; i++){
        //     tds[i] = state[i]
        // }

        
        turn = state.filter(e => e !== "").length
        gameId = game.data.id
    })
}