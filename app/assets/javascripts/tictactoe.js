var turn = 0;
var currentGame = 0;

$(document).ready(attachListeners);

function attachListeners() {
  for (let x = 0; x <= 2; x++)
    for (let y = 0; y <= 2; y++) {
      let selector = '[data-x="' + x + '"][data-y="' + y + '"]'
      $(selector).click(function(){
        doTurn({selector});
      });
    }
  $('#previous').click(function(){
    event.preventDefault();
    show();
  });
  
  $('#save').click(function(){
    event.preventDefault();
    save();
  });
}

function save() {
  var values = { game: { id: currentGame, state: getState() } };
  if (currentGame === 0) {
    //var newGame = $.ajax({ type: "POST", url: "/games", data: { state: getState()} });
    var newGame = $.ajax({ type: "POST", url: "/games", data: values });
    newGame.success(function(data) {
      currentGame = Number(data);
    });
  }
  else {
    $('#save').click(function() {
     // $.ajax({ type: "PATCH", url: "/games/" + currentGame, data: { state: getState()} });
      $.ajax({ type: "PATCH", url: "/games/" + currentGame, data: values });
    });
  }
  
}

function show() {
  var response = $.ajax({ type: "GET", url: "/games" });
  response.done(function(data) {
    data.games.forEach(function(game) {
      $("#games").append("<a id = 'game" + game.id + "' href=/games/" + game.id + ">" + game.id + "</a><br>");
      $('#game'+ game.id).click(function(){
        event.preventDefault();
        load(game.id);
      });
    })
  })
}

function load(element) {
  var game = $.ajax({ type: "GET", url: "/games/" + element });
  game.success(function(data) {
      let state = JSON.parse(data);
      var count = 0;
      s0 = { selector: '[data-x="0"][data-y="0"]' };
      $( Object.values(s0)[0] ).text(state[0]);
      s1 = { selector: '[data-x="1"][data-y="0"]' };
      $( Object.values(s1)[0] ).text(state[1]);
      s2 = { selector: '[data-x="2"][data-y="0"]' };
      $( Object.values(s2)[0] ).text(state[2]);
      s3 = { selector: '[data-x="0"][data-y="1"]' };
      $( Object.values(s3)[0] ).text(state[3]);
      s4 = { selector: '[data-x="1"][data-y="1"]' };
      $( Object.values(s4)[0] ).text(state[4]);
      s5 = { selector: '[data-x="2"][data-y="1"]' };
      $( Object.values(s5)[0] ).text(state[5]);
      s6 = { selector: '[data-x="0"][data-y="2"]' };
      $( Object.values(s6)[0] ).text(state[6]);
      s7 = { selector: '[data-x="1"][data-y="2"]' };
      $( Object.values(s7)[0] ).text(state[7]);
      s8 = { selector: '[data-x="2"][data-y="2"]' };
      $( Object.values(s8)[0] ).text(state[8]);
      state.forEach((element) => { if (element == "X" || element == "O") count += 1 })
      turn = count;
      currentGame = element;
    });
}

function doTurn(event) {
    if (updateState(event)) {
      if (!checkWinner())
        turn += 1;
      else
        gameOver();
    }
}

function player() {
  if (turn % 2 == 0)
    return "X";
  else
    return "O";
}

function updateState(event) {
  //console.log(event);
  test = $( Object.values(event)[0] ).text();
  if (!test) {
    $( Object.values(event)[0] ).text(player());
    return true
  }
  return false;
}

function resetBoard() {
  s0 = { selector: '[data-x="0"][data-y="0"]' };
  $( Object.values(s0)[0] ).text("");
  s1 = { selector: '[data-x="1"][data-y="0"]' };
  $( Object.values(s1)[0] ).text("");
  s2 = { selector: '[data-x="2"][data-y="0"]' };
  $( Object.values(s2)[0] ).text("");
  s3 = { selector: '[data-x="0"][data-y="1"]' };
  $( Object.values(s3)[0] ).text("");
  s4 = { selector: '[data-x="1"][data-y="1"]' };
  $( Object.values(s4)[0] ).text("");
  s5 = { selector: '[data-x="2"][data-y="1"]' };
  $( Object.values(s5)[0] ).text("");
  s6 = { selector: '[data-x="0"][data-y="2"]' };
  $( Object.values(s6)[0] ).text("");
  s7 = { selector: '[data-x="1"][data-y="2"]' };
  $( Object.values(s7)[0] ).text("");
  s8 = { selector: '[data-x="2"][data-y="2"]' };
  $( Object.values(s8)[0] ).text("");
}

function resetGameNumber() {
    currentGame = 0;
}

function getState() {
  s0 = { selector: '[data-x="0"][data-y="0"]' };
  s0text = $( Object.values(s0)[0] ).text();
  s1 = { selector: '[data-x="1"][data-y="0"]' };
  s1text = $( Object.values(s1)[0] ).text();
  s2 = { selector: '[data-x="2"][data-y="0"]' };
  s2text = $( Object.values(s2)[0] ).text();
  s3 = { selector: '[data-x="0"][data-y="1"]' };
  s3text = $( Object.values(s3)[0] ).text();
  s4 = { selector: '[data-x="1"][data-y="1"]' };
  s4text = $( Object.values(s4)[0] ).text();
  s5 = { selector: '[data-x="2"][data-y="1"]' };
  s5text = $( Object.values(s5)[0] ).text();
  s6 = { selector: '[data-x="0"][data-y="2"]' };
  s6text = $( Object.values(s6)[0] ).text();
  s7 = { selector: '[data-x="1"][data-y="2"]' };
  s7text = $( Object.values(s7)[0] ).text();
  s8 = { selector: '[data-x="2"][data-y="2"]' };
  s8text = $( Object.values(s8)[0] ).text();
  
  return [s0text, s1text, s2text, s3text, s4text, s5text, s6text, s7text, s8text];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function gameOver() {
  save();
  resetBoard();
  turn = 0;
  while (currentGame < 1) {
    await sleep(1000);
  }
  currentGame = 0;
}

function checkWinner() {
  let currentState = getState();
  //console.log(currentState);
  let result = false;
  let winner;
  ["X", "O"].forEach(function(l) {
    if (
      (currentState[0] === l && currentState[1] === l && currentState[2] === l) ||
      (currentState[3] === l && currentState[4] === l && currentState[5] === l) ||
      (currentState[6] === l && currentState[7] === l && currentState[8] === l) ||
      (currentState[0] === l && currentState[3] === l && currentState[6] === l) ||
      (currentState[1] === l && currentState[4] === l && currentState[7] === l) ||
      (currentState[2] === l && currentState[5] === l && currentState[8] === l) ||
      (currentState[0] === l && currentState[4] === l && currentState[8] === l) ||
      (currentState[2] === l && currentState[4] === l && currentState[6] === l) )

    { result = true;
      winner = l;
    }
  })
  if (!!s0text && !!s1text && !!s2text && !!s3text && !!s4text && !!s5text && !!s6text && !!s7text && !!s8text) {
    result = true;
    winner = "tie";
  }
  if (result) {
    if (winner == "tie")
      message("Tie game");
    else
      message("Player " + winner + " Won!")
  }
  return result;
}

function message(string) {
   $("#message").text(string);
}