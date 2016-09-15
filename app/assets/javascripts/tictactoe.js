var turn = 0;



const WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ];
  
function setBoard(state){
	var previousBoard = ['<table border="1" cellpadding="40">',
		'<tr>',
			'<td data-x="0" data-y="0">'+state[0]+'</td>',
			'<td data-x="1" data-y="0">'+state[1]+'</td>',
			'<td data-x="2" data-y="0">'+state[2]+'</td>',
		'</tr>',
		'<tr>',
		'	<td data-x="0" data-y="1">'+state[3]+'</td>',
		'	<td data-x="1" data-y="1">'+state[4]+'</td>',
		'	<td data-x="2" data-y="1">'+state[5]+'</td>',
		'</tr>',
		'<tr>',
		'	<td data-x="0" data-y="2">'+state[6]+'</td>',
		'	<td data-x="1" data-y="2">'+state[7]+'</td>',
		'	<td data-x="2" data-y="2">'+state[8]+'</td>',
		'</tr>',
	'</table>'].join('');  
	$('table').replaceWith(previousBoard);
}

function reset() {
  		var freshTable = ['<table border="1" cellpadding="40">',
			'<tr>',
				'<td data-x="0" data-y="0"></td>',
				'<td data-x="1" data-y="0"></td>',
				'<td data-x="2" data-y="0"></td>',
			'</tr>',
			'<tr>',
			'	<td data-x="0" data-y="1"></td>',
			'	<td data-x="1" data-y="1"></td>',
			'	<td data-x="2" data-y="1"></td>',
			'</tr>',
			'<tr>',
			'	<td data-x="0" data-y="2"></td>',
			'	<td data-x="1" data-y="2"></td>',
			'	<td data-x="2" data-y="2"></td>',
			'</tr>',
		'</table>'].join('');
		debugger
		$('table').replaceWith(freshTable);
}
              
function setFixtures() {
    
}

function doTurn(e) {
  
  console.log("doTurn fired. Turn: "+turn);
  console.log("It is player " + player() +"'s turn");
  updateState(e);
  checkWinner();
  turn++;
}

function retrieveBoard(id) {
  $.get('/games/'+id,  function(data, status){
      setBoard(data.game.state);
    });
}

function saveBoard() {
    var board = $('td').map(function() {
             return $(this).text();
            }).get();
    $.ajax({
      type: "POST",
      url: '/games',
      data: { game : { state: board } },
    });
}

function checkWinner() {
  var board = $('td').map(function() {
                 return $(this).text();
              }).get();
  $.each(WIN_COMBINATIONS, function(index, combo) {
    (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] != "") ? message(board[combo[0]]) : console.log("no win");
  })
}

function updateState(e) {
  var x = e.data("x");
  var y = e.data("y");
  $('td[data-x="' + x + '"][data-y="'+ y +'"]').append(player);
  return player;
}

function player() {
  return (turn % 2 === 0) ? 'X' : 'O';
}

function message(player) {
  $('#message').html("Player " + player + " Won!");
  saveBoard();
  reset();
}

function showPrevious() {
    $.get('/games', function(data, status){
      $('#list').html("");
      $.each(data.games, function(index, game) {
        $('#list').append("<li class='previous-game' id="+game.id+">Game id: "+game.id+"</li>")
      });
    });
};


function attachListeners() {
  $('td').on('click', function(e) {
    doTurn($(this));
  });
  $('#save').on('click', function() {
    saveBoard();
    showPrevious();
    reset();
  });
  $('#previous').on('click', function() {
    showPrevious();
  });
  $('#list').on('click', '.previous-game', function() {
    retrieveBoard($(this).attr('id'));
  });
}



$(document).ready(function(){
    attachListeners();
});