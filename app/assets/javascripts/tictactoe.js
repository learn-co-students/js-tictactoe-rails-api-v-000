// Code your JavaScript / jQuery solution here
const WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn=0
var newGame=true
var savedGameId=0

$(document).ready(function() {
  attachListeners();
});


function player(){
  if (turn%2==0) { return 'X'} else {return 'O'}
}


function updateState(position){
  $(position).text(player());
}


function doTurn(position){
  
    updateState(position);
    turn++;    

 if (checkWinner()){
   //endGame=true   
   saveGame();
   resetBoard();   
 } else if (turn===9){
   setMessage('Tie game.')
   //endGame=true
   saveGame();
   resetBoard();   
 } 
  
}


function saveGame(){
  let state=[];
 
  $('td').text((i,value) => {state.push(value)});

  const data={state: state}
   //debugger
  if (savedGameId==0){
    var posting = $.post('/games', data)
    posting.done(function(data) {
    //ar game = data["data"];
    setMessage(`Game #${data.data.id} saved`) 
    savedGameId=data.data.id
    showPreviousGame()
    });  
  } else {
    $.ajax({    
      type: 'PATCH',
      url: `/games/${savedGameId}`,
      headers: {'Content-Type': 'application/json'}, 
      data: data,
      success: function(response){
        setMessage(`Game #${savedGameId} saved`)    
      }
    });
    //debugger
    //setMessage(`Game #${savedGameId} saved`)
  }
  
  
}

function resetBoard(){
  $('td').empty();
  turn=0;  
  savedGameId=0;
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

function showPreviousGame(){
  
   // event.preventDefault();    
   $('#games').empty();
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

  const id=event.target.id
  let state=[]
  
  //$('td').text((i,value) => state[i]=value);
  $.get("/games/"+id, function(data) {      
      state=data.data.attributes.state
      let index = 0;
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {    
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        //console.log(state[index])
        index++;
       }
      }
      newGame=false
      savedGameId=id
     });
   //debugger
    }
 


function attachListeners(){
 $('td').on('click', function(){
   if(!$.text(this)&&!checkWinner()){ doTurn(this);}
 })
 $('#save').on('click', ()=>saveGame());
 $('#previous').on('click', ()=> showPreviousGame());
 $('#clear').on('click', ()=>resetBoard());
}
