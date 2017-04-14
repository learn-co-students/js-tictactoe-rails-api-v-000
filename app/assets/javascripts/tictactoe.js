"use strict";

var turn = 0
var currentGame
var wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

//-----------------------------------------------------------------------------
// Game Class

function Game(game) {
  this.state = game.state
  this.id = game.id
}

Game.prototype.renderLI = function() {
  return Game.template(this)
}

Game.ready = function() {
  var source = $("#game-template").html()
  Game.template = Handlebars.compile(source)
  Game.attachListeners()
}

// Processing events
// Remove from Game for tests
Game.attachListeners = function() {
  $("table").on("click", "td", function(ev) {
    doTurn(ev)
  })

  $("#save").on("click", Game.clickSave)
  $("#previous").on("click", Game.clickPrevious)
  $("#games").on("click", "li", Game.downloadGame)
}

Game.clickSave = function(ev) {
  ev.preventDefault()
  Game.save()
}

Game.save = function(reset = false) {
  var data, url, method

  var data = {
    game: {
      state: getArray(),
    }
  }

  if(!reset && currentGame) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    data: data,
    type: method,
    dataType: "json"
  })
  .done(function(json) {
    var game = new Game(json.game)
    if(!reset) {
      currentGame = json.game.id
    } else {
      currentGame = undefined
    }
  })
  .fail(function(error) {
    alert("Error!!!", error)
  })
}

Game.clickPrevious = function(ev) {
  ev.preventDefault()
  $.ajax({
    url: "/games",//$(this).data("url"),
    dataType: "json"
  })
  .done(Game.onLoadGames)
  .fail(Game.onFailedLoadGames)
}

Game.onLoadGames = function(json_array) {
  var $el = $("#games")
  $el.html("")
  var $array = $()
  json_array.games.forEach(function(json) {
    var game = new Game(json)
    $array = $array.add(game.renderLI()) // For tests change to "<li>" + game.id + "</li>"
  })
  $el.append($array)
}

Game.onFailedLoadGames = function(error) {
  console.log(error)
  alert("Something went wrong...", error)
}

Game.downloadGame = function() {
  var id = $(this).data("id")

  $.ajax({
    url: "/games/" + id,
    dataType: "json"
  })
  .done(Game.onLoadGame)
  .fail(Game.onFailedLoadGame)
}

Game.onLoadGame = function(json) {
  setArray(json.game.state)
  computeTurn()
  currentGame = json.game.id
}

Game.onFailedLoadGame = function(error) {
  console.log(error)
  alert("Something went wrong...", error)
}

//-----------------------------------------------------------------------------
// Game process

function doTurn(ev) {
  let $el = $(ev.target)
  let x = $el.data("x")
  let y = $el.data("y")

  if(!$el.text()){
    updateState(ev)
    turn++
    checkWinner()
  }
}

function player() {
  return (turn % 2 === 0) ? "X" : "O"
}

function updateState(ev) {
  let $el = $(ev.target)
  $el.text(player())
}

function checkWinner() {
  let arr = getArray()

  wins.forEach(function(combo) {
    if(arr[combo[0]] && (arr[combo[0]] === arr[combo[1]]) && (arr[combo[1]] === arr[combo[2]])) {
      message(`Player ${arr[combo[0]]} Won!`)
      reset()
      return true
    }
  })

  if(arr.every((el) => el)) {
    message("Tie game")
    reset()
    return true;
  }

  return false
}

function getArray() {
  return $("td").map(function() { return $(this).text() }).get()
}

function setArray(array) {
  var l1, l2, i
  l1 = array.length
  var els = $("td").toArray()

  l2 = els.length
  if(l1 !== l2) {
    return false
  }

  for(i = 0; i < l1; i++) {
    els[i].textContent = array[i]
  }
}

function message(msg) {
  $("#message").text(msg)
}

function reset() {
  // ToDo. Save to DB
  Game.save(true)
  clearCells()
  turn = 0
}

function clearCells() {
  $("td").each(function() { $(this).text("") })
}

function computeTurn() {
  var arr = getArray()
  var i, l = arr.length, cnt = 0
  for(i = 0; i < l; i++) {
    if(arr[i] === "X" || arr[i] === "O") {
      cnt++
    }
  }
  turn = cnt
}

// --------------------------------------------------------------------------
// Document Ready

$(document).ready(function() {
  Game.ready()
})
