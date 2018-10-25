// Code your JavaScript / jQuery solution here
$(document).ready(function(){
    attachListeners();
});

var currentBoardId;
var turn = 0;
function player(){
    if(turn % 2 === 0){
         return "X";
    } else{
        return "O";
    }
}

function updateState(column){
    let currentPlayerToken = player();
    $(column).text(currentPlayerToken);
}

function setMessage(winner){
    $('#message').text(winner);
}


function playerWon(arr){
    const winningCombos = [[3, 4, 5], [0, 1, 2] ,[6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    let result;
    let results = winningCombos.map(function(combo){
          result = arr.filter(function (elem) {
    			       return combo.indexOf(elem) > -1;
				}).length == combo.length
				if(result){
						return result;
				}else{
						return false;
				}

    }); // results(example) = [false, true, false, false]
		return results.filter(boo => boo == true)[0]
}

function getCurrentBoard(){
    let board = document.querySelectorAll('td');
     let array = [];
         board.forEach(function(td){
             array.push(td.innerHTML);
         });
        return array;
}

function checkWinner(){
    let board = getCurrentBoard();

         let indexesOfX = []
         for(let i = 0; i <= 9; i++){
             if(board[i] == 'X'){
                 indexesOfX.push(i);
             }
         }

         let indexesOfO = []
         for(let i = 0; i <= 9; i++){
             if(board[i] == 'O'){
                 indexesOfO.push(i);
             }
         }

         if(playerWon(indexesOfX)){
             setMessage(`Player X Won!`);
             return true;
         }else if (playerWon(indexesOfO)){
             setMessage(`Player O Won!`);
             return true;
         }else if (playerWon(indexesOfX) == undefined || playerWon(indexesOfO) == undefined){
             return false;
         }
}

function boardIsFull(){
    let board = getCurrentBoard();
    if(board.includes("") || board.includes('')){
        return false;
    } else{
        return true;
    }
}

function resetBoard(){
    $('td').text('');
}

function spotTaken(element){
    let token = element.innerText.trim();
    if (token === "X" || token === "O"){
        return true;
    } else{
        return false;
    }
}

function doTurn(element){
     if (!spotTaken(element)){
         updateState(element);
         turn++;
        if (checkWinner()){
            saveGame();
            resetBoard();
            turn = 0;
        } else if(boardIsFull()) {
            saveGame();
            resetBoard();
            turn = 0;
            setMessage(`Tie game.`);
        }
    }
}


function allGames(){
    let returnValue;

    $.get('/games').done(function(data){
        returnValue = data;
    });
    //
    // $.ajax({
    //     type: "GET",
    //     async: false,
    //     url: "/games",
    //     dataType: 'json',
    //     contentType: 'application/json; charset=utf-8',
    //     success: function (data) {
    //         returnValue = data.data;
    //     }
    // });
    debugger;
        return returnValue;
}

function getGameById(gameId){
        $.get(`/games/${id}`).done(function(response){
            console.log(response);
        });
}

function addToBoard(state){
    let squares = window.document.querySelectorAll('td');
    for(let i = 0; i < state.length; i++){
        squares[i].innerText = state[i];
    }
}

function addPreviousGames(){
    let gamesDiv = $('#games');
    let allGamesData = allGames();
    debugger;
    allGamesData.forEach(function(game){
            let btn = document.createElement('button');

            if (gamesDiv.is(':empty')){
                btn.innerText = game.id;
                btn.dataset["id"] = game.id
                gamesDiv.append(btn);
            } else{
                let lastBtnValue = $('#games').children().last().text();
                if (parseInt(lastBtnValue) < game.id){
                    btn.innerText = game.id;
                    btn.dataset["id"] = game.id
                    gamesDiv.append(btn);
                }
            }
    });
}

function getCurrentBoardId(){
    return currentBoardId;
}

function setCurrentBoardId(id){
    currentBoardId = id;
}

function saveGame() {
    let board = getCurrentBoard();
    let id = getCurrentBoardId();
    var game;
    $.get("/games/" + id ).done(function(json){
        game = response.data;
    });
          if (game.id == getCurrentBoardId){
            //PATCH
            let returnValue;
            $.ajax({
                type: "PATCH",
                async: false,
                url: "/games/" + game.id,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({state: board}),
                success: function (data) {
                    returnValue = data.data;
                }
            });
                return returnValue;
          } else {
                $.post('/games', { state: board })
                .done(function(response){
                    setCurrentBoardId(parseInt(response.data['id']));
                });
         }
}

function attachListeners(){
    $('td').on('click', function(e){
        doTurn(e.target);
    });
    $('#previous').on('click', function(){
        addPreviousGames();
    });

    $('#save').on('click', function(){
        saveGame();
    });

    $('#clear').on('click', function(e){
        resetBoard();
    });

    $('#games').on('click', '*', function(e){
        let id = parseInt(e.toElement.dataset["id"]);
        $.get(`/games/${id}`, function(response){
            addToBoard(response.data.attributes.state);
        });
    });
}
