window.onload = function () {

class DropChip {
  constructor(){
    this.turn = true
  }

  dropChip(clicked){
    if (this.turn) {
      $(clicked).addClass('red')
      this.turn = false
    } else if (!this.turn) {
      $(clicked).addClass('black')
      this.turn = true
    }
  }
}

class GameBoard {
  constructor(){
    this.chip = new DropChip()
    this.turnCount = 0
    this.color
    this.playable = true
  }

  dropToBottom(clickedElement) {
    let colNum = clickedElement.getAttribute("ID").slice(2)
    for(let i = 0; i <= 5; i++){
      let box = document.getElementById(`${i}-${colNum}`)
      console.log(box);
      if ( $(box).hasClass('red') || $(box).hasClass('black') ) {
        continue;
      } else if (this.playable) {
        this.chip.dropChip(box)
        if(this.turnCount % 2 === 0){
          this.color = 'red'
        } else {
          this.color = 'black'
        }
        this.turnCount += 1
        return box
        break;
      }
    }

  }

  horiWinner(rowNum, colNum, rowNumInt, colNumInt){
    let counter = 1

    for(let i = 1; i < 4; i++){
      let nextLeft = `${rowNumInt}-${colNumInt - i}`
      let nextRight = `${rowNumInt}-${colNumInt + i}`

      let boxLeft = document.getElementById(nextLeft)
      let boxRight = document.getElementById(nextRight)

      if ($(boxLeft).hasClass(this.color)) { counter++ }
      if ($(boxRight).hasClass(this.color)) { counter++ }

      if (counter >= 4) {
        return true
        break;
      }
    }
  }

  vertWinner(rowNum, colNum, rowNumInt, colNumInt){
    let counter = 1

    for(let i = 1; i < 4; i++){
      let nextUp = `${rowNumInt+i}-${colNumInt}`
      let nextDown = `${rowNumInt-i}-${colNumInt}`

      let boxUp = document.getElementById(nextUp)
      let boxDown = document.getElementById(nextDown)

      if ($(boxUp).hasClass(this.color)) { counter++ }
      if ($(boxDown).hasClass(this.color)) { counter++ }

      if (counter >= 4) {
        return true
        break;
      }
    }

  }

  diagWinner(rowNum, colNum, rowNumInt, colNumInt){
    let counter = 1

    for(let i = 1; i < 4; i++){
      let nextNW = `${rowNumInt+i}-${colNumInt-i}`
      let boxNW = document.getElementById(nextNW)

      let nextNE = `${rowNumInt+i}-${colNumInt+i}`
      let boxNE = document.getElementById(nextNE)

      let nextSW = `${rowNumInt-i}-${colNumInt-i}`
      let boxSW = document.getElementById(nextSW)

      let nextSE = `${rowNumInt-i}-${colNumInt+i}`
      let boxSE = document.getElementById(nextSE)


      if ($(boxNW).hasClass(this.color)) { counter++ }
      if ($(boxNE).hasClass(this.color)) { counter++ }
      if ($(boxSW).hasClass(this.color)) { counter++ }
      if ($(boxSE).hasClass(this.color)) { counter++ }

      if (counter >= 4) {
        return true
        break;
      }
    }

  }

  winner(clickedElement){
    const rowNum = clickedElement.getAttribute("ID").slice(0,1)
    const colNum = clickedElement.getAttribute("ID").slice(2)

    const rowNumInt = parseInt(rowNum, 10)
    const colNumInt = parseInt(colNum, 10)


    if (this.horiWinner(rowNum, colNum, rowNumInt, colNumInt) || this.vertWinner(rowNum, colNum, rowNumInt, colNumInt) || this.diagWinner(rowNum, colNum, rowNumInt, colNumInt)) {
      return true
    } else {
      return false
    }
  }
}

class App {
  constructor(){
    this.allChips = document.querySelector('table')
    this.allChips.addEventListener('click', this.onClick.bind(this))
    this.board = new GameBoard()
  }

  onClick(){
    const clickedElement = event.target
    // var box
    if (this.board.playable) {
      var box = this.board.dropToBottom(clickedElement)
    }
    if (this.board.winner(box)) {
      setTimeout(() => {alert(`${this.board.color} WINNNNNS!!!!`)}, 300)
      this.board.playable = false
    }
  }


  render() {


  }
}



const connectFour = new App()
connectFour.render()

}
