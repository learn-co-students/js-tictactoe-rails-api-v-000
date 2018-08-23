// Code your JavaScript / jQuery solution here
$(document).ready(function() {
        attachListeners();
      });

      let turn = 0
      let currentGame = 0
      

    function player(){
        return (turn % 2 ? 'O' : 'X')
    }

    function doTurn(square){
        updateState(square);
        turn++; 
        if (checkWinner()){
            saveGame();
            resetBoard();
        }else if (turn === 9){
            //debugger
            setMessage("Tie game.");
            saveGame();
            resetBoard();
        }
    }

    function setMessage(message){
        $('#message').text(message)
    }

    function checkWinner() {
        let board = {};
        let winner = false;
        const winning_combos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
      
        $('td').text((index, square) => board[index] = square);
      
        winning_combos.some(function(combo) {
          if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
            setMessage(`Player ${board[combo[0]]} Won!`);
            return winner = true;
          }
        });

        return winner;
    }

    function resetBoard(){
        $('td').empty()
        turn = 0
        currentGame = 0
    }

    function updateState(square){
        let token = player()
        $(square).text(token)
    }

    function saveGame() {
        let state = Array.from($('td'), e => e.innerText);
        if (currentGame) {
            $.ajax({
            type: 'PATCH',
            url: `/games/${currentGame}`,
            dataType: 'json',
            data: {state: state}
            });
        } else {
            debugger
            $.post('/games', {state: state}, function(game) {
            currentGame = parseInt(game.data.id);
            });
        };
    };

    function showPreviousGames(){
        $('#games').empty()
        $.get('/games', function(games) {
            games.data.map(function(game) {
                //debugger
                $('#games').append(`<button id="gameid-${game.id}">Game: ${game.id}</button><br>`);
                $("#gameid-" + game.id).click(() => loadGame(game.id));
            })
        })
    }

    function loadGame(gameId) {
        //debugger
        $('#message').text("");
        const id = gameId;
        $.get(`/games/${gameId}`, function(game) {
            let state = game.data.attributes.state;
            $('td').text((index, token) => state[index]);
            currentGame = id;
            turn = state.join('').length
            checkWinner();
        });
    };
        

    function attachListeners() {
        $('td').on('click', function() {
          if (!$.text(this) && !checkWinner()) {
            doTurn(this);
          }
        });
      
        $('#save').on('click', () => saveGame());
        $('#previous').on('click', () => showPreviousGames());
        $('#clear').on('click', () => resetBoard());
}