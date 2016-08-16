var turn = 0;
var WIN_COMBINATIONS = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
  ];
var currentGame = 0;
var active = true;
var oldGames = {}

function attachListeners() {
  active = true;
  $('td').on('click', doTurn);
  $('#previous').on('click', getOldGames);
  $('#save').on('click', saveGame);
}

function test() {console.log('testing')}

function getOldGames() {
  $.get('/games', listGames);
}

function loadGame(e) {
  var id = $(this).data('gameid');
  currentGame = id;
  buildBoard(oldGames[id]);
}

function buildBoard(state) {
  $("td").each(function(i, v) {
    $(this).html(state[i])
  });
}

function listGames(data) {
  $g = $('#games')
  $g.empty();
  oldGames = {};
  $.each(data['games'], function(i, v) {
    $g.append("<div class='old-game' data-gameid='" + v['id'] + "'><p>Game #" + v['id'] + '</p></div>');
    oldGames[v['id']] = v['state']
  });
  $('.old-game').on('click', loadGame);
}

function test(i, v) {
  console.log(v['id'])
}

function saveGame() {
  var state = getOrSetState();
  var data;

  if (currentGame==0) {
    data = {
      game: {state: state}
    }
    $.post('/games', data, saveGameHelper);
  } else {
    data = {
      id: currentGame,
      game: {state: state}
    }
    $.ajax({
      url: '/games/' + currentGame,
      type: 'PATCH',
      data: data,
      success: saveGameHelper
    }) 
  }
}

function saveGameHelper(data) {
  if (active) {currentGame = data['game']['id']}
  else {
    currentGame=0
    active = true;
  }
}

function doTurn(event) {
  $t  = $(this);
  var y = $t.data('y');
  var x = $t.data('x');
  updateState($t);
  turn++;
  checkWinner();
}

function player() {
  return turn%2==0 ? 'X' : 'O';
}

function getOrSetState() {
  var state = [];
  $("td").each(function(i) {
    var x = $( this ).text();
    state.push(x);
  });
  return state;
}
 
function checkWinner() {
  var vals = getOrSetState();

  $.each(WIN_COMBINATIONS, function (i, v) {
    var i0 = vals[v[0]];
    var i1 = vals[v[1]];
    var i2 = vals[v[2]];
    if ((i0=="X" || i0=="O") && i0==i1 && i0==i2) {
      var str = "Player " + i0 + " Won!";
      message(str);
      reset();
      return true
    }
  });

  if (vals.indexOf('') == -1) {
    message('Tie game');
    reset();
  }

  return false;
}

function reset() {
  active = false;
  saveGame();
  // active = true;
  turn = 0;
  $("td").each(function() {
    $(this).html('')
  });
}

function updateState($t) {
  $t.html(player());
}

function message(str) {
  $('#message').html(str);
}

$(document).ready(function() {
  var turn = 0;
  var active = true;
  var currentGame = 0;
  var WIN_COMBINATIONS = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
  ];
  attachListeners();
});