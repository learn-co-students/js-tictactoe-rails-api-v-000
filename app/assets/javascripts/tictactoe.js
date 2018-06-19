$(document).ready(function () {
    attachListeners();
})

var turn = 0, won, tie = false, currentGame = 0;

function player() {
    if (turn % 2 == 1) {
        return 'O';
    } else {
        return 'X';
    };
};

function updateState(box) {
    $(box).html(player());
};

function setMessage(string) {
    $('#message').html(string);
};

function checkWinner() {
    const combinations = [[0 ,1 ,2], [3 ,4 ,5], [6 ,7 ,8], [0 ,3 ,6], [1 ,4 ,7], [2 ,5 ,8], [0 ,4 ,8], [6 ,4 ,2]];
    const boxes = $('td');
    for (let i = 0; i < combinations.length; i++) {
        const comboArr = combinations[i];
        if (boxes[comboArr[0]].innerHTML == 'X' || boxes[comboArr[0]].innerHTML == 'O') {
            if (boxes[comboArr[0]].innerHTML == boxes[comboArr[1]].innerHTML && boxes[comboArr[1]].innerHTML == boxes[comboArr[2]].innerHTML) {
                setMessage(`Player ${boxes[comboArr[0]].innerHTML} Won!`);
                return true; 
            };
        };
    };
    return false;
};

function doTurn(box) {
    updateState(box);
    turn +=1;
    won = checkWinner();
    if (!won && turn == 9) {
        setMessage('Tie game.')
        tie = true;
    }
    if (won || tie) {
        saveGame();
        resetBoard();
    }
}

function resetBoard() {
    currentGame = 0;
    turn = 0;
    tie = false;
    won = false;
    $('td').html('')
}

function saveGame() {
    const gameState = Array.from($('td')).map(function (box) {
        return box.innerHTML;
    });
    if (currentGame == 0) {
        const respData = $.post('/games', { "state": gameState });
        respData.done(function (data) {
            currentGame = parseInt(data.data.id);
        });
    } else {
        const respData = $.ajax(`/games/${currentGame}`,{
            method: "PATCH",
            data: { "state": gameState }
        });
        respData.done(function (data) {
            currentGame = parseInt(data.data.id);
        });
    };
};

function attachListeners() {
    $('td').click(function (event) {
        if (event.target.innerHTML == '' && !checkWinner()) {
            doTurn(this);
        };
    });

    $('#previous').click(function () {
        $.getJSON('/games', function (respData) {
            let buttons = [];
            $('.previousGame').each(function (i) {
                buttons.push($(this).data("id"));
            });
            for (let i = 0; i < respData.data.length; i++) {
                if (!buttons.includes(parseInt(respData.data[i].id))) {
                    const gameJSON = respData.data[i];
                    $('#games').append(`<button class="previousGame" data-id="${gameJSON.id}">Game ${gameJSON.id}</button>`)
                };
            };
            $('.previousGame').click(function (e) {
                let id = $(this).data("id");
                $.getJSON(`/games/${id}`, function(respData) {
                    $('td').each(function (i) {
                        $(this).html(respData.data.attributes.state[i]);
                    });
                    const pieces = respData.data.attributes.state.filter(function (v) {
                        return v != '';
                    });
                    turn = pieces.length;
                    currentGame = id;
                });
            });
        });
    });

    $('#save').click(saveGame);

    $('#clear').click(function (e) {
        resetBoard();
    });
};






