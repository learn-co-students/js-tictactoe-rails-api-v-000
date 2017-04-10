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
  doTurn(e.target)
    console.log(e.target); 
    //=> returns clicked cell with data-x and data-y properties
  });

  $('#save').on("click", function() {
    //make AJAX request to post '/games'
  })

  $('#previous').on("click", function() {
    //make AJAX request to get '/games'
  })
}

function doTurn(target) {

}

function updateState() {

}

function checkWinner() {

}

function player() {

}