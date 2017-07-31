// Code your JavaScript / jQuery solution here

var winning_states = [
  ['X','X','X',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ','X','X','X',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ','X','X','X'],
  ['X',' ',' ','X',' ',' ','X',' ',' '],
  [' ','X',' ',' ','X',' ',' ','X',' '],
  [' ',' ','X',' ',' ','X',' ',' ','X'],
  ['X',' ',' ',' ','X',' ',' ',' ','X'],
  [' ',' ','X',' ','X',' ','X',' ',' ']
];

var turn = 0;
var game_id = undefined;

window.clear = function(){
  turn = 0;
  setBoard(['','','','','','','','','']);
  game_id = undefined;
}

function doTurn(tile){
  if(checkWinner() || !updateState(tile))return;
    turn++;
    message('Tie game.');
    if(hiddenCheckWinner() || turn > 8){
      saveGame();
      clear();
    }
}

function player(){
  return turn % 2 == 1 ? 'O' : 'X';
}

function updateState(square){
  if(square.innerHTML!='')return false;
  square.innerHTML = player();
  return true;
}

//Need to define it like this for some reason otherwise mocha thinks it doesn't exist
window.message = function(msg){
  $('#message').html(msg);
}

function getTile(x, y){
  if(y==undefined){
    y = Math.floor(x / 3);
    x = x % 3;
  }
  return $('td[data-x='+x+'][data-y='+y+']');
}

function checkWinner(){
  return hiddenCheckWinner();
}

function hiddenCheckWinner(){
  var winner = null;
  winning_states.forEach((winning_state)=>{
    var last_match;
    for(var i = 0; i < winning_state.length; i++){
      if(winning_state[i]=='X'){
        var tile = getTile(i).text();
        if(!last_match && (tile=='X'||tile=='O')){
          last_match = tile;
        }
        if(tile!=last_match)return;
      }
    }
    winner = last_match;
  });
  if(winner!=null)message('Player ' + winner + ' Won!');
  return winner != null;
}

function attachListeners(){
  var squares = document.getElementsByTagName('td');
  for(var i = 0; i < squares.length; i++){
    squares[i].addEventListener('click', function(){doTurn(this);});
  }
  $('button#previous').click(fetchPreviousGames);
  $('button#save').click(saveGame);
  $('button#clear').click(clear);
}

function fetchPreviousGames(){
  $.get('/games', (data)=>{
    $('#games').html('');
    data.data.forEach((game)=>{
      $('#games').append('<button id="load-game" data-id="'+game.id+'">'+new Date(game.attributes['updated-at'])+'</button>');
    });
    $('button#load-game').click(loadGame);
  });
}

function saveGame(){
  if(game_id){
    $.ajax('/games/'+game_id, {method: 'PATCH', data: {state: getBoard()}, dataType: 'json'});
  }else{
    $.ajax('/games', {method: 'POST', data: {state: getBoard()}, dataType: 'json'}).done(function(data){
      game_id = data.data.id;
    });
  }
}

function loadGame(){
  $.get('/games/' + $(this).data().id, (data)=>{
    game_id = data.data.id;
    turn = data.data.attributes.state.reduce(function(total, tile){
      if(tile=='X' || tile=='O')total+=1;
      return total;
    }, 0);
    setBoard(data.data.attributes.state);
  });
}

function setBoard(board){
  board.forEach(function(tile, index){
    getTile(index).text(tile);
  });
}

function getBoard(){
  return ['','','','','','','','',''].map(function(tile, index){
    return getTile(index).text();
  });
}

$(attachListeners)
