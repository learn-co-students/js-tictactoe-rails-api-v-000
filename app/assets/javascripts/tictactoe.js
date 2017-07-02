
$(document).ready(function() {
    $('tbody').on("click", function (e) {
      if (e.target.dataset && e.target.innerHTML == "") {
        e.target.innerHTML = doTurn()
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
   return player()
}

function attachListeners() {
}

function message() {
  // $('#message').innerHTML = "message"
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
  checkWinner()
  let playerTurn = updateState()
  turn += 1
  return playerTurn
 }





