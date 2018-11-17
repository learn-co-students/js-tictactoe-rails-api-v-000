const WIN_COMBINATIONS = [
                      [0,1,2],
                      [3,4,5],
                      [6,7,8],
                      [0,3,6],
                      [1,4,7],
                      [2,5,8],
                      [0,4,8],
                      [2,4,6],
                    ];
var turn = 0

var player = () => (turn % 2 === 0) ? "X" : "O"

function updateState(element){
  $(element).text(player())
};

function setMessage(message){
  $(`#message`).text(message)
};

function checkWinner() {
  var winner = false
  var board = $('td').toArray().map(square => square.textContent)

  WIN_COMBINATIONS.forEach(combo => {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] &&
    board[combo[1]] === board[combo[2]]){
      winner = true
      setMessage(`Player ${combo[0]} Won!`)
    }
    return winner
    })
  };
