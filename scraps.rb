for (const subArray in winCombinations) {
    for (const position in subArray) {
      console.log(position)
      }
    }

    for (const x in winCombinations[0]) {
        console.log(x)}


  winCombinations.forEach(element => console.log(element)) // this works

  winCombinations.forEach( function(subArray){
    subArray.forEach( function(position) {
      return tokensArray

      })
    })


  winCombinations.some( function(subArray){
    subArray.forEach(allXorO)
    }
  )



 function allXorO(element, index, array) {
   return array[element] === "X" || "O"
 }


----

function allXorO(element) {
debugger
return board[element] === ("X" || "O")
}

winCombinations.some( function(subArray) {
debugger
subArray.every(allXorO)
})

function checkArray() {

}
-----

function winningCondition(subArray) {
  return (board[subArray[0]] !== "") &&
    (board[subArray[0]] === board[subArray[1]]) &&
    (board[subArray[0]] === board[subArray[2]])
}

function isThereAWinner() {
  return winCombinations.some(winningCondition)
}
-----
