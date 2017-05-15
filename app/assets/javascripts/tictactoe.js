function attachListeners() {
  $('td').on('click', function(event) {
    doTurn(event);
  });

  $('#previous').on('click', function() {
    getGames();
  });

  $('#save').on('click', function() {
    saveGame();
  });

  $("#games").on("click", "li", function(event) {
    currentGame = $(this).text();
    loadPreviousGame(event);
  });
};

$(document).ready(function() {
  attachListeners();
});
