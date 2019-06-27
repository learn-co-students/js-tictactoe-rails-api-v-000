// Code your JavaScript / jQuery solution here
let turn_count = 0;

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
    
}