var turn = 0;

function attachListeners() {
  $('td').click(function(e) {
    e.preventDefault();
    let result = doTurn(e);
  //   if (result === "over") {
  //     $('td').each(function(td) {
  //       this.innerHTML = "";
  //     });
  //     $('#message').text("");
  //   }
  });
}

function doTurn(e) {
  let result = updateState(e);
  if (result !== false) {
    turn++;
    checkWinner();
  }

  if($('#message').text() !== "") {
    return "over";
  }
}

//create Object to contain win combos? iterate of td selector collection? better way in general possible?
function checkWinner() {
  //positions
  var one = $('td[data-x="0"][data-y="0"]').text();
  var two = $('td[data-x="1"][data-y="0"]').text();
  var three = $('td[data-x="2"][data-y="0"]').text();
  var four = $('td[data-x="0"][data-y="1"]').text();
  var five = $('td[data-x="1"][data-y="1"]').text();
  var six = $('td[data-x="2"][data-y="1"]').text();
  var seven = $('td[data-x="0"][data-y="2"]').text();
  var eight = $('td[data-x="1"][data-y="2"]').text();
  var nine = $('td[data-x="2"][data-y="2"]').text();
  var board = [one, two, three, four, five, six, seven, eight, nine];
  //horizontal win combos
  if(one !== "" && one === two && two === three) {
    turn = 0;
    return message(`Player ${one} Won!`);
  } else if (four !== "" && four === five && five === six) {
    turn = 0;
    return message(`Player ${four} Won!`);
  } else if (seven !== "" && seven === eight && eight === nine) {
    turn = 0;
    return message(`Player ${seven} Won!`);
  //vertical win combos
  } else if (one !== "" && one === four && four === seven) {
    turn = 0;
    return message(`Player ${one} Won!`);
  } else if (two !== "" && two === five && five === eight) {
    turn = 0;
    return message(`Player ${two} Won!`);
  } else if (three !== "" && three === six && six === nine) {
    turn = 0;
    return message(`Player ${three} Won!`);
    //diagonal win combos
  } else if (one !== "" && one === five && five === nine) {
    turn = 0;
    return message(`Player ${one} Won!`);
  } else if (three !== "" && three === five && five === seven) {
    turn = 0;
    return message(`Player ${three} Won!`);
  } else if (!board.includes("")) {
    turn = 0;
    return message('Tie game');
  } else {
    return false
  }
}

function updateState(e) {
  var move = player();
  if (e.target.innerHTML === "") {
    e.target.append(move);
  } else {
    return false;
  }
}

function player() {
  if(turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function message(winner) {
  $('div#message').text(winner);
}

$(document).ready(attachListeners);
