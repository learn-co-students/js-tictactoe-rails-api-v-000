var turn = 0;
var currentGame = 1;
//var state = [];
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
    $.get("/games")
  });
  
  if (currentGame === 0) {  
    $('#save').click(function(){
      $.ajax({ type: "POST", url: "/games"});
    });
  }
  else {  
    $('#save').click(function(){
      //$.ajax({ type: "PATCH", url: "/games/" + currentGame, data: { state: JSON.stringify(getState())} });
      $.ajax({ type: "PATCH", url: "/games/" + currentGame, data: { state: getState()} });
    });
  }
}

function doTurn(event) {
    //console.log(event);
    //console.log(turn);
    if (updateState(event)) {
      checkWinner();
      turn += 1;
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
  //console.log($( Object.values(event)[0] ));
  //console.log(test)
  //console.log(!test);
  if (!test) {
    $( Object.values(event)[0] ).text(player());
    return true
  }
  return false;
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

function checkWinner() {
  ////s0 = { selector: '[data-x="0"][data-y="0"]' };
  ////s0text = $( Object.values(s0)[0] ).text();
  ////s2 = { selector: '[data-x="1"][data-y="0"]' };
  ////s2text = $( Object.values(s1)[0] ).text();
  ////s2 = { selector: '[data-x="2"][data-y="0"]' };
  ////s2text = $( Object.values(s2)[0] ).text();
  ////s3 = { selector: '[data-x="0"][data-y="1"]' };
  ////s3text = $( Object.values(s3)[0] ).text();
  ////s4 = { selector: '[data-x="1"][data-y="1"]' };
  ////s4text = $( Object.values(s4)[0] ).text();
  ////s5 = { selector: '[data-x="2"][data-y="1"]' };
  ////s5text = $( Object.values(s5)[0] ).text();
  ////s6 = { selector: '[data-x="0"][data-y="2"]' };
  ////s6text = $( Object.values(s6)[0] ).text();
  ////s7 = { selector: '[data-x="1"][data-y="2"]' };
  ////s7text = $( Object.values(s7)[0] ).text();
  ////s8 = { selector: '[data-x="2"][data-y="2"]' };
  //s8text = $( Object.values(s8)[0] ).text();
  //console.log(s1text, s2text, s3text, s4text, s5text, s6text, s7text, s8text, s9text);
  let currentState = getState();
  console.log(currentState);
  let result = false;
  let winner;
  ["X", "O"].forEach(function(l) {
    if (
      //(s0text === l && s1text === l && s2text === l) ||
      //(s3text === l && s4text === l && s5text === l) ||
      //(s6text === l && s7text === l && s8text === l) ||
      //(s0text === l && s3text === l && s6text === l) ||
      //(s1text === l && s4text === l && s7text === l) ||
      //(s2text === l && s5text === l && s8text === l) ||
      //(s0text === l && s4text === l && s8text === l) ||
      //(s2text === l && s4text === l && s6text === l) )
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
  if (result)
    if (winner == "tie")
      message("Tie game");
    else
      message("Player " + winner + " Won!")
 return result;
  //console.log($( Object.values(s1)[0] ).text())
}

function message(string) {
   $("#message").text(string);
}