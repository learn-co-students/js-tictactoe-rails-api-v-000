let turn = 0;
let state = [];
const winning_state = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];

$(function(){
    attachListeners();
})

function attachListeners(){
    $("td").on('click',function(event){
        doTurn(event);
    })
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
            return true;
        } else if (turn > 9) {
            turn = 0;
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