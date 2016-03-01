$(document).ready(function(){
  doTurn();
});

function attachListeners() {

}

function doTurn() {
  updateState();
}

// function player(num) {
//   if(num % 2 == 0) {
//     $(this).text('O');
//   } else {
//     $(this).text('X');
//   }
// }

function updateState() {
  var num = 1;
  $("td").click(function(){
    if($(this).html() == '' && (num % 2 == 0)) {
       $(this).text("X");
    } else if ($(this).html() == '' && (num % 2 != 0)){
       $(this).text("O");
    } else {
      alert("This position is taken.");
    }
    num += 1;
  });
}

function checkWinner() {

}

function message() {

}
