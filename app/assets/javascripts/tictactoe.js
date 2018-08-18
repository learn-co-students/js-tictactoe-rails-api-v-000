// Code your JavaScript / jQuery solution here

class Game {
  constructor(attr) {
    this.state = attr['state']
    this.id = attr['id'] 
  }
}

var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0
var savedGame = 0

$(document).ready($('#save').on('click', console.log(this)))

function saveGame() {
    var state = []
    $('td').text((index, data) => {
      state.push(data);
    });
    var sendData = { state: state }
    console.log('test')
    if (savedGame) {
        $.patch(`/games/${savedGame}`, sendData, function() {
            console.log('LOGGGGED!!!!!!!!!!!!!!!!!!')
        })
    }
}

function player() {
    if (turn%2 === 0) {
        return "X"        
    } else {
        return "O"
    }
}

function updateState(box) {
    let marker = player()
    $(box).text(marker)
}

function setMessage(msg) {
    $('#message').text(msg)
}

function checkWinner(state) {
    var board = {}
    var winner = false
    $('td').text((index, string) => board[index] = string)  // text() can be set to a callback passing the index and text od the elements parses.
    WINNING_COMBOS.some((pattern) => {  // .some iterates through arrays and returns wether or not the any of the elements passes the callback truthfully
        let a = board[pattern[0]] !== ""
        let b = board[pattern[0]] === board[pattern[1]] && board[pattern[1]] == board[pattern[2]]
        if (a && b) {
            setMessage(`Player ${board[pattern[0]]} Won!`)
            return winner = true
        }
    })
    return winner
}


$.patch = function(url, data, callback, type){
 
  if ( $.isFunction(data) ){
    type = type || callback,
    callback = data,
    data = {}
  }
 
  return $.ajax({
    url: url,
    type: 'patch',
    success: callback,
    data: data,
    contentType: type
  });
}