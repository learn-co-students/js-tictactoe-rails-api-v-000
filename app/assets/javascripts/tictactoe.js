var turn = 0;
var board = [];
var currentGame = undefined;
var winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];

function message(string) {
  //add string to #message div
  $('#message').html(string)
}

function checkCombo(combo){
  //working
  if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
    return true
    console.log(true)
  }
  //broken
};

function checkWinner() {
  for(i = 0; i < winCombos.length; i++){
    var combo = winCombos[i]
    if (checkCombo(combo)){
      message('Player ' + player() + ' Won!')
      return true;
    }
  }
  if (fullBoard()) {
    message("Cat's Game!")
  }
  return false;
};

function fullBoard() {
  var full = true
  $('td').each(function() {
    if (this.innerHTML === "") {
      full = false
    }
  })
  return full
}

function games() {
  //when the user clicks on a previous game, it loads that game - like a show view
  event.preventDefault();

  var id = event.target.innerText
  $.get("/games/" + id, function(data) {
    //display state as current board
    var array = data.state
    $.each($("td"), function(index, cell) {
      $(cell).text(array[index]);
    })
  })
}

function previous() {
  //previous games are hidden until #previous is clicked - then show them like an index
  $.get("/games", function(data) {
    var games = data.games
    var html = "<ul>"
    $.each(games, function(index, game) {
      html += "<li>" + game.id + "</li>"
    })
    html += "</ul>"
    $('#games').append(html);
  });
}

function save() {
  //save game to database if it's new, update game if not
  if (currentGame === undefined) {
    var url = "/games"
    var method = "POST"
  } else {
    var url = "/games" + currentGame
    var method = "PATCH"
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: board
      }
    },
    success: function(data) {
      currentGame = data.game.id;
    }
  })
}

function cell() {
  //passes doTurn a param of the event - the cell that was clicked
  doTurn(event.toElement);
}

function gameBoard() {
  //creates an array of the current board, which you can use when showing a game to
  //iterate over to add each element as text to that cell...?
  //can also iterate through the array to check if someone has won
  $.each($("td"), function(index, cell) {
    board.push($(cell).text());
  })
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(cell) {
  var currentPlayer = player();

  $(cell).text(currentPlayer);
  gameBoard();
}

function doTurn(cell) {
  updateState(cell);
  if (checkWinner() || fullBoard()) {
    save();
    board = [];
    turn = 0;
    currentGame = undefined
    $('td').empty();
  } else {
    turn += 1;
  }
}

function attachListeners() {
  $('td').on('click', function(event) {
    cell();
  })

  $('#save').on('click', function(event) {
    save();
  })

  $('#previous').on('click', function(event) {
    previous();
  })

  $('#games').on('click', function(event) {
    games();
  })
}

$(document).ready(function() {
  attachListeners();
})
