// Code your JavaScript / jQuery solution here
var newBoard = true;
var turn = 0
function player() {
  if (turn % 2 === 1) {
    return 'O';
  } else {
    return 'X';
  }
}

function updateState(square) {
  square.innerHTML = player()
}

function setMessage(message) {
  window.document.getElementById('message').innerHTML = message
}

function checkWinner() {
  var squares = window.document.querySelectorAll('td');

  if (squares[0].innerHTML == 'X' && squares[1].innerHTML == 'X' && squares[2].innerHTML == 'X') {
    setMessage('Player X Won!')
    return true;
  } else if (squares[3].innerHTML == 'X' && squares[4].innerHTML == 'X' && squares[5].innerHTML =='X') {
    setMessage('Player X Won!')
    return true;
  } else if (squares[6].innerHTML == 'X' && squares[7].innerHTML == 'X' && squares[8].innerHTML == 'X') {
    setMessage('Player X Won!')
    return true;
  } else if (squares[0].innerHTML == 'X' && squares[3].innerHTML == 'X' && squares[6].innerHTML == 'X') {
    setMessage('Player X Won!')
    return true;
  } else if (squares[1].innerHTML == 'X' && squares[4].innerHTML == 'X' && squares[7].innerHTML == 'X') {
    setMessage('Player X Won!')
    return true;
  } else if (squares[2].innerHTML == 'X' && squares[5].innerHTML == 'X' && squares[8].innerHTML == 'X') {
    setMessage('Player X Won!')
    return true;
  } else if (squares[0].innerHTML == 'X' && squares[4].innerHTML == 'X' && squares[8].innerHTML == 'X') {
    setMessage('Player X Won!')
    return true;
  } else if (squares[2].innerHTML == 'X' && squares[4].innerHTML == 'X' && squares[6].innerHTML == 'X') {
    setMessage('Player X Won!')
    return true;
  }

  if (squares[0].innerHTML == 'O' && squares[1].innerHTML == 'O' && squares[2].innerHTML == 'O') {
    setMessage('Player O Won!')
    return true;
  } else if (squares[3].innerHTML == 'O' && squares[4].innerHTML == 'O' && squares[5].innerHTML =='O') {
    setMessage('Player O Won!')
    return true;
  } else if (squares[6].innerHTML == 'O' && squares[7].innerHTML == 'O' && squares[8].innerHTML == 'O') {
    setMessage('Player O Won!')
    return true;
  } else if (squares[0].innerHTML == 'O' && squares[3].innerHTML == 'O' && squares[6].innerHTML == 'O') {
    setMessage('Player O Won!')
    return true;
  } else if (squares[1].innerHTML == 'O' && squares[4].innerHTML == 'O' && squares[7].innerHTML == 'O') {
    setMessage('Player O Won!')
    return true;
  } else if (squares[2].innerHTML == 'O' && squares[5].innerHTML == 'O' && squares[8].innerHTML == 'O') {
    setMessage('Player O Won!')
    return true;
  } else if (squares[0].innerHTML == 'O' && squares[4].innerHTML == 'O' && squares[8].innerHTML == 'O') {
    setMessage('Player O Won!')
    return true;
  } else if (squares[2].innerHTML == 'O' && squares[4].innerHTML == 'O' && squares[6].innerHTML == 'O') {
    setMessage('Player O Won!')
    return true;
  }

  return false;
}


function doTurn(square) {

  if (square.innerHTML == 'X' || square.innerHTML == 'O') {
    return setMessage("You cannot play on a square that is already taken.");
  }

  updateState(square);

  turn += 1;

    if (checkWinner() == true) {
    turn = 0;
    var squares = window.document.querySelectorAll('td');
    for (var i = 0; i < squares.length; i++) {
      squares[i].innerHTML = '';
    }
    $.ajax({
      method: 'POST',
      url: '/games',
      success: function(data){
        alert("Game saved.")
      }
    });
    return squares
  } else if (turn == 9) {
    turn = 0;
    var squares = window.document.querySelectorAll('td');
    for (var i = 0; i < squares.length; i++) {
      squares[i].innerHTML = '';
    }
    $.ajax({
      method: 'POST',
      url: '/games',
      success: function(data){
        alert("Game saved.")
      }
    });
    setMessage('Tie game.');
  }
}

