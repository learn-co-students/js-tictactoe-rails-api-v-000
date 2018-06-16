//== Globals ===================================================================

var turn = 0;

//== Listeners =================================================================

$(function(){
  attachListeners();
});

function attachListeners(){
  $('td').on('click', e => activateBoard(e));
  $('button#clear').on('click', () => resetBoard());
  $('button#save').on('click', () => saveBoard());
  $('button#previous').on('click', () => loadGames());
}

//== Listener Functions ========================================================

function activateBoard(e){
  if (!$(e.target).text() && !checkWinner()) doTurn(e.target);
}

function resetBoard(){
  turn = 0;
  $('table').attr('id', '');
  setMessage('');
  setBoard(Array(9).fill(''));
}

function saveBoard(){
  const gameId = $('table').attr('id');
  if (!!gameId){
    $.ajax({
      method: "PATCH",
      url: `/games/${gameId}`,
      data: {'state': getState()}
    });
  } else {
    $.post('/games', {'state': getState()}, function(data){
      $('table').attr('id', data.data.id);
    });
  }
}

function loadGames(){
  $.get('/games', function(data){
    let gameList = '';
    data.data.forEach(function(game){
      gameList += `<button class="previous" data-id="${game.id}">Game ${game.id}</button><br/>`
    });
    createGameButtons(gameList, attachGameListeners);
  });
}

function createGameButtons(gameList, attachGameListeners){
  $('div#games').html(gameList);
  attachGameListeners();
}

function attachGameListeners(){
  $('button.previous').on('click', function(){
    $.get(`/games/${$(this).data('id')}`, function(data){
      $('div#games').html('');
      $('table').attr('id', data.data.id);
      setBoard(data.data.attributes.state);
      turn = getState().join('').length;
      if (!checkWinner() && turn===9) setMessage('Tie game.');
    });
  });
}

//== Game Functions ============================================================

function doTurn(td){
  updateState(td); turn++;
  if (checkWinner()){
    saveBoard(); resetBoard();
  } else if (turn===9){
    setMessage('Tie game.');
    saveBoard(); resetBoard();
  }
}

function updateState(td){
  $(td).text(player(turn));
}

function player(){
  return ( turn%2 ? 'O' : 'X' );
}

function setMessage(msg){
  $('div#message').text(msg);
}

function checkWinner(){
  let status = false;
  const oPos = getState().reduce( (arr,tok,idx) => {if (tok==='O') arr.push(idx); return arr}, []);
  const xPos = getState().reduce( (arr,tok,idx) => {if (tok==='X') arr.push(idx); return arr}, []);
  if (oPos.length >= 3 && !status) status = checkForWin(oPos, 'O');
  if (xPos.length >= 3 && !status) status = checkForWin(xPos, 'X');
  return status;
}

function checkForWin(playerPos, playerTok){
  let status = false;
  const winningCombos = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
  winningCombos.forEach(function(win){
    if ( win.filter(pos => -1 !== playerPos.indexOf(pos)).length === 3 ) status = true;
  });
  if (status) setMessage(`Player ${playerTok} Won!`);
  return status;
}

//== Helper Functions ==========================================================

function getState(){
  const arr = [];
  for (let y=0; y<3; y++){
    for (let x=0; x<3; x++){
      arr.push($(`td[data-x=${x}][data-y=${y}]`).text());
    }
  }
  return arr;
}

function setBoard(arr){
  for (let y=0; y<3; y++){
    for (let x=0; x<3; x++){
      $(`td[data-x=${x}][data-y=${y}]`).text(arr[y*3+x]);
    }
  }
}
