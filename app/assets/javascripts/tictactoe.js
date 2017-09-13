// Code your JavaScript / jQuery solution here
$(function () {
  $('#save').click(function(event) {
    //prevent form from submitting the default way
    event.preventDefault();
    var values = $(this).serialize();
    debugger;
    var posting = $._method('/games', values);

    posting.done(function(data) {

    });
  });
});

function player(){

}

function updateState() {

}

function message() {

}

function checkWinner() {

}

function doTurn() {

}

function attachListeners() {
  
}
