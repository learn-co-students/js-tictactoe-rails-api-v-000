$(document).ready(function(){
  attachListeners()
})


var games = [];

var win_combinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;

var gameID = null;

function board(){
  var tableData = $('td');
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
    if(currentBoard[combo[0]] !== "" && currentBoard[combo[0]] === currentBoard[combo[1]] && currentBoard[combo[1]] === currentBoard[combo[2]]){
      setMessage(`Player ${currentBoard[combo[0]]} Won!`)
      return true
    }
  }
  return false
}

function doTurn(position){
  updateState(position)
  if(checkWinner()){
    saveGame()
    resetBoard()
  }
  else if(turn === 9){  
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function resetBoard(){
  $('td').empty()
  return turn = 0
}

function previousGames(){
   $.ajax({
       url: '/games',
       method: 'GET',
     }).done(function(games){

      var buttonsHTML = ""; 

      for(var i =0; i < games['data'].length; i++){
        var id = games['data'][i]['id'];
         buttonsHTML += `<button data-id="${id}">${id}</button>`
      };

      $('div#games').html(buttonsHTML);
      gameButtonsListener();
    });
    
}

function gameButtonsListener(){
   $('#games button').on('click', function(evt){
     
    gameID = this.dataset['id'];
    
    $.get('/games/' + gameID, function(game){

      var state = game['data']['attributes']['state'];

      if(state.length){
        setMessage('');

        // var tableData = $('td');
        // for(var i=0; i< tableData.length; i++){
        //   tableData[i].innerHTML = state[i];
        // };
        let index = 0;
        for(let y = 0; y < 3; y++){
          for(let x = 0; x < 3; x++){
            document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
            index ++;
          } 
        };

        turn = state.join('').length;

        if(checkWinner() && turn === 9){
          setMessage('Tie Game!');
        }
      } 
    }); 
    
  });
}

function saveGame(){
  $.ajax({
    url: '/games',
    data: {"state": board()},
    method: 'POST',
    dataType: 'json'
  }).done(function(game){
     
    var id = game['data']['id']
    $('#games').append(`<button data-id="${id}">${id}</button>`)

    gameID = parseInt(id);

    gameButtonsListener();
  });
}

function updateGame() {
  $.ajax({
    url: '/games/' + gameID,
    data: {"state": board()},
    method: 'PATCH',
    dataType: 'json'
  }).done(function(game){
    console.log(game)
  });
}

function attachListeners(){

  $('td').on('click', function(evt){
    if (!checkWinner()){
      doTurn(evt.target)
    }
  });
  $('#save').on('click', function(evt){
    if(gameID == null){
      saveGame(board());
    }else{
      updateGame(board(), gameID);
    }
  });

  $('#previous').on('click', function(){
    previousGames();
  });

    
  $('#clear').on('click', function(){
    console.log('clear') //clear board and start a completely new game
    resetBoard();
    gameID = null 

  });
}
