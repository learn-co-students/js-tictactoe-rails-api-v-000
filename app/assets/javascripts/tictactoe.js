let turn = 0;
let state = [];
let id = null;
const winning_state = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];

$(function(){
    newGame();
    attachListeners();
})

function newGame(){
    turn = 0;
    state = [];
}

function attachListeners(){
    $("td").on('click',function(event){
        doTurn(event);
    })

    $("#save").on('click', function(){
        saveGame();
    })

    $("#previous").on('click', function(event){
        listGames(event);
    })
}

function listGames(e){
    let list = '<ul>'
    $.get('/games', function(data){
        games = data["games"]
        games.forEach(function(game){
            if (game["state"]) {
            list += '<li class="game">' + game["id"] + '</li>'
            }
        })
    }).done(function(){
        list += '</ul>'
        $("#games").html(list)
        $(".game").on('click', function(event){
            loadGame(parseInt(this.innerText));
        })
    })
    
    
}

function loadGame(id){
    alert("Loading game " + id)
}

function saveGame(){
    if (id){
        $.post('/games/' + id, { _method: 'PATCH', game: {state: state}} );
    } else {
        $.post('/games',{ game: {state: state}}, function(data){
            id = data["game"]["id"]
        })        
    }
}
function doTurn(event){
    turn += 1;
    updateState(event);
    checkWinner();
}

function checkWinner(){
    winning_state.some(function(combo){
        var p = player();
        if (state[combo[0]] == p && state[combo[1]] == p && state[combo[2]] == p){
            message("Player " + p + " Won!");
            newGame();
            return true;
        } else if (turn > 9) {
            newGame();
            message("Draw");
            return true;
        }
    })
}

function message(str){
    $("#message").text(str);
}

function updateState(event){
    let piece = player();
    let space = $(event.target);
    let n = parseInt(space.data("x")) * 3 + parseInt(space.data("y"))
    state[n] = piece;
    space.text(piece);

}

function player(){
    if (turn % 2 === 0){
        return "X"
    } else {
        return "O"
    }
}