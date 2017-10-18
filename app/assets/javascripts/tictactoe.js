$(document).ready(function(){
    attachListeners()
})
var id, win;
var turn = 0;
var winCom = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [6,4,2],
    [2,5,8],
    [0,3,6],
    [1,4,7]
  ]
    function player(){
     if(turn%2 === 0){
        return "X"
      }
     else{
         return "O"
     }
   }
 
   function updateState(event){
     var piece = player();
    //  var intX = this.event.currentTarget.attributes[0].value
    //  var intY = this.event.currentTarget.attributes[1].value
    // if(y === "0"){
    //      board[intX+intY] = piece;
    // }
    // else if (y == "1"){
    //     board[3+intX] = piece;
    // }
    // else{
    //     board[4+intX] = piece;
    // } 
  
    if($(event).html() === '' || !win){
          turn++;
          $(event).text(piece);
        }
        else{
          "Spot taken"
        }
   }
   
function board(){
  var tableData = $('td');
  var arr = [];
  for(var i= 0; i < tableData.length; i++){
    arr.push(tableData[i].innerHTML);
  }
  return arr
}

function newBoard(){ 
    // turn = 0;
    var tableData = $('td');
    for(var i = 0; i < tableData.length;i++){ tableData[i].innerHTML = ''};
    turn = 0; 
}

   function checkWinner(){
    var currentBoard = board();
    for(var i = 0; i < winCom.length; i++ ){
     if (currentBoard[winCom[i][0]]!== ''){
        if(currentBoard[winCom[i][0]] == currentBoard[winCom[i][1]] && currentBoard[winCom[i][1]] == currentBoard[winCom[i][2]]){
            setMessage('Player ' + currentBoard[winCom[i][2]] + ' Won!');
            return true;
        }
      }
    }
    return false;
   } 
   function resetGame(){
      newBoard();
   }

   function setMessage(message){
       $('div#message').html(message);
   }
   
   function gameExist(){
     if(id == undefined){
       saveGame();
     }
     else{
      updateGame();
     }
   }

   function doTurn(event){
     updateState(event)
     win = checkWinner()
     if (win){
       saveGame()
      // gameExist();
      resetGame()
     }
     else if (turn === 9){ 
      //  gameExist();
        setMessage('Tie game.')
        saveGame()
       resetGame()
     }
      // else{
      //  updateState(event);
      // }
   }

   function saveGame(){
     var savedGame = $.post('/games', {'state':board()})
     savedGame.done(function(data){ 
        id = parseInt(data['data']['id']);
     })
   }


    function updateGame(){
      $.ajax({
        type: "PATCH",
        url: '/games/'+id,
        data: {'state': board()},
      })
    }
   function previousGames(){
     $.get('/games').done(function(data){
       var buttons=""
      //  if($("div#games").val()== ''){
        for(var i = 1; i < data["data"].length+1;i++){
          buttons+=`<button id=${i} class='game'">${i}</button>`;
          // $("#game"+i).on('click', ()=>{getGame(i)})
        }
         $("div#games").html(buttons)
      //  }
      //   else{
      //     var id = data["data"].length-1
      //     $("div#games").append(`<button data-id=game${id} class='game'">${id}</button>`)
      //   }

      
      }
     )
   }

   function getGame(gameId){
     id = gameId
     var num = 0;
      $.get('/games/'+gameId).done(function(data){
      var tableData = $('td');
       var arr = data['data']['attributes']['state']
       for(var i= 0; i < tableData.length; i++){
         debugger
          tableData[i].innerHTML = arr[i];
          if(arr[i] !== ''){
             num++
          }
        }
         turn = num;
      })
  
   }

   function loadGame(array){
    var tableData = $('td');
  
      for(var i= 0; i < tableData.length; i++){
      
          tableData[i].innerHTML = array[i];
        }
      }

  function clearGame(){
    $.ajax({
        type: "POST",
        url: '/games/'+id,
        data: {'state': newBoard()},
      })
  }
   function attachListeners(){
       $('td').on('click', function(event){
         if(!win){
           doTurn(event.target)}
          }
       )
       $('#save').on('click', function(){
        gameExist()
       })
        $('#previous').on('click', function(){
           previousGames()  
       })
         $('#clear').on('click', function(){
           var clearBoard = newBoard();
           id = undefined
           loadGame(clearBoard)
       })
       $("div#games").on('click', '.game', function(event){
          var savedGame = event["currentTarget"]["attributes"][0]["nodeValue"];
          getGame(savedGame)
       })
        
   } 