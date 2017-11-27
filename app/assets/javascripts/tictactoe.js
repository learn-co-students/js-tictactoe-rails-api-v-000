var WINNING_COMBOS = [     [   [0,1,2], [0,4,8], [0,3,6]   ], //[0][0..2]
                           [   [1,4,7]                     ], //[1][0]
                           [   [2,4,6], [2,5,8]            ], //[2][0..1]
                           [   [3,4,5]                     ], //[3][0]
                           [   [6,7,8]                     ]  //[4][0]
                        ];
var turn = 0;

$(function(){
    
    
    
});

var player = () => { return turn % 2 === 0 ? "X" : "O";}

var updateState = (square) => {
    var character = player();
    $(square).text(character);
}

var setMessage = (character) => {
    $("div#message").text(`Player ${character} Won!`);
}

var checkWinner = () => {                                             //i   j      k
    // const WINNING_COMBOS = [   [   [0,1,2], [0,4,8], [0,3,6]   ], //[0][0..2]   value
    //                            [   [1,4,7]                     ], //[1][0]
    //                            [   [2,4,6], [2,5,8]            ], //[2][0..1]
    //                            [   [3,4,5]                     ], //[3][0]
    //                            [   [6,7,8]                     ]  //[4][0]
    //                         ];
    var character = player();
    var i = 0;
    var j = 0;
    var k = 0;
    var winner = false;
    while(i < WINNING_COMBOS.length && winner === false){
        
        j = 0;
        while(j < WINNING_COMBOS[i][j].length && winner === false){

            k = 0;
            while(k < 3 && winner === false){
                if (squares(WINNING_COMBOS[i][j][k]) === character){
                    k++;
                    if (k === 3){
                        winner = true;
                    }
                }
                else {
                    k = 10000;
                }
            }

        j++;
        }

    i++;
    }
    if (winner){
        setMessage(character);
    }
    return winner;
}

