$(document).ready(function(){
  attachListeners()
})


var games = [];

var win_combinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;


function board(){
  var tableData = window.document.querySelectorAll('td');
  var arr = [];
  for(var i= 0; i < tableData.length; i++){
    arr.push(tableData[i].innerHTML);
  }
  return arr
}

var player = function(){
  return turn % 2 === 0 ? "X" : "O"
}

var updateState = function(position){
   if($(position).text() == ""){
        $(position).html(player())
        turn++
   }
  else{
      console.log("position taken!")
    }
}

function setMessage(string){
  $('div#message').html(string)
}

function checkWinner(){
  var currentBoard = board()
  for(i= 0; i < win_combinations.length; i++){
    var combo = win_combinations[i]
    if(currentBoard[combo[0]] == "X" && currentBoard[combo[1]] == "X" && currentBoard[combo[2]] == "X"){
      setMessage(`Player ${currentBoard[combo[0]]} Won!`)
      return true
    }
    else if (currentBoard[combo[0]] == "O" && currentBoard[combo[1]] == "O" && currentBoard[combo[2]] == "O") {
      setMessage(`Player ${currentBoard[combo[0]]} Won!`)
      return true;
    }
  }
  return false
}

function doTurn(position){
  updateState(position)
  if(checkWinner()){
  resetBoard()
  }
  else if(turn === 9){
    setMessage("Tie game.")
    resetBoard()
  }
}

function resetBoard(){
  $('td').empty()
  return turn = 0
}

// function jsonfyGame(board, id){
//   return JSON.stringify({
//     "data": {
//       "id": id,
//       "type": "games",
//       "atttributes": {
//         "state": board
//       } 
//     }
//   });
// }

// function saveGame(board, id){
//   $.ajax({
//     url: '/games',
//     data: jsonfyGame(board, id);,
//     method: 'PUT',
//     dataType: 'json'
//   });
// }

function attachListeners(){

  $('td').on('click', function(evt){
    if (!checkWinner()){
      doTurn(evt.target)
    }
  });
  $('#save').on('click', function(){
    // saveGame(board(), id);
  });

  $('#previous').on('click', function(){
     $.ajax({
       url: '/games',
       method: 'GET',
     }).success(function(info){
      var games = info;
      var $ul = $('div#games ul');

      for(var i =0; i < games['data'].length; i++){
        debugger;
        $ul.append("<li>" + games['data'][i]['id'] + "<li>")
      }
    });
    
  });
    
  $('#clear').on('click', function(){
    console.log('clear') //clear board and start a completely new game
  });
}
