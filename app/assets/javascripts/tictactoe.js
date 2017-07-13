// Code your JavaScript / jQuery solution here


turn = 0;
var gameId = undefined
function player() {
    return (turn % 2 === 0) ? "X" : "O"
}

function updateState(td){
    td.innerHTML = player() 
}

// function message(string) {
window.message = function(string) {
    $("#message").text(string)
}

function currentBoard() {
    return $("td").map((i, td) => td.innerHTML).get()
}



function checkWinner(){
    var board = currentBoard();

 const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]    ]

    return ['X', 'O'].some(function(p) {
        if (win.some(function(win_array) {
            return win_array.every(i => board[i] == p)
        })) {
                message(`Player ${p} Won!`);
                return true;
            }
        return false;
    })
}

function winCheck(){
    var board = currentBoard();

 const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]    ]

    return ['X', 'O'].some(function(p) {
        if (win.some(function(win_array) {
            return win_array.every(i => board[i] == p)
        })) {
                message(`Player ${p} Won!`);
                return true;
            }
        return false;
    })
}


function doTurn(td){
    if (td.innerHTML !== '' || winCheck())
        return

    updateState(td)
    turn += 1

    if (checkWinner() === false){ 
        if (turn === 9){
            message('Tie game.')
            saveGame()
            clearGame()
        }        
    } 
    else {
        saveGame()
        clearGame()
    }
}

function clearGame(){
     $("td").text("")
        turn = 0
        gameId = undefined
}


$(function () {
    attachListeners()
});

function attachListeners(){
    $("td").on("click", function() {
        window.doTurn(this);
    });

    $('#save').on("click", function() {
        saveGame();
    })
    $('#clear').on("click", function() {
        clearGame();
    })
    $('#previous').on("click", function() {
         $.get('/games').done(function(response){
             var buttons = response.data.map(g => `<button>${g["id"]}</button>`);
       
            $("#games").html(buttons) 
        })     
    })

    $('#games').on("click", function (event) { 
        $.get(`/games/${event.target.innerHTML}`).done(function(response){ 
            var state = response.data.attributes.state
            $('td').each(function(i, td) {
                td.innerHTML = state[i]
            })
            turn = state.filter(function(t){
                 return t !=""
            }).length  

            gameId = response.data.id
        })        
    })
    
 }



function saveGame(){
    if (!gameId){
    //create game
     var a = $.post('/games',{ state: currentBoard()} );
     a.done(function(response) {
      gameId = response.data['id'];
     })
    }
    else{ //update existing game
        $.ajax(`/games/${gameId}`,
        { data: 
            { state: currentBoard()},
             method: 'PATCH'     });

    }

}




