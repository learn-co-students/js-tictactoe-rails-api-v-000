// Code your JavaScript / jQuery solution here
let turn = 1

const player = () => {
  return turn%2 == 0 ? "O" : "X"
}

const doTurn = () => {
  return turn++
}

function updateState(event) {
  let token = player(turn)
  event.target.textContent = token
  doTurn(turn)
}

const attachListeners = () => {
  var cells = Array.from(document.getElementsByTagName("td"))
  cells.forEach(cell => {
    cell.addEventListener("click", (e) => {updateState(e)}, {once: true})
  })
  
}

$(function() {
  attachListeners()
 
});