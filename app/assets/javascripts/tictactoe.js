// Code your JavaScript / jQuery solution here
$(function() {
  attachListeners()
});

let turn = 1

function player() {
  return turn%2 == 0 ? "O" : "X"
}

function doTurn(e) {
  updateState(e.target)
  turn++
}

function updateState(el) {
  let token = player()
  el.textContent = token
}

function attachListeners() {
  var cells = Array.from(document.getElementsByTagName("td"))
  cells.forEach(cell => {
    cell.addEventListener("click", (e) => {doTurn(e)}, {once: true})
  })
}