function attachListeners() {
  const squares = window.document.querySelectorAll('td');

    squares[0].addEventListener('click', function () {
      if (checkWinner() == true) {
        return setMessage("You cannot play on a game that has already been won.");
      }
      doTurn(squares[0]);
    });
    squares[1].addEventListener('click', function () {
      if (checkWinner() == true) {
        return setMessage("You cannot play on a game that has already been won.");
      }
      doTurn(squares[1]);
    });
    squares[2].addEventListener('click', function () {
      if (checkWinner() == true) {
        return setMessage("You cannot play on a game that has already been won.");
      }
      doTurn(squares[2]);
    });
    squares[3].addEventListener('click', function () {
      if (checkWinner() == true) {
        return setMessage("You cannot play on a game that has already been won.");
      }
      doTurn(squares[3]);
    });
    squares[4].addEventListener('click', function () {
      if (checkWinner() == true) {
        return setMessage("You cannot play on a game that has already been won.");
      }
      doTurn(squares[4]);
    });
    squares[5].addEventListener('click', function () {
      if (checkWinner() == true) {
        return setMessage("You cannot play on a game that has already been won.");
      }
      doTurn(squares[5]);
    });
    squares[6].addEventListener('click', function () {
      if (checkWinner() == true) {
        return setMessage("You cannot play on a game that has already been won.");
      }
      doTurn(squares[6]);
    });
    squares[7].addEventListener('click', function () {
      if (checkWinner() == true) {
        return setMessage("You cannot play on a game that has already been won.");
      }
      doTurn(squares[7]);
    });
    squares[8].addEventListener('click', function () {
      if (checkWinner() == true) {
        return setMessage("You cannot play on a game that has already been won.");
      }
      doTurn(squares[8]);
    });

  const saveButton = window.document.getElementById('save');
  saveButton.addEventListener('click', function () {
    if (newBoard === true) {
      $.ajax({
        method: 'POST',
        url: '/games',
        data: {
          state: window.document.getElementById('td'),
          turn: turn
        },
        success: function(data){
          return "Game saved."
        }
      });
      $.ajax({
        method: 'PATCH',
        url: '/games/1',
        data: {
          state: window.document.getElementById('td'),
          turn: turn
        },
        success: function(data){
          return "Game saved."
        }
      });
    } else if (newBoard == 3) {
      $.ajax({
        method: 'POST',
        url: '/games',
        data: {
          state: window.document.getElementById('td'),
          turn: turn
        },
        success: function(data){
          return "Game saved."
        }
      });
    }
    else {
      $.ajax({
        method: 'PATCH',
        url: '/games/1',
        data: {
          state: window.document.getElementById('td'),
          turn: turn
        },
        success: function(data){
          return "Game saved."
        }
      });
    }
  });

  const previousButton = window.document.getElementById('previous');
  previousButton.addEventListener('click', function () {
    $.ajax({
      method: 'GET',
      url: '/games',
      success: function(response) {
        new_html = '';
        for (var i = 0; i < response.data.length; i++) {
          new_html += '<button onclick="myFunction()">' + response.data[i].id + '</button>'
        }
        window.document.getElementById('games').innerHTML = new_html;
      }
    });
  });

  const clearButton = window.document.getElementById('clear');
  clearButton.addEventListener('click', function () {
    var squares = window.document.querySelectorAll('td');
    for (var i = 0; i < squares.length; i++) {
      squares[i].innerHTML = '';
    }
    turn = 0;
    newBoard=3;
  });

}

window.onload = () => {
  attachListeners();
}

function myFunction() {
  $.ajax({
    method: 'GET',
    url: '/games/1',
    success: function(response) {
        const squares = window.document.querySelectorAll('td')
        squares[0].innerHTML = response.data.attributes.state[0];
        squares[1].innerHTML = response.data.attributes.state[1];
        squares[2].innerHTML = response.data.attributes.state[2];
        squares[3].innerHTML = response.data.attributes.state[3];
        squares[4].innerHTML = response.data.attributes.state[4];
        squares[5].innerHTML = response.data.attributes.state[5];
        squares[6].innerHTML = response.data.attributes.state[6];
        squares[7].innerHTML = response.data.attributes.state[7];
        squares[8].innerHTML = response.data.attributes.state[8];
        turn = 2
    }
  });
  newBoard = false;
}

/*
function jsonifyGame(board) {
  return JSON.stringify({
    "data": {
      "id": "1",
      "type": "games",
      "attributes": {
        "state": board
      }
    },
    "jsonapi": {
      "version": "1.0"
    }
  });
}

function jsonifyGames(boards) {
  const jsonObj = {
    "data": [],
    "jsonapi": {
      "version": "1.0"
    }
  };

  for (let i = 0, l = boards.length; i < l; i++) {
    jsonObj.data.push({
      "id": "" + (i + 1),
      "type": "games",
      "attributes": {
        "state": boards[i]
      }
    });
  }

  return JSON.stringify(jsonObj);
}

*/
