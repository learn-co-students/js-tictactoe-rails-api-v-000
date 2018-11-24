// Code your JavaScript / jQuery solution here
const WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn=0
var newGame=true
var endGame=false

$(document).ready(function() {
  attachListeners();
});

function player(){
  if (turn%2==0) { return 'X'} else {return 'O'}
}

function updateState(position){

  //var token = player();
  $(position).text(player());


}


function doTurn(position){
 
  if (!endGame){
    updateState(position);
    turn++;    
  }

 if (checkWinner()){
   endGame=true
   saveGame();
   resetBoard();   
 } else if (turn===9){
   setMessage('Tie game.')
   endGame=true
   saveGame();
   resetBoard();   
 } 
  
}


function saveGame(){
  let state=[];
  $('td').text((i,value) => state.push(value));

  const data={state: state}

  //var values = $(state).serialize(); 
  
  
  var posting = $.post('/games', data, function(game){    
      $('#games').append(`<button class="previous" id="${game.data.id}"> Game #${game.data.id}</button><br>`);
      $(".previous").on('click', (event) => loadGame(event));
  });

  posting.done(function(data) {
    var game = data["data"];
    $("#new").text(game["id"]);    
  });  

  
}

function resetBoard(){
  $('td').empty();
  turn=0;
  endGame=false  
}

function setMessage(message){
  $('#message').text(message);
}

function checkWinner(){
  var board={};
  var winner=false;
  $('td').text((i,value) => board[i]=value);
  WINNING_COMBINATIONS.some(function(combination){
    if(board[combination[1]]===board[combination[2]]  && board[combination[1]]===board[combination[0]] && board[combination[0]]!==""){
      setMessage(`Player ${board[combination[0]]} Won!`)
      return winner= true;
    }
  });
  return winner;
}

function showPreviousGame(event){
  
   // event.preventDefault();    
    $.get("/games", function(data) {  
      if (data.data.length){   
        data.data.forEach(addButton); 
      }
    })    
  
  }

  function addButton(game){
     $("#games").append(`<button class="previous" id="${game.id}">Game #${game.id}</button></br>`);     
     $(`#${game.id}`).on('click', (event)=>loadGame(event))    
    }
    


function loadGame(event){
  //debugger
  const id=event.target.id
  let state=[]
  //$('td').text((i,value) => state[i]=value);
  $.get("/games/"+id, function(data) {      
      state=data.data.attributes.state
     });

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        debugger
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        console.log(state[index])
        index++;
      }
    }
    //debugger

}


function attachListeners(){
 $('td').on('click', function(){
   if(!$.text(this)){ doTurn(this);}
 })
 $('#save').on('click', ()=>saveGame());
 $('#previous').on('click', (event)=> showPreviousGame(event));
 $('#clear').on('click', ()=>resetBoard());
}
