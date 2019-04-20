let turn = 0
let td_nodes = document.querySelectorAll("td")
const  WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "Y"
  }
}

function updateState(element) {

  $( element ).text( player() );
}

function setMessage(string) {
  document.getElementById('message').innerHTML = string;
}

function checkWinner() {
  let winner = false
  WIN_COMBINATIONS.forEach((combo) => {
      if (td_nodes[combo[0]].innerHTML == td_nodes[combo[1]].innerHTML && td_nodes[combo[1]].innerHTML == td_nodes[combo[2]].innerHTML &&  td_nodes[combo[1]].innerHTML != "") {
        setMessage(`Player ${td_nodes[combo[0]].innerHTML} Won!`)
        return  winner = true
        }
  });
  return winner
}

function doTurn(element) {
  turn++;

  updateState(element)
//   if (checkWinner()) {
//     turn = 0;
//     td_nodes.forEach((td) => {
//       td.innerHTML = "";
//     });
//    } else if (turn == 9) {
//     setMessage("Tie game.")
//     turn = 0;
//     td_nodes.forEach((td) => {
//       td.innerHTML = "";
//     });
//   }
}
