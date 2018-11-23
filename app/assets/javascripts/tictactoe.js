// Code your JavaScript / jQuery solution here
const WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn=0
var new=true

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

 updateState(position);
 turn++;
 
 if (checkWinner()){
   saveGame();
   resetBoard();
 } else if (turn===9){
   setMessage('Tie game.')
   saveGame();
   resetBoard();   
 }
 
}


function saveGame(){
  var state={};
  $('td').text((i,value) => state[i]=value);

  var values = $(state).serialize(); 
  
  var posting = $.post('/games', state);

  posting.done(function(data) {
    var game = data["data"];
    $("#new").text(game["id"]);    
  });  

  
}

function resetBoard(){
  $('td').empty();
  turn=0;
  
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
  
    event.preventDefault();    
    $.get("/games", function(data) {      
      let gameList="";
      data["data"].forEach(function(game){
        gameList=gameList+`<button class="previous" id="${game["id"]}">Game #${game["id"]}</button> <br>`;
      });
      $("#games").html(gameList);      
    });  
}

function attachListeners(){
 $('td').on('click', function(){
   if(!$.text(this)){ doTurn(this);}
 })
 $('#save').on('click', ()=>saveGame());
 $('#previous').on('click', (event)=> showPreviousGame(event));
 $('#clear').on('click', ()=>resetBoard());
}
