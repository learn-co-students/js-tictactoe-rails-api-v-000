$(document).ready(function(){
  attachListeners();
})

var turn = 0;
var bool = false;
var token;
var winner;

var player = function() {
  bool  = !bool;
  token = (bool === true) ? 'X' : 'O';
  return token;
}

var message = function(text) {
  $('#message').append(text);
}

var updateState = function(obj) {
  // $(this) is being passed in through doTurn() as obj, woot woot!
  obj.append(player());
}

var doTurn = function(obj) {
  turn++;
  updateState(obj);
  checkWinner();
}

var checkWinner = function() {
debugger
  Array.prototype.sameValues = function() {
   for (var i = 1; i < this.length; i++){
    if (this[i] !== this[0])
      return false;
   }
   return true
  };

  var values = [];

  $('table td').each(function() {
    values.push($(this).text());
  })

  var diagRow1 = [],
      diagRow2 = [],
      vertCol1 = [],
      vertCol2 = [],
      vertCol3 = [];
      diagRow1.push(values[0], values[4], values[8]); // diag row 1
      diagRow2.push(values[6], values[4], values[2]); // diag row 2
      vertCol1.push(values[0], values[3], values[6]); // vert col 1
      vertCol2.push(values[1], values[4], values[7]); // vert col 2
      vertCol3.push(values[2], values[5], values[8]); // vert col 3

  switch (true) {
    case (values.slice(0,3).sameValues()): // top row
      debugger
      (values.slice(0,3)[0] === 'X' || values.slice(0,3)[0] === 'O') ? message('Player '+values.slice(0,3)[0]+' Won!') : break;
      return true;
      break;
    case (values.slice(3,6).sameValues()): // mid row
      debugger
      (values.slice(3,6)[0] === 'X' || values.slice(3,6)[0] === 'O') ? message('Player '+values.slice(3,6)[0]+' Won!') : break;
      return true; 
      break;
    case (values.slice(6,9).sameValues()): // bot row
      debugger
      (values.slice(6,9)[0] === 'X' || values.slice(6,9)[0] === 'O') ? message('Player '+values.slice(6,9)[0]+' Won!') : break;
      return true;
      break;
    case (diagRow1.sameValues()):
      debugger
      (diagRow1[0] === 'X' || diagRow1[0] === 'O') ? message('Player '+diagRow1[0]+' Won!') : break;
      return true;
      break;
    case (diagRow2.sameValues()):
      debugger
      (diagRow2[0] === 'X' || diagRow2[0] === 'O') ? message('Player '+diagRow2[0]+' Won!') : break;
      return true;
      break;
    case (vertCol1.sameValues()):
      debugger
      (vertCol1[0] === 'X' || vertCol1[0] === 'O') ? message('Player '+vertCol1[0]+' Won!') : break;
      return true;
      break;
    case (vertCol2.sameValues()):
      debugger
      (vertCol2[0] === 'X' || vertCol2[0] === 'O') ? message('Player '+vertCol2[0]+' Won!') : break;
      return true;
      break;
    case (vertCol3.sameValues()):
      debugger
      (vertCol3[0] === 'X' || vertCol3[0] === 'O') ? message('Player '+vertCol3[0]+' Won!') : break;
      return true;
      break;
    default:
      return false;
  }

}

var attachListeners = function() {
  $('tr td').click(function(event) {
    // maybe need to pass event to function() and then to doTurn
    doTurn($(this));
  })
}
