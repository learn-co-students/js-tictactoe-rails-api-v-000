// Code your JavaScript / jQuery solution here

var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;
var currentGameId = null;

$(document).ready(function() 
    {
        attachListeners();
    }
);

function player()
{
    if (turn % 2)
    {
        return 'O';
    }
    else
    {
        return 'X';
    }
}

function updateState(square)
{
    $(square).text (player());
}

function setMessage(message)
{
    $('#message').text(message);
}

function checkWinner()
{
    var board = [];
    var winnerFlag = false;

    $('td').text(function(index, square) {board.push(square)});
    //e.g ["X", "", "", "", "O", "", "", "X", ""]

    for ( var i = 0; i<WINNING_COMBOS.length; ++i)
    {
        var combo = WINNING_COMBOS[i];
        
        if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[0]] == board[combo[2]])
        {
            winnerFlag = true;
            setMessage('Player ' + board[combo[0]] + ' Won!');
            break;
        }
    }
    return winnerFlag;
}

function doTurn(square)
{
    updateState(square);
    turn++;
    //invokes checkWinner
    if( checkWinner())
    {
        saveGame();
        resetGame();
    }
    else if (turn ==9) //if it's a tie
    {
        setMessage("Tie game.");
        saveGame();
        resetGame();
    }
}

function attachListeners()
{
    $('td').on('click', function(){
        //only do the turn if the square was empty and the game isn't over
        if(!$.text(this) && !checkWinner())
        {    
            doTurn(this);
        }
    });

    $('#clear').on('click', () => resetGame());
    $('#save').on('click', () => saveGame());
    $('#previous').on('click', () => listSavedGames());
}
function updateState(square)
{
    $(square).text(player());
}
function resetGame()
{
    turn = 0;
    $('td').empty();
    currentGameId = null;

}
function saveGame()
{
    var board = [];

    $('td').text(function(index, square) {board.push(square)});
    // console.log(currentGameId);
    if(currentGameId) //update a game
    {
        // console.log("patch");
        $.ajax({
            type: 'PATCH',
            url: `/games/${currentGameId}`,
            data: {state: board}
        });

    }
    else    // save a new game and add reload the list of games so it includes the new one
    {   
        // console.log("posting")
        $.post('/games', {state: board}, function(game)
        {
            // console.log(game.data);
            listSavedGames();
            currentGameId = game.data.id;
        });
       
    }
   
}
function listSavedGames()
{
    $('#games').empty();
    $.get('/games', 
        (savedGames) => {
            savedGames.data.forEach(gameData =>
                {
                    $('#games').append(`<button id="${gameData.id}">${gameData.id}</button><br>`);
                    $(`#${gameData.id}`).on('click', () => loadGame(gameData.id));
                });
        }
    );
}
function loadGame(gameId)
{
    // console.log(`game ${gameId}`);
    currentGameId = gameId;
    
    document.getElementById('message').innerHTML = '';

    const req = new XMLHttpRequest;
    req.open('GET', `/games/${gameId}`, true);
    req.addEventListener('load', populateBoard);
    req.send();
}
function populateBoard()
{
    // console.log(this.responseText);
    const data = JSON.parse(this.responseText).data;
   
    currentGameId = data.id;
    const state = data.attributes.state;
    turn = state.filter(Boolean).length;
    
    var index = 0;
    for (var  y = 0; y < 3; y++) 
    {
        for (var x = 0; x < 3; x++) 
        {
            document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
            index++;
        }
    }

    if (!checkWinner() && turn === 9) 
    {
        setMessage('Tie game.');
    }

}