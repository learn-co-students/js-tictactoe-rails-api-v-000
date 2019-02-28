// Code your JavaScript / jQuery solution here
// $(function() {
//   $('button#save').on("click", function(e) {
//     e.preventDefault();
//     console.log("hello");
//   })
// })

const WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

var turn = 0

var player = function() {
  return turn % 2 ? 'O' : 'X';
};


$(document).ready(function() {
  eventListeners();
});

function eventListeners() {
  $('button#save').on('click', function() {
    console.log("save game");
  });
  $('button#previous').on('click', function() {
    console.log("previous games");
  });
  $('button#clear').on('click', function() {
    console.log("clear");
  });
};
