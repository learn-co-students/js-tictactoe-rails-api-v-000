// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  // helper variables
  let turn = 0
  let currentGame = 0
  let board = ["", "", "", "", "", "", "", "", ""]

  const $grids =
  [ $('td[data-x="0"]').filter('td[data-y="0"]'),
  $('td[data-x="1"]').filter('td[data-y="0"]'),
  $('td[data-x="2"]').filter('td[data-y="0"]'),
  $('td[data-x="0"]').filter('td[data-y="1"]'),
  $('td[data-x="1"]').filter('td[data-y="1"]'),
  $('td[data-x="2"]').filter('td[data-y="1"]'),
  $('td[data-x="0"]').filter('td[data-y="2"]'),
  $('td[data-x="1"]').filter('td[data-y="2"]'),
  $('td[data-x="2"]').filter('td[data-y="2"]') ]

  const winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]]

  // helper methods
  function gridInit() {
    $grids.forEach(function(element){
      element.click(function() {
        doTurn(this)
      })
    })
  }

  function gridEmpty() {
    $grids.forEach(function(element){
      element.empty()
    })
  }

  function reset() {
    $('td').off('click')
    gridInit()
    gridEmpty()
    board = ["", "", "", "", "", "", "", "", ""]
    currentGame = 0
    turn = 0
  }

  function updateBoard(array) {
    let i = 0
    $grids.forEach(function(element) {
      element.off('click')
      element.html(array[i])
      if (element.html() === "") {
        element.click(function() {
          doTurn(this)
        })
      }
      i++
    })
    board = array
    turn = array.filter(Boolean).length
  }

  function player() {
    return turn % 2 === 0 ? "X" : "O"
  }

  function updateState(dom_element) {
    $(dom_element).html(player())
  }

  function setMessage(string) {
    $('#message').html(string)
  }

  function checkWinner() {
    let winner = false
    let result = winCombos.find(function(combo) {
        return board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] ===  board[combo[2]]
    })
    if (result) {
      setMessage(`Player ${player()} Won!`)
      $('td').off('click')
      winner = true
      saveGame()
    }
    return winner
  }

  function doTurn(dom_element) {
    updateState(dom_element)
    let addition = 0
    if ($(dom_element).data('y') === 1) {
      addition = 3
    } else if ($(dom_element).data('y') === 2) {
      addition = 6
    }
    board[`${$(dom_element).data('x') + addition}`] = player()
    $(dom_element).off('click')
    checkWinner()
    turn === 8 && checkWinner() !== true ? (setMessage('Tie game.'), saveGame()) : turn++
  }

  function previousGames() {
    return $.get('/games/')
  }

  function saveGame() {
    previousGames().success(function(data){
      let currentExisting = data.data.find(function(element) {
        return element.id === String(currentGame)
      })
      if (currentExisting) {
        $.ajax({
           type: "PATCH",
           url: `/games/${currentGame}`,
           data: {
              'state': board
           }
        })
        } else {
          $.post('/games', {state: board})
        }
    })
  }

  function attachListeners() {
    gridInit()

    $('button#previous').click(function() {
      $('#games').empty()
      previousGames().success(function(data){
        data.data.forEach(function(element){
          $('#games').append(`<li><button class="${element.id}">${element.id}</button></li>`)
        })
      })
    })

    $('#games').on('click', 'button', function() {
      let game = this.className
      $.get(`/games/${game}`).success(function(data) {
        updateBoard(data.data.attributes.state)
        currentGame = parseInt(game)
        checkWinner()
        $('#message').empty()
      })
    })

    $('button#save').click(function() {
      saveGame()
    })

    $('button#clear').click(function() {
      $('#message').empty()
      reset()
    })
  }

  // start
  attachListeners()
})
