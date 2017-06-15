const winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
var turn = 0

$(document).ready(function() {
  attachListeners()
});

function attachListeners() {
  $('td').on('click', function(event) {
    doTurn(event)
  })

  $('#previous').on('click', function(event){
    getPrevious(event)
  })

  $('#save').on('click', function(event) {
    var values = getTableValues();
    var posting = $.ajax({
       type: "POST",
       data: {game:{state:values}},
       url: "/games",
     });
     posting.done(function(data){
       console.log(data);
     })
     posting.fail(function(error) {
       console.log(error);
     })
  })
}



function doTurn(event) {
  turn += 1
  updateState(event)
  checkWinner()
}

function getPrevious(event) {
  $.get('/games').done(function(data) {
    var ul = '<ul>'
    data.games.forEach(function(game) {
      ul += '<li onclick="getGame(this)">' + game.id + '</li>'
    })
    ul += '</ul>'
    $('#games').html(ul)
  })
}

function getGame(game) {
  var oldGame = $.get('/games/'+game.innerHTML)
  oldGame.done(function(data){
    var state = data.game.state
    $('td').each(function(index, value){
      value.innerHTML = state[index]
    });
    $('table').attr('id', data.game.id)
  })
}

function checkWinner() {

}

function getTableValues() {
  var data = []
  $('td').each(function() {
    data.push(this.innerHTML)
  })
  return data
};

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(event) {
  return event.target.innerHTML = player()
}
