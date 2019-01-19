// Code your JavaScript / jQuery solution here
var turn = turn_count();
var winning = false;
var current_game = 0;

$(function () {
  attachListeners();
})

let WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

//check state array, return sum "X" and "O"
function setState() {
  var tags = document.getElementsByTagName("td")
  let state = [];
  for (var i = 0; i < tags.length; i++) {
    state.push(tags[i].innerHTML)
  };
  return state;
}

//count how many occupied index, return turn count
function turn_count() {
  let arr = setState(); // state = ['', '', '', 'X', 'X', 'X', 'O', 'O', ''];
  return arr.length - arr.filter(word => word.length == 0).length
}

//reset the game
function resetBoard() {
  var tags = document.getElementsByTagName("td")
  for (var i = 0; i < tags.length; i++) {
    tags[i].innerHTML = '';
  };
  turn = turn_count();
}

//get the token for the player depends on each move
function player() {
  return turn % 2 == 0 ? "X" : "O"
}

//get selector od the clicked td then assign text = player()
function updateState(place) {
  let value = player();
  $(place).text(value)
}

function setMessage(string) {
  $('div#message').text(string)
}

function checkWinner() {
  //get the board state (something like this) ['X', 'X', 'O', 'X', 'O', 'X', '', 'O', 'O']
  let state = setState();
  let final = false;
  
  //check if there is a winning combo
  WIN_COMBINATIONS.find(function (combo) {
    winner = state[combo[0]];
    if (state[combo[0]] == state[combo[1]] && state[combo[1]] == state[combo[2]] && state[combo[0]] != ''){
      setMessage(`Player ${state[combo[0]]} Won!`);
      winning = true;
      return final = true
    }
  })
  
  //return the function call
  return final;
}

function doTurn(place) {
  //check if the square is empty or not
  //invoke updateState() to insert X or O in the place
  updateState(place);
  
  //increament the turn by 1
  turn += 1;
  
  //invoke checkwinner if there is a win
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    saveGame();
    setMessage('Tie game.');
    resetBoard();
  }
}

function attachListeners() {
  $('td').on('click', function () {
    // this : <td data-x="0" data-y="0"></td>
    if (this.innerHTML == "" && !checkWinner()) {
      doTurn(this)
    }
  });
  $('button#save').on('click', saveGame);
  $('button#previous').on('click', previousGame);
  $('button#clear').on('click', clearGame);
}

function saveGame() {
  let state = setState();
  // debugger
  // if current game == game.id
  if (current_game){
    $.ajax({
      url: '/games/' + current_game,
      type: 'PATCH',
      data: {'state': state}
    })
  }
  //current_game = 0 (false)
  else {
    $.post('/games', {
      state: state
    }).done(function (game) {
      current_game = game.data.id
    })
  }
}

function previousGame() {
  $.get('/games', function (games) {
    if (games.data.length){
      var list = $('div#games').text()
      for (var i = 0; i < games.data.length; i++) {
        let date = new Date(games.data[i].attributes['updated-at']);
        let update = date.toUTCString();
        let id = games.data[i].id;
        if (!list.includes(id)) {
          var html = '<button data-id="' + id + '">Game: ' + id + ' - Updated at: ' + update + '</button><br>';
          $('div#games').append(html);
          turn = turn_count();
          $(`button[data-id=${id}]`).on('click', showBoard)
        }
      }
    }
  })
}

function clearGame() {
  // new game, never saved, when clear still a nee game
  resetBoard();
  //if it is a saved game, when clear, start a new game
  current_game = 0;
}

function showBoard() {
  let id = $(this).data('id');
  $.get('/games/' + id, function (game) {
    let state = game.data.attributes.state
    let $tds = $('td');
    for (let index = 0; index < state.length; index++) {
      $tds[index].innerHTML = state[index];
    };
    current_game = id;
    turn = turn_count();
  });
}