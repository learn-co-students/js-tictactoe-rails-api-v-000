// Code your JavaScript / jQuery solution here
$(function() {
  attachListeners()
});

var turn = 0

function player() {
  return turn%2 == 0 ? "X" : "O"
}

function doTurn(el) {
  turn++
  updateState(el)
}

function updateState(el) {
  let token = player()
  el.textContent = token
}

function attachListeners() {
  var cells = Array.from(document.getElementsByTagName("td"))
  cells.forEach(cell => {
    cell.addEventListener("click", (e) => {doTurn(e.target)}, {once: true})
  })
}