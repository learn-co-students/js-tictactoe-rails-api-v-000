// Code your JavaScript / jQuery solution here
var turn = 0;
var saved_id = false;
var boardArray = Array.from(window.document.querySelectorAll('td'));

$(function(){
  attachListeners()
});

function attachListeners(){
  boardArray.forEach(function(node){
    node.addEventListener('click', function(){
      if(node.innerHTML === "" && !checkTie() && !checkWinner()){
        doTurn(node);
      }
    });
  });

  window.document.querySelector("button#previous").addEventListener("click", function(){
    getPreviousGame();
  })

  window.document.querySelector("button#save").addEventListener("click", function(){
    saveGame()
  })

  window.document.querySelector("button#clear").addEventListener("click", function(){
    clearGame();
  })
}

function player(){
  if(turn % 2 == 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(node){
  node.innerHTML = player();
}

function setMessage(message){
  $("div#message").text(message);
}

function checkWinner(){
  let board = boardArray.map(node => node.innerHTML)
  let winner = false;
  const WINNERS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

  WINNERS.forEach(function(combo){
    if( combo.every((val, i, arr) => board[val] != "" && board[val] === board[arr[0]]) ){
      setMessage("Player " + board[combo[0]] +" Won!")
      winner = true;
    }
  })
  return winner;
}

function checkTie(){
  if(turn > 8){
    setMessage("Tie game.");
    return true;
  } else {
    return false;
  }
}

function clearGame(){
  turn = 0;
  boardArray.forEach(node => node.innerText = "")
  saved_id = false;
}

function saveGame(){
  let gameData =  JSON.stringify({state: boardArray.map(node => node.innerHTML)});
  if(saved_id === false){
    $.ajax({url: '/games', method: 'POST', data: gameData, success: function(response){
      saved_id = response.data.id
    }})
  } else {
  $.ajax({url: `/games/${saved_id}`, method: 'PATCH', data: gameData})
  }
}

function getPreviousGame(){
  $.get('/games', function(response){
    if(response.data.length > 0){
      gamesString = ""
      response.data.forEach(function(game){
        gamesString += `<button class="js-more" data-id="${game.id}">${game.id}</button></li>`
      })
      $('div#games').html(gamesString);
      Array.from(window.document.querySelectorAll("button.js-more")).forEach(function(button){
        button.addEventListener('click', function(){
          loadPreviousGame(this.dataset.id);
        })
      })
    }
  });
}

function loadPreviousGame(gameId){
  $.get(`/games/${gameId}`, function(response){
    boardArray.forEach((value, index) => value.innerText = response.data.attributes.state[index]);
    saved_id = gameId;
    turn = boardArray.filter(node => node.innerText != "").length;
  })
}

function doTurn(node){
  updateState(node)
  turn++;
  if( checkWinner() || checkTie() ){
    saveGame();
    clearGame();
  }
}
