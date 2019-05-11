// Code your JavaScript / jQuery solution here
var WIN_COMBINATIONS = [
  [0,1,2],  //Top Row Combo
  [3,4,5],  //Middle Row Combo
  [6,7,8],  //Bottom Row Combo
  [0,3,6],  //Left Row Combo
  [1,4,7],  //Middle Row Combo
  [2,5,8],  //Right Row Combo
  [0,4,8],  //Left Diag Combo
  [2,4,6]   //Right Diag Combo
];


var turn = 0;
var currentGame = 0;

$(document).ready(attachListeners);

function player() {
  if(turn % 2 == 0){
  return "X";
} else {
    return "O";
  };
};

function updateState(e) {
  let token = player();
  $(e).append(token);
};

function setMessage(result) {
  $("#message").append(result);
  setTimeout(function(){
  $('#message').empty();
}, 5000);
};

function checkWinner() {
  var winner = false;
  var board = {};

  $('td').text((index, square) => board[index] = square);

WIN_COMBINATIONS.forEach(function(position) {
  if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== '') {
    setMessage(`Player ${board[position[0]]} Won!`)
    saveGame();
    winner = true;
  }
})
return winner;
};

function resetBoard() {
  turn = 0;
  currentGame = 0;
  document.querySelectorAll("td").forEach( function(td) {
    td.innerHTML = ""
  });
  $("td").on('click', function () {
    doTurn(this);
  });
}

function doTurn(e) {
  if (e.innerHTML === '') {
    updateState(e);
    turn++;
    if (checkWinner()) {
      $("td").off();
      resetBoard();
    } else if (turn === 9) {
      $("td").off();
      setMessage("Tie game.");
      resetBoard();
      saveGame();
    }
  } else {
    alert('Space occupied! Please choose again.')
  };
};

function saveGame() {
  var boardState = {};
  $('td').text((index, square) => boardState[index] = square);
  var state = Object.values(boardState);

  if (!!currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: {state:state}
    });
  } else {
  var board = $.post('/games', { 'state[]': state });
  board.done(function(data) {
    var board = data;
    currentGame = board["data"]["id"];
  });
  }
};

function clearGame() {
  resetBoard();
};

function displayGame(id) {
  $.get(`/games/${id}`, function(data) {
    state = data.data.attributes.state
    $("td")[0].innerHTML = state[0]
    $("td")[1].innerHTML = state[1]
    $("td")[2].innerHTML = state[2]
    $("td")[3].innerHTML = state[3]
    $("td")[4].innerHTML = state[4]
    $("td")[5].innerHTML = state[5]
    $("td")[6].innerHTML = state[6]
    $("td")[7].innerHTML = state[7]
    $("td")[8].innerHTML = state[8]
    debugger
    currentGame = id
    turn = state.join('').length;
  })
}

function previousGame() {
  $.get("/games", function(data) {
      if (!!data.data) {
        var buttons = ``
        data.data.forEach(function(game) {
        btn = `<button style="display: block;" type="button" class="previous-game" onclick="displayGame(${game.id})" data-id="${game.id}">Game ${game.id}</button>`
        buttons += btn + `\n`
      })
      $("div#games").html(buttons)
    }
  })
}

function attachListeners() {
  $("td").on('click', function () {
    if (!checkWinner()) {
  doTurn(this)
  }
  });
  $("#save").on('click', () => saveGame());
  $("#previous").on('click', () => previousGame());
  $("#clear").on('click', () => clearGame());
};
