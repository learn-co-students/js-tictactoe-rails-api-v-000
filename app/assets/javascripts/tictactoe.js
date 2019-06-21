let turn = 0

function player() {
  if (Number.isInteger(turn/2)) {
    return "X"
  } else {
    return "O"
  }
}
