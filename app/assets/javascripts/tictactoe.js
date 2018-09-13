// Code your JavaScript / jQuery solution here
function player() {
  return (turn % 2 == 1) ? "O" : "X"
};

function updateState(square) {
  square.innerHTML = player();
};

function setMessage(message) {
  messageDiv.innerHTML = message;
};

function checkWinner() {
  return checkRows("x") || checkRows("y") || checkDiagonals()
}

function checkRows(axis) {
  return [0, 1, 2].some(function(row_index) {
    const row = $("td[data-" + axis + "=" + row_index + "]");
    const symbols = $.makeArray(row).map(square => square.innerHTML);
    return threeInRow(symbols) && noneEmpty(symbols)
  });
}

function checkDiagonals() {
  const rows = [[0, 4, 8], [2, 4, 6]];
  return rows.some(function(row) {
    const symbols = row.map(s => squares[s].innerHTML);
    return threeInRow(symbols) && noneEmpty(symbols);
  });
};

function threeInRow(symbols) {
  return [...new Set(symbols)].length == 1
}

function noneEmpty(symbols) {
  return !symbols.includes("");
}
