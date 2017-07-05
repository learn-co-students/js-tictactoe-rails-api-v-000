  var winCombinations = [
    [0,1,2], // Top row
    [3,4,5], // Middle row
    [6,7,8], // Bottom row
    [0,3,6], // Left Column
    [1,4,7], // Middle Column
    [2,5,8], // Right Column
    [0,4,8], // Diagnoal L to R
    [2,4,6]  // Diagnoal R to L
  ]

var turn = 0 
var id = false

var board = []

var getBoard = function(){
     board = []
    document.querySelectorAll("[data-y]").forEach(function(cell){
     board.push(cell.innerHTML)
 })
}

function player() { 
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

var message = string => {
  document.getElementById('message').innerHTML = `<p>${string}</p>`
}

var resetBoard = function() {
  turn = 0
  $("td").html('');
}

function checkWinner() {
  getBoard()
  for (var i = 0; i < winCombinations.length; i++) {
    var row = winCombinations[i];
    if (board[row[0]] == board[row[1]] && board[row[2]] == board[row[1]] && board[row[0]] != ""){
      message(`Player ${board[row[0]]} Won!`)
      return true;
    }
  }
    return false
}

var updateState = function(target) {
  $(target).html(player())
}

function doTurn(target) {

    updateState(target)
    if (checkWinner()) {
      saveGame()
      resetBoard();
      return "winner"
    }

    
    if ($.inArray("", board) == -1){
  
      message('Tie game.')
      saveGame()
      resetBoard();
      return "tie"
    }
    turn ++
}

function getPrevious(data) {
  $.get('/games', function(data) {
    var list = data.data.map(function(game) {
      return $(
        `<button><li class="game" data-id="${game.id}">
        ${game.id} \n
        </li></button>`
      ).on('click', function(e) {
        id = e.target.dataset["id"]
        $.get('/games/' + id, function(data) {
          placeMarks(data.data.attributes.state)
         })   
      });
    });
    $('#games').html(list);
  });
}

var placeMarks = function(marks) {
  if (marks.length > 0) {
    $("td").each(function(i) {
    $(this).text(marks[i]);
    })
  } else {
    $("td").each(function(i) {
    $(this).text("");
    })
  }
}

function saveGame() {
  var url, method;
  if(id) {
    method = "PATCH"
    url = "/games/" + id 
  } else {
    method = "POST"
    url = "/games"
  }

$.ajax({ 
    url: url, 
    method: method,
    datatype: "json",
    data: {
      game: {
        state: board
      }
    },
    success: function(data) {
    }

  })
}

function attachListeners() {
  $(document).ready(function() {
    $('tbody').on("click", function (e) {
      if (e.target.dataset && e.target.innerHTML == "") {
        doTurn(e.target)
      }
    }); 
    $('#previous').on("click", function () {
      getPrevious()
    })
    $('#save').on("click", function () {
      saveGame()
    })
    $('#clear').on("click", function () {
      resetBoard()
    })
  })
}

attachListeners()


