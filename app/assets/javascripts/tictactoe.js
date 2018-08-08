$(document).ready(attachListeners);

const squares = document.getElementsByTagName('td');

function attachListeners() {
  document.getElementById("save").addEventListener('click', saveGame);
  document.getElementById("previous").addEventListener('click', previousGame);
  document.getElementById("clear").addEventListener('click', clearGame);
  squares[0].addEventListener('click', saveGame);
}

function saveGame() {
  document.getElementById("message").innerHTML = "testing save";
}

function previousGame() {
  document.getElementById("message").innerHTML = "testing previous";
}

function clearGame() {
  document.getElementById("message").innerHTML = "testing clear";
}
