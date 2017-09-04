
turn = 0;
var gamesId = undefined;

function player() {
    return (turn % 2 === 0) ? "X" : "O";
}

function updateState(square) {
    square.innerHTML = player(); 
}

// function message(string) {
window.message = function(output) {
    $("#message").text(output);
}

function currentState() {
    return $("td").map((i, td) => td.innerHTML).get();
}

function checkWinner() {
    var board = currentState();

    const win_combo = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    return ['X', 'O'].some(function(player) {
        if (win_combo.some(function(winner) {
            return winner.every(i => board[i] == player);
        })) {
                message(`Player ${player} Won!`);
                return true;
            }
        return false;
    });
}

function checkWinner2() {
    var board = currentState();

    const win_combo = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    return ['X', 'O'].some(function(player) {
        if (win_combo.some(function(winner) {
            return winner.every(i => board[i] == player);
        })) {
                message(`Player ${player} Won!`);
                return true;
            }
        return false;
    });
}

function doTurn(square) {
    if (square.innerHTML !== '' || checkWinner2()) {
        return;
    }
    updateState(square);
    turn += 1;

    if (checkWinner() === false) { 
        if (turn === 9) {
            message('Tie game.');
            saveGame();
            resetGame();
        }       
    } else {
        saveGame();
        resetGame();
    }
}

$(function () {
    attachListeners();
});

function attachListeners() {
    $("td").on("click", function() {
        window.doTurn(this);
    });

    $('#save').on("click", function() {
        saveGame();
    })
    $('#clear').on("click", function() {
        resetGame();
    })
    $('#previous').on("click", function() {
         $.get('/games').done(function(resp) {
             var buttons = resp.data.map(game => `<button>${game["id"]}</button>`);
            $("#games").html(buttons); 
        });     
    });

    $('#games').on("click", function (e) { 
        $.get(`/games/${e.target.innerHTML}`).done(function(resp) { 
            var state = resp.data.attributes.state;
            $('td').each(function(i, td) {
                td.innerHTML = state[i];
            });
            turn = state.filter(function(turns) {
                 return turns !=""
            }).length;  
            gamesId = resp.data.id;
        });        
    }); 
 }

function saveGame() {
    if (!gamesId) {
     $.post('/games',{ state: currentState()} ).done(function(resp) {
      gamesId = resp.data['id'];
     });
    } else { 
        $.ajax(`/games/${gamesId}`,
        { data: 
            { state: currentState()},
             method: 'PATCH'     });
    }
}

function resetGame() {
     $("td").text("");
     turn = 0;
     gamesId = undefined;
     $('#message').html('');
     $('#games').html('');
}

