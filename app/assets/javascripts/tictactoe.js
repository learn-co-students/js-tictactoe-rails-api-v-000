$(function() {
  attachListeners();
});

var turn = 0;
var combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

function doTurn(event) {
  updateState(event);
  if(checkWinner()) {

  } else {
    turn += 1;
  }
};
//try .forEach
function attachListeners() {
  //var tdTags = document.getElementsByTagName("td");

  //for (var i = 0 ; i < tdTags.length ; i++){
  //  tdTags[i].addEventListener("click", doTurn(event))
  //};
  $('td').each(function(index, td){ //needed to use an anonymous function, scope issue?
    $(this).on("click", function(){
      doTurn(event);
    })
  });
};

function player() {
  if (turn % 2 == 0) {
    return 'X'
  } else {
    return 'O'
  };
};

function checkCombo(combo, tdArr){
    if ((tdArr[combo[0]] === "X" && tdArr[combo[1]] === "X" && tdArr[combo[2]]) === "X"){
      return true;
    }else if((tdArr[combo[0]] === "O" && tdArr[combo[1]] === "O" && tdArr[combo[2]]) === "O"){
      return true;
    }else{
      return false;
    };
};
function message(text) {
  debugger;
  $('#message').text(text);
}
function checkWinner() {
  var tdArr = []
  $('td').each(function(index, td){
    tdArr.push(td.textContent);
  });

  for(i = 0; i < combos.length; i++){

    if (checkCombo(combos[i], tdArr)){
      message('Player ' + player() + ' Won!')
      return true;
    }
  }
  return false;
  //if ((tdArr[0] && tdArr[1] && tdArr[2] === "X") || (tdArr[0] && tdArr[1] && tdArr[2] === "O")){
  //  message(`Player ${tdArr[0]} Won!`) //use player()
  //}
};

function updateState(event) {
  $(event.target).html(player());
};

function message(text) {
  debugger;
  $('#message').text(text);
}
