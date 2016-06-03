$.each(winningCombinations[3], function(index, value) {
  $('td[data-x=' + value[0] + '][data-y=' + value[1] + ']').text("X");
});

var winner = winningCombinations.filter(function(combo) {
return ($('td[data-x=' + combo[0][0] + '][data-y=' + combo[0][1] + ']').text() === "X") &&
($('td[data-x=' + combo[1][0] + '][data-y=' + combo[1][1] + ']').text() === "X") &&
($('td[data-x=' + combo[2][0] + '][data-y=' + combo[2][1] + ']').text() === "X");
});
if (winner.length > 0) { $('#message').text("There's a winner"); return true} else { $('#message').text("no one won"); return false;}

Broken method with DRY logic for ajax
function saveGame(){
  var current = findcurrentBoard()
  if (currentGame == 0) {
    var url = '/games'
    var method = 'POST'}
  else {
    var url = '/games/' + currentGame;
    var method = 'PATCH'
  }

  $.ajax(
    { url: url,
      method: method,
      dataType: 'json',
      data: current,

}
