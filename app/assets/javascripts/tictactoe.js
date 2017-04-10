var turn = 0;
var winningCombos = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]]
]

$(document).ready( function() {
   attachListeners();
});
  
function attachListeners() {
  $("table").on("click", "td",  function(e){
    target = e.target
    doTurn(target)
    //console.log(e.target); 
    //=> returns clicked cell with data-x and data-y properties
  });

  $('#save').on("click", function() {
    //make AJAX request to post '/games'
  })

  $('#previous').on("click", function() {
    //make AJAX request to get '/games'
  })
}

function player() {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'Y'
  }
}

function doTurn(target) {
  //check that game is not over and that space is not filled, then pass target to updateState
  if ($(target).html() === "" || !$(target).html()) {
    updateState(target);
    turn++;
  } else {
    alert("That spot is occupied.")
  }
}

function updateState(target) {
  $(target).html() = player();
}

function checkWinner() {

}

