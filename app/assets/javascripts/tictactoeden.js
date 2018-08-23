// Code your JavaScript / jQuery solution here
// document.addEventListener("DOMContentLoaded", function(){

var turn = 0
const winningCombos =
[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

function player(){
  if (turn % 2 === 0 ){
    return 'X'
  } else {
    return 'O'
  }
}



// Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
function updateState(td){
  var currentPlayer = player();
$(td).text(currentPlayer);
// document.querySelector('td').innerHTML=currentPlayer;
}

function doTurn(){
  turn++
  updateState()
  checkWinner()
  board = document.querySelectorAll("td")

  // if(checkWinner() == false && checkforempty(board) == false){
  //    setMessage("Tie game.")}

    function checkforempty(array){
      for (i=0; i<array.length; i++){
          if(array[i] == ""){
            console.log(array[i])
            return true
          }
      }
    }
  // check the board - as long as the boards not full continue to play and chack winner. Once board is full and willer is false say tie game or else say x or o won. reset board and turn count
  // if (checkWinner() == false && checkforempty == true){
  //   doTurn();
  // }
  // else if(checkWinner() == false && checkforempty == false){
  //   setMessage("Tie game.")
  //   document.querySelectorAll("td").innerHTML = ""
  //   turn = 0}
  //   else{
  //     checkWinner()
  //     document.querySelectorAll("td").innerHTML = ""
  //     turn = 0
  //   }

  updateState();
  return player
}

function checkWinner(){
  // check horizontal win combos
   var top = document.querySelectorAll("[data-y='0']")
  var mid_arr = document.querySelectorAll("[data-y='1']")
  var bottom = document.querySelectorAll("[data-y='2']")
    // check vertical win combos
  var right = document.querySelectorAll("[data-x='2']")
  var center = document.querySelectorAll("[data-x='1']")
  var left = document.querySelectorAll("[data-x='0']")
  // //check diag
  // var ri_diag = []

    if(
      (mid_arr[0].innerHTML == mid_arr[1].innerHTML == mid_arr[2].innerHTML) || (top[0].innerHTML == top[1].innerHTML == top[2].innerHTML ) || (bottom[0].innerHTML == bottom[1].innerHTML == bottom[2].innerHTML )){
        if (bottom[0].innerHTML == bottom[1].innerHTML == bottom[2].innerHTML){
          // console.log("LOG: " +bottom[1].innerHTML)
          setMessage(`Player ${bottom[0].innerHTML} Won!`)}
          else if((mid_arr[0].innerHTML == mid_arr[1].innerHTML == mid_arr[2].innerHTML)) {
            setMessage(`Player ${mid_arr[0].innerHTML} Won!`)}
            else {
              setMessage(`Player ${top[0].innerHTML} Won!`)}

      return true
    } else if (
      (center[0].innerHTML == center[1].innerHTML == center[2].innerHTML) || (right[0].innerHTML == right[1].innerHTML == right[2].innerHTML ) || (left[0].innerHTML == left[1].innerHTML == left[2].innerHTML )
    ) {if (center[0].innerHTML == center[1].innerHTML == center[2].innerHTML){
        setMessage(`Player ${center[0].innerHTML || center[1].innerHTML || center[2].innerHTML } Won!`)}
        else if((right[0].innerHTML == right[1].innerHTML == right[2].innerHTML)) {
        setMessage(`Player ${right[0].innerHTML || right[1].innerHTML || right[2].innerHTML } Won!`)}
        else {
          setMessage(`Player ${left[0].innerHTML || left[1].innerHTML || left[2].innerHTML } Won!`)}
      return true
    }
    else {
      // console.log(false)
      return false
    }
}






// Accepts a string and adds it to the div#message element in the DOM.
function setMessage(message){
  var mess =  document.getElementById("message")
  mess.innerHTML = message
}






function saveGame(){}

function previousGame(){
}

// window.onload = () =>{
function attachListeners(){}
// };
