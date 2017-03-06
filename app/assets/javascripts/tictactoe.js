var turn = 0;

function attachListeners() {
  $("table td").on('click', function (event) {
    doTurn(event);
  });

  $("#previous").on("click", showPrevious())

  $("#save").on("click", saveGame())
}

function doTurn(event) {
  updateState(event);
  turn += 1;
  checkWinner();

}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(event) {
  if (event.target.textContent === "") {
    event.target.textContent = player();
  }
}

function checkWinner() {
  var arr = ['0', '1', '2']
  var positionXs = [];
  var positionYs = [];
  debugger
  $("td:contains('X')").each(function(){
    var pos = []
    pos.push(this.dataset["x"])
    pos.push(this.dataset["y"])
	  positionXs.push(pos)
  });
  $("td:contains('Y')").each(function(){
    var pos = []
    pos.push(this.dataset["x"])
    pos.push(this.dataset["y"])
    positionYs.push(pos)
  });

  debugger
  if (turn === 8) {
    message('Tie game');
    turn = 0;
    $("td").each(function() {
      this.innerText = ""
    });
  }
  return false
}

function message(string) {
  $("#message").text(string);
}

function showPrevious() {
  
}

function saveGame() {

}
