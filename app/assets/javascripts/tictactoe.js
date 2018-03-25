// Code your JavaScript / jQuery solution here
function player() {
    // debugger
    return window.turn%2 === 0 ? 'X':'O';
}

function updateState() {
    
}

function setMessage(message) {
    $('div#message').html(message) ;
}