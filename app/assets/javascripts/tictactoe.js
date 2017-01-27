$(function() {
  attachListeners();
});

var turn = 0

function doTurn(event) {
  turn += 1
};

function attachListeners() {
  var tdTags = document.getElementsByTagName("td");

  for (var i = 0 ; i < tdTags.length ; i++){
    tdTags[i].addEventListener("click", doTurn(event))
  };
  //$('td').each(function(index, td){
  //  debugger;
  //  $(this).on("click", doTurn(event))
  //})
};



function checkWinner() {

};

function updateState() {

};
