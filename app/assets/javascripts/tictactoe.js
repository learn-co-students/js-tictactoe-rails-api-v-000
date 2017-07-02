
$(document).ready(function() {
    $('body').on("click", function (e) {
      if (e.target.dataset) {
        debugger
        e.target.innerHTML = player()
      }
  }); 
});

// $('tr[id^=mytablerow-]').on('click', function(){
//    if ( $('a#action-toggle').text() == 'Enabled' ) {
//        alert('action enabled'); 
//    }
// });

var turn = 0

function updateState() {
   player()
}

function attachListeners() {
}

function message() {

}

function checkWinner() {

}

function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function doTurn() {
  var turn = turn + 1
  updateState()
  checkWinner()
}




