//var token = player();

$(function() {
  attachListeners();
})

function attachListeners() {
$(document).on("click","td", function(e){
    console.log($(this).attr('data-x'))
    //yes! this works!
});
}
/*
function doTurn() {
  turn = 0;
  updateState();
  turn++;
}

function checkWinner() {

}

function updateState() {
  if ($(target).value() === "") {
    $(target).html = token;
  } else {
    message();
  }
}

function player() {
  if (turn % 2 == 0) {
    return 'X'; //X is first player
  } else {
    return 'O';
  }
}

function message() {

}
*/