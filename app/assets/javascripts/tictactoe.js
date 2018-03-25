// Code your JavaScript / jQuery solution here
// https://github.com/Booligan/ttt-with-ai-project-v-000/blob/master/lib/game.rb
var turn = 0;
var  winCombinations = [
                          [0,1,2],
                          [3,4,5],
                          [6,7,8],
                          [0,3,6],
                          [1,4,7],
                          [2,5,8],
                          [0,4,8],
                          [2,4,6]
                        ]

function player() {
    return turn%2 === 0 ? 'X':'O';
}

function updateState(tdElement) {
    let token = player();
    $(tdElement).html(token) ;
}

function setMessage(message) {
    $('div#message').html(message) ;
}

function checkWinner() {
    let currentBoard = [];
    const squares = window.document.querySelectorAll('td');
    squares.forEach(x => currentBoard.push(x.innerHTML));
    // if (squares[0].innerHTML === squares[1].innerHTML === squares[2].innerHTML || squares[3].innerHTML === squares[4].innerHTML === squares[5].innerHTML || squares[6].innerHTML === squares[7].innerHTML === squares[8].innerHTML) {
    //     // setMessage("Player" + squares[0].innerHTML +  "Won!")
    //     return true;
    // }
    for (let i=0; i < winCombinations.length; i++) {
        let win_index_1 = winCombinations[i][0]
        let win_index_2 = winCombinations[i][1]
        let win_index_3 = winCombinations[i][2]

        let position_1 = currentBoard[win_index_1]
        let position_2 = currentBoard[win_index_2]
        let position_3 = currentBoard[win_index_3]

        if (position_1 === "X" && position_2 === "X" && position_3 === "X" || position_1 === "O" && position_2 === "O" && position_3 === "O") {
            setMessage('Player ' + position_1 +  ' Won!');
            return true;
        }
    }
    
    return false;
    
}

function doTurn() {
    
}