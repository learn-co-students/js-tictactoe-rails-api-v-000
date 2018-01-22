var turn = 0; 

function isEven(num) {
  return num % 2 === 0 
}

function player() {
  return isEven(turn) ? 'X' : 'O';
}

function updateState(squares) {
  const token = player();
  return squares.innerHTML = token;
}

function setMessage(string) {
  $('#message').append(string);
}

function checkWinner() {
  const board = $('td')

  const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  const winCombo = winningCombos.find((combo) => {
    return combo.every(i => board[i].innerHTML === 'X') ||
      combo.every(i => board[i].innerHTML === 'O')
  });
  if (winCombo) {
    const token = board[winCombo[0]].innerHTML
    setMessage(`Player ${token} Won!`)
  }
  return winCombo ? true : false
}

function resetBoard() {
  $('td').text("");
  turn = 0;
}

function doTurn(move) {
  if (updateState(move)) {
    turn++
  }
  if (checkWinner()) {
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
    resetBoard();
  }
}

function attachListeners() {
    $('td').click(function () {
      $(this).data('clicked', true)
      if ($('td').data('clicked')) {
        alert('yes');
      }
    })
}



