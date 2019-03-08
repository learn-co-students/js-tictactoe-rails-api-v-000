// Code your JavaScript / jQuery solution here

var turn = 0

// sets the player token to X or O
var player = () => turn % 2 ? 'O' : 'X';

// setMessage() Accepts a string and adds it to the div#message element in the DOM.
var setMessage = (note) => {
  $('#message').html('<p>' + note + '</p>')
}

function updateState(square) {
  debugger
    var token = player()
    $('square').text(token)
}
