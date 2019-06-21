const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function player() {
  if ((turn % 2) === 1) {
    return "O"
  } else {
    return "X"
  }
}

function updateState(square) {
  square.innerHTML = player()
}

function setMessage(string) {
  $("#message").html(string)
}

function checkWinner() {
  WINNING_COMBOS.forEach(function(combo){
    if (document.querySelectorAll("td")[combo[0]].innerHTML != "" && document.querySelectorAll("td")[combo[0]].innerHTML === document.querySelectorAll("td")[combo[1]].innerHTML && document.querySelectorAll("td")[combo[1]].innerHTML === document.querySelectorAll("td")[combo[2]].innerHTML) {
      if document.querySelectorAll("td")[combo[0]].innerHTML === "X" {
        setMessage("Player X Won!")
        return true
      } else {
        setMessage("Player O Won!")
        return true
      }
    }
  })
  return false
}
