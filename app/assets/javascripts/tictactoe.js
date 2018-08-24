// Code your JavaScript / jQuery solution here

const squarez = window.document.querySelectorAll('td');


$(document).ready(function (){
  attachListeners();
  saveGame();
})

function isEven(value){
  if (value % 2 === 0){
    return true;
  } else {
    return false;
  }
}

function player(){
  if (isEven(window.turn)) {
    return 'X'
  } else if (isEven(window.turn) === false) {
    return 'O'
  }
}

function updateState(square){
  if (!square.innerHTML) {
  square.innerHTML = player();
} else {
  return false
}
}

function setMessage(string){
  window.document.getElementById('message').innerHTML = string
}

function checkWinner(){
//horizontal

if (squarez[0].innerHTML === "X" && squarez[1].innerHTML === "X" && squares[2].innerHTML === "X") {
  setMessage('Player X Won!');
  return true
} else if (squarez[0].innerHTML === "O" && squarez[1].innerHTML === "O" && squares[2].innerHTML === "O") {
  setMessage('Player O Won!');
  return true
} else if (squarez[3].innerHTML === "X" && squarez[4].innerHTML === "X" && squares[5].innerHTML === "X"){
  setMessage('Player X Won!');
  return true
} else if (squarez[3].innerHTML === "O" && squarez[4].innerHTML === "O" && squares[5].innerHTML === "O") {
  setMessage('Player O Won!');
  return true
} else if (squarez[6].innerHTML === "X" && squarez[7].innerHTML === "X" && squares[8].innerHTML === "X") {
  setMessage('Player X Won!');
  return true;
} else if (squarez[6].innerHTML === "O" && squarez[7].innerHTML === "O" && squares[8].innerHTML === "O") {
  setMessage('Player O Won!');
  return true

// vertical
} else if (squarez[0].innerHTML === "X" && squarez[1].innerHTML === "X" && squares[2].innerHTML === "X") {
  setMessage('Player X Won!');
  return true
} else if (squarez[0].innerHTML === "O" && squarez[1].innerHTML === "O" && squares[2].innerHTML === "O") {
  setMessage('Player O Won!');
  return true
} else if (squarez[3].innerHTML === "X" && squarez[4].innerHTML === "X" && squares[5].innerHTML === "X"){
  setMessage('Player X Won!');
  return true
} else if (squarez[3].innerHTML === "O" && squarez[4].innerHTML === "O" && squares[5].innerHTML === "O") {
  setMessage('Player O Won!');
  return true
} else if (squarez[6].innerHTML === "X" && squarez[7].innerHTML === "X" && squares[8].innerHTML === "X") {
  setMessage('Player X Won!');
  return true;
} else if (squarez[6].innerHTML === "O" && squarez[7].innerHTML === "O" && squares[8].innerHTML === "O") {
  setMessage('Player O Won!');
  return true
} else if (squarez[0].innerHTML === "X" && squarez[3].innerHTML === "X" && squares[6].innerHTML === "X") {
  setMessage('Player X Won!');
  return true;
} else if (squarez[0].innerHTML === "O" && squarez[3].innerHTML === "O" && squares[6].innerHTML === "O") {
  setMessage('Player O Won!');
  return true;
} else if (squarez[1].innerHTML === "X" && squarez[4].innerHTML === "X" && squares[7].innerHTML === "X"){
  setMessage('Player X Won!');
  return true;
} else if (squarez[1].innerHTML === "O" && squarez[4].innerHTML === "O" && squares[7].innerHTML === "O") {
  setMessage('Player O Won!')
  return true
} else if (squarez[2].innerHTML === "X" && squarez[5].innerHTML === "X" && squares[8].innerHTML === "X") {
  setMessage('Player X Won!')
  return true;
} else if (squarez[2].innerHTML === "O" && squarez[5].innerHTML === "O" && squares[8].innerHTML === "O") {
  setMessage('Player O Won!')
  return true

  //diagonal
} else if (squarez[0].innerHTML === "X" && squarez[4].innerHTML === "X" && squares[8].innerHTML === "X"){
  setMessage('Player X Won!');
  return true;
} else if (squarez[0].innerHTML === "O" && squarez[4].innerHTML === "O" && squares[8].innerHTML === "O"){
  setMessage('Player O Won!');
  return true;
} else if (squarez[2].innerHTML === "X" && squarez[4].innerHTML === "X" && squares[6].innerHTML === "X"){
  setMessage('Player X Won!');
  return true;
} else if (squarez[2].innerHTML === "O" && squarez[4].innerHTML === "O" && squares[6].innerHTML === "O") {
  setMessage('Player O Won!')
  return true
} else {
  return false
}
}

function doTurn(location){
  if (!location.innerHTML){
    updateState(location);
      if (checkWinner()) {
        squares.forEach(e => e.innerHTML = "");
        window.turn = 0;
        checkWinner();
      } else if (window.turn === 8 && checkWinner() === false) {
        squares.forEach(e => e.innerHTML = "");
        window.turn = 0;
        setMessage('Tie game.');
      } else {
        window.turn += 1;
    }
  }
}

function attachListeners(){
  $('td').on('click', function () {
    doTurn(this);
  });
}

function saveGame(){
  let array = [];
  squares.forEach(e => array.push(e.innerHTML))
  $('#save').click(function(){
    $.post('/games', array)
  })
}
