//var token = player();

$(function() {
  attachListeners();
})

function attachListeners() {
$(document).on("click","td", function(e){
  coordinate = [$(this).attr('data-x'), $(this).attr('data-y')]
    //yes! this works!
    console.log(coordinate)
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