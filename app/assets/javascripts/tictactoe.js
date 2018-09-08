// Code your JavaScript / jQuery solution here
var turn = 0;

function player(){
  //debugger;
  let remainder = turn % 2
  if (remainder === 0){
    return "X";
  } else {
    return "O";
  }
}

function updateState(square){
  //lplayer();
  //debugger;
  square.innerHTML = player();
}

function setMessage(message){
  const messageDiv = window.document.getElementById('message')
  messageDiv.innerHTML = message;
}

function checkWinner(){
  square = window.document.querySelectorAll("td");
  var state;
  var winplayer;
  if (square[0].innerHTML ===square[1].innerHTML && square[1].innerHTML===square[2].innerHTML) {
    state = true;
    winplayer = square[0].innerHTML;
  } else if (square[2].innerHTML ===square[4].innerHTML && square[4].innerHTML===square[6].innerHTML){
    state = true;
    winplayer = square[2].innerHTML;
  } else if (square[2].innerHTML ===square[5].innerHTML && square[5].innerHTML===square[8].innerHTML){
    state = true;
    winplayer = square[2];
  } else if (square[3].innerHTML ===square[4].innerHTML && square[4].innerHTML===square[5].innerHTML){
    state = true;
    winplayer = square[3].innerHTML;
  } else {
    state = false;
  }
  debugger;
  if (state === true){
    if (winplayer === "X") {
      debugger;
      setMessage('Player X won!');
    } else{
      setMessage('Player O won!');
    }
    return true;
  } else {
    return false;
  }
}

function doTurn(square){
  squares = document.querySelectorAll("td");
  let i;
  turn += 1;
  debugger;
  checkWinner();
  debugger;
  updateState(square);
  if (checkWinner() === false && turn === 9){
    setMessage('Tie game.');
    for (i = 0; i < 10; i++) {
      squares[i].innerHTML = "";
    }
  }
}

function attachListeners(){
  square = document.querySelectorAll("td");
  //const main = document.getElementById('main');
  square[0].addEventListener('click', doTurn(square[0]));
  square[1].addEventListener('click', doTurn(square[1]));
  square[2].addEventListener('click', doTurn(square[2]));
  square[3].addEventListener('click', doTurn(square[3]));
  square[4].addEventListener('click', doTurn(square[4]));
  square[5].addEventListener('click', doTurn(square[5]));
  square[6].addEventListener('click', doTurn(square[6]));
  square[7].addEventListener('click', doTurn(square[7]));
  square[8].addEventListener('click', doTurn(square[8]));


}
