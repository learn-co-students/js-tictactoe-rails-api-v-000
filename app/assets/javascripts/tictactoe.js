// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

$(function() {
  attachListeners();
});

function attachListeners() {
  $('td').on('click', function() {
     if (!$.text(this) && !checkWinner()) {
       doTurn(this);
     }
   });
  $("#previous").click(previousGames);
  $("#save").click(saveGame);
  $("#clear").click(clearBoard);
};

function clearBoard(){
  $("td").empty()
  turn = 0
  currentGame = 0
}

function previousGames() {
  $("#games").empty();
  $.get('/games', function(data) {
    if (data.data.length > 0) {
    for (let i = 0; i < data.data.length; i++) {
      $("#games")[0].innerHTML += `<button onClick = showGame('${i+1}')  id="game-${i+1}"> game ${i+1}</button>`
      }
    }
  })
};


function showGame(id){
  gameId = parseInt(id)
  currentGame = gameId
  $.get(`/games/${gameId}`, function(data){
    let board = data.data.attributes.state
    for(i=0; i < board.length; i++) {
      $('td')[i].innerHTML = board[i]
      turn = board.filter(String).length
    }
  })
}

function saveGame(){
  let url, method;
  if(currentGame === 0) {
    url = "/games"
    method = "POST"
  } else {
    url = "/games/" + currentGame
    method = "PATCH"
  };

  $.ajax({
    url: url,
    type: method,
    dataType: "json",
    data: {
      state: getBoard()
    }
  });
  clearBoard();
};

function getBoard() {
  let board = []
   $("td").each(function(i) {
     board.push($(this).text())
    })
  return board;
};


function doTurn(el) {
  if (el.innerHTML === "") {
    updateState(el)
    if (checkWinner()) {
      saveGame()
      clearBoard();
    } else if (turn === 8) {
      saveGame()
      setMessage('Tie game.')
      clearBoard();
    } else {
      turn += 1
    }
  }
};

function updateState(el){
  let token = player();
  el.innerHTML = token;
};

function player() {
  if (turn % 2 == 0) {
    return 'X'
} else {
    return 'O'
  }
};

function setMessage(message) {
  $("#message").text(message)
};

function checkWinner(){

  const sq = $("td")
  const winCombos = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]];

  for (let a = 0; a < winCombos.length; a++) {
      if (sq[winCombos[a][0]].innerHTML === sq[winCombos[a][1]].innerHTML &&
          sq[winCombos[a][1]].innerHTML === sq[winCombos[a][2]].innerHTML &&
          sq[winCombos[a][0]].innerHTML !== ''
          ) {
          setMessage(`Player ${sq[winCombos[a][0]].innerHTML} Won!`)
          return true;
      }
  }
  return false;
};
