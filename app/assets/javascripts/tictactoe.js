// Code your JavaScript / jQuery solution here
var state=["","","","","","","","",""]
var squares=[];
var turn=0;
var gameId=0;
var winCombos=[
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

$(function(){
  squares=$("td").toArray();
  attachListeners();
});

function attachListeners(){
  //Board Space listeners
  $('td').on('click',function(){
    if(this.innerHTML==="" && checkWinner()===false && turn<10){
      doTurn(this);
    }
  });

  //Show previous games listeners
  $("#previous").on('click',function(){
    $("#games").html("");
    var getGames=$.get("/games")
    getGames.done(function(data){
      var games=data["data"]
      games.forEach(function(game){
        var button=$('<button/>',{
          text: "View Game"+game.id,
          click: function(){
            var getGameData=$.get("/games/"+game.id)
            getGameData.done(function(resp){
              gameId=game.id;
              var newState=resp.data.attributes.state
              resetGame();
              for(var i=0; i<9; i++){
                squares[i].innerHTML=newState[i]
                state=newState;
                if(newState[i]!==""){
                  turn++;
                }
              }
            })
          }
        });
        $("#games").append(button);
      });
    });
  });

  //Clear button Listener
  $("#clear").on("click",clearGame);


  //Save Game Listener
  $("#save").on("click",saveGame);
}



function player(){
  if(turn%2===0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(square){
  var token=player();
  var ind=squares.indexOf(square);
  square.innerHTML=token;
  state[ind]=token
  console.log(state)
}

function setMessage(msg){
  $("#message").text(msg);
}

function checkWinner(){
  var res=false;
  winCombos.forEach(function(combo){
    if(squares[combo[0]].innerHTML===squares[combo[1]].innerHTML && squares[combo[2]].innerHTML===squares[combo[1]].innerHTML && squares[combo[0]].innerHTML!==""){
      var winner=squares[combo[0]].innerHTML
      setMessage("Player "+winner+" Won!");
      res=true;
    }
  })
  return res;
}

function doTurn(square){
  updateState(square);
  turn++;
  var won=checkWinner();
  if(won){
    saveGame();
    resetGame();
  } else if(won===false && turn>8){
    setMessage("Tie game.");
    saveGame();
    square.innerHTML="";
    resetGame();
  }
}


function saveGame(){
  var serialState=JSON.stringify(state);
  if(gameId===0){
    console.log("Saving game...");
    var savingGame=$.post("/games",{state: state});
  } else if(gameId>0){
    console.log("Updating game "+gameId);
    var patchData=JSON.stringify({state: state});
    var savingGame=$.ajax({
      url:"/games/"+gameId,
      data: patchData,
      dataType: "json",
      method: "PATCH",
      contentType: "application/json"
    });
  }

  savingGame.done(function(resp){
    gameId=resp.data.id;
  })


}

//Game Logic Helpers
function resetGame(){
  turn=0
  squares.forEach(function(square){
    square.innerHTML="";
    state=["","","","","","","","",""];
  })
}


function clearGame(){
  gameId=0;
  resetGame();
}
