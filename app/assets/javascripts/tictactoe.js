// Code your JavaScript / jQuery solution here
var turn = 0;
var gameId = "";

function player(){
  if(turn === 0 || (turn % 2) === 0){
    return "X";
  } else {
    return "O";
  }
}

function updateState(element){
  element.textContent = player();
}

function setMessage(string){
  $('div#message').html(string);
}

function checkWinner(){
  var xPositions = [];
  var oPositions = [];
  $("td").each(function(index, el){
    	if(el.textContent === "X"){
        xPositions.push(index);
      }else if(el.textContent === "O"){
        oPositions.push(index);
      }
  });
  var winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  var result = false;
  winCombos.forEach(function(el){
  	if(xPositions.toString().includes(el)){
      setMessage("Player X Won!")
  		result = true;
  	} else if(oPositions.toString().includes(el)){
      setMessage("Player O Won!")
      result = true;
  	} else if(turn === 9){
      setMessage("Tie game.")
    }
  });
  return result;
}

function resetBoard(){
  $("td").map(function(index, el){
    	el.textContent = ""
  });
  turn = 0;
  gameId = "";
}

function doTurn(el){
  updateState(el);
  turn++;
  var result = checkWinner();
  if((result === false && turn === 9) || (result === true)){
    saveGames();
    resetBoard();
  }
}

function previousGames(){
  $("div#games").empty();
  $.get("/games", function(data){
    data.data.forEach(function(game, index){
      var button = "<button id=\"" + game.id + "\">" + game.id + "</button><br>"
      $("div#games").append(button);
      $("#" + game.id)[0].addEventListener("click", function(){
        $.get("/games/" + game.id, function(data){
          gameId = game.id;
          var squares = window.document.querySelectorAll('td');
          for (var i = 0; i < 9; i++) {
            squares[i].innerHTML = data.data.attributes.state[i];
          }
          var turnCount = 0;
          $("td").each(function(index, el){
              if(el.textContent !== ""){
                turnCount++;
              }
          });
          turn = turnCount;
        });
      });
    });
  });
}

function saveGames(){
  board = [];
  $("td").each(function(index, el){
    	board.push(el.textContent);
  });
  if(gameId === ""){
    var posting = $.post("/games", {state: board})
    posting.done(function(data){
      gameId = data.data.id;
    });
  } else {
    patching = $.ajax({
      type: "PATCH",
      url: "/games/" + gameId,
      data: {state: board},
      success: 201,
      dataType: "json"
    });
  }
}

function attachListeners(){
  $("td").each(function(){
    this.addEventListener("click", function(){
      if(this.textContent === "" && !checkWinner()){
        doTurn(this);
      }
    });
  });
  $("button#clear")[0].addEventListener("click", function(){
      resetBoard();
  });
  $("button#previous")[0].addEventListener("click", function(){
      previousGames();
  });
  $("button#save")[0].addEventListener("click", function(){
      saveGames();
  });
}

$(function(){
  attachListeners();
});
