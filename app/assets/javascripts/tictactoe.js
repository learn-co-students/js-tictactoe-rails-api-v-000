// Code your JavaScript / jQuery solution here
let turn_count = 0;
const WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

function player() {
    let result;
    turn_count % 2 === 0 ? result = 'X' : result = 'O';
    return result;
}

function updateState(td) {
    //The $ is a shortcut for jQuery, and provides an interface to the library.
    $(td).text(player());
}

function setMessage(str) {
    $('#message').text(str);
}

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
    if (checkWinner() === true) {
        turn = 0;
    } 
    setMessage("Tie game.")
    
}

function attachListeners() {

}