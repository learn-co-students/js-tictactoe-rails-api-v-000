// this lab doesn't like let and const
$(document).ready(function() {
  attachListeners();
});

var currentGame = 0;
var turn =0;
var win_combo =[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

// Player
function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
};

// UpdateState
function updateState(squares) {
  squares.innerHTML = player();
}

// SetMessage
function setMessage(string){
  var message = document.getElementById('message')
  message.innerHTML = string
}

function checkWinner() {

  var board = {};
  var winner = false;


// we grab the td element (which is an array type object), .text() iterates through,
// and with the arrow function, assigns the value of the square to the board
  $('td').text((index, square) => board[index] = square);

  win_combo.forEach(function(position) {
    if (board[position[0]] !== "" && board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]]) {
      setMessage(`Player ${board[position[0]]} Won!`);
      return winner = true;
    }
  });
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
    saveGame();
    resetBoard();
  }
}

function saveGame() {
  var state = []
  $('td').text((index, square) => state[index] = square);

  if(currentGame){
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: state
    });
  } else {
    $.post(`/games`,function(data){
      currentGame = data["data"]["id"]
      alert(currentGame)
    });
  }
}


function resetBoard() {
 $('td').empty();
 turn = 0;
 currentGame = 0;
}

function attachListeners(){
  $( "td" ).on( "click", function() {
    if(!$.text(this) && !checkWinner()) {
      doTurn(this);
    };
  });
  // button#previous
  // $("#previous").one("click", previousGame);
  var previous = window.document.getElementById('previous')
                                    // Callback function
   previous.addEventListener('click', previousGame);
  //button#save
  var saveButton = window.document.getElementById('save');
   saveButton.addEventListener('click', saveGame);
   //button#clear
   var clearButton = window.document.getElementById('clear');
    clearButton.addEventListener('click', resetBoard);
}

function previousGame(){
  var divGames = document.getElementById('games');

   $.get("/games", function(data) {
     var array = data["data"]
         array.forEach(function(element){
           var newButton = document.createElement('button');
           newButton.innerHTML = element.id
           divGames.appendChild(newButton);
           return saveGame;
           // Add conditional so already existing games don't get added to
           // the list of buttons


      })
  })
}
