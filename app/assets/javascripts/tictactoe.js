var turn = 0;
var winCombos =  [
                    [0,1,2],
                    [3,4,5],
                    [6,7,8],
                    [0,3,6],
                    [1,4,7],
                    [2,5,8],
                    [0,4,8],
                    [6,4,2]
              ];
var board = [];

function checkWinner(){
  var response;
  for(var j = 0; j < winCombos.length; j++){
      var winCombo = winCombos[j];
      // for(var i=0; i < winCombo.length; i++){
        var win_index_1 = winCombo[0];
        var win_index_2 = winCombo[1];
        var win_index_3 = winCombo[2];
      // }
        // console.log(win_index_1, win_index_2, win_index_3);

        var pos_1 = board[win_index_1];
        var pos_2 = board[win_index_2];
        var pos_3 = board[win_index_3];
        // console.log(pos_1, pos_2, pos_3);
        console.log(pos_1);


        if (pos_1 === "X" && pos_2 === "X" && pos_3 === "X"){
          response = "Player X Won!";
        }
        else if(pos_1 === "O" && pos_2 === "O" && pos_3 === "O"){
          response = "Player O Won!";
        }

      }
      if (response == undefined){
        return false;
      }
    message(response);
  }

//================================ MAIN FUNCTIONS ==================================
function attachListeners(){
  $("td").on('click', function(event) {
    doTurn(event);
  });
}

function boardPositions(event){
  var element = event.target;
  var indexVal = $("td").index(event.target);
  if(element !== undefined){
    board[indexVal] = element.innerText;
    // console.log(element.innerText);
  }
}

function doTurn(event){
  updateState(event);
  boardPositions(event);
  checkWinner();
  turn +=1;
}

function player(){
  if (turn % 2 === 0){
    return "X";
  }else {
    return "O";
  }
}

function updateState(event){
  var value = player();
  $(event.target).html(value);
}

function message(response){
  $('#message').html(response);
}

$(function () {
    attachListeners();
});
