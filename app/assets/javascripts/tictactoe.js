// Code your JavaScript / jQuery solution here
var turn = 0;

$(document).ready(function() {
  console.log("ready!");
  // let turn = 0;
  saveGame();
});

function player() {
  return turn % 2 === 0 ? "X" : "O";
}



function saveGame() {
  $("#save").on('click', function() {
    $.post('/games', { 'state[]': [ "", "", "", "", "", "", "", "", ""] })
  });
}
