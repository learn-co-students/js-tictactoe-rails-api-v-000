// Code your JavaScript / jQuery solution here
function player(){
    if (isNaN(window.turn) || window.turn == undefined) {
        return "X"
    };
    return window.turn % 2 === 0 ? "X" : "O" ;
}

function updateState(square){
    square = player();
    window.turn += 1
}