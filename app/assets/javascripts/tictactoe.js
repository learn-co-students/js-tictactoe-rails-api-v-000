// Code your JavaScript / jQuery solution here

$(function() {
    attachListeners()
})

var turn = 0

var winningCombo = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
let board = ["", "", "", "", "", "", "", "", "" ]

function player() {
    const token = turn % 2 === 0 ? "X" : "O"
    return token
}

function updateState(square) {
    const token = player()
    square.innerHTML = token
}

function setMessage(string) {
    document.getElementById('message').innerHTML = string
}

function checkWinner() {
  let winner = false
  board = boardState()
  winningCombo.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
  return winner
}

function boardState() {
  const tableDatas = document.getElementsByTagName('td')
  const tableDatasArray = Array.prototype.slice.call(tableDatas)
  const board = tableDatasArray.map( data => {
    return data.innerHTML
  })
  return board
}

function checkBoard(element) {
  return element==="X" || element==="O"

}

function doTurn(square) {
    if (validMove(square)) {
        turn ++
        updateState(square)
        if (checkWinner()) {
            resetBoard()
        } else if (turn === 9) {
            setMessage("Tie game.")
        }
    } else {
        console.log('try again')
        return 'try again'
    }
}


function attachListeners() {
    setSquares().forEach( square => {
        return square.addEventListener('click', doTurn(square))
    })
}

function resetBoard() {
    setSquares().forEach(square => {
        return square.innerHTML = ""
    })
    turn = 0
    board = ["", "", "", "", "", "", "", "", ""]
}

function setSquares() {
    var td = document.getElementsByTagName('td')
    var tdSquares = Array.prototype.slice.call(td)
    return tdSquares
}


function validMove(square) {
    return square.innerHTML != "" ? false : true
}
