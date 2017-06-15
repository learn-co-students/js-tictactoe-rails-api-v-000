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
    $('td.red').removeClass('red')
    $('td.black').removeClass('black')
  }

  dropToBottom(clickedElement) {
    let colNum = clickedElement.getAttribute("ID").slice(2)
    for(let i = 0; i <= 5; i++){
      let box = document.getElementById(`${i}-${colNum}`)
    
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
      let boxLeft = document.getElementById(nextLeft)

      if ($(boxLeft).hasClass(this.color)) {
        counter++
      } else {
          break;
      }

      console.log('hori', counter)
      if (counter >= 4) {
        return true
        break;
      }
    }

    for(let i = 1; i < 4; i++){
      let nextRight = `${rowNumInt}-${colNumInt + i}`
      let boxRight = document.getElementById(nextRight)

      if ($(boxRight).hasClass(this.color)) {
        counter++
      } else {
          break;
      }

      console.log('hori', counter)
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

      console.log('vert', counter)

      if (counter >= 4) {
        return true
        break;
      }
    }

  }

  diagWinner(rowNum, colNum, rowNumInt, colNumInt){
    let counterPos = 1
    let counterNeg = 1

    for(let i = 1; i < 4; i++){
      let nextNE = `${rowNumInt+i}-${colNumInt+i}`
      let boxNE = document.getElementById(nextNE)

      if ($(boxNE).hasClass(this.color)) {
        counterPos++
      } else {
          break;
      }

      console.log('diag', counterPos)
      if (counterPos >= 4) {
        return true
        break;
      }
    }

    for(let i = 1; i < 4; i++){
      let nextSW = `${rowNumInt-i}-${colNumInt-i}`
      let boxSW = document.getElementById(nextSW)

      if ($(boxSW).hasClass(this.color)) {
        counterPos++
      } else {
          break;
      }

      console.log('diag', counterPos)
      if (counterPos >= 4) {
        return true
        break;
      }
    }

    for(let i = 1; i < 4; i++){
      let nextNW = `${rowNumInt+i}-${colNumInt-i}`
      let boxNW = document.getElementById(nextNW)

      if ($(boxNW).hasClass(this.color)) {
        counterNeg++
      } else {
          break;
      }

      console.log('diag', counterNeg)
      if (counterNeg >= 4) {
        return true
        break;
      }
    }

    for(let i = 1; i < 4; i++){
      let nextSE = `${rowNumInt-i}-${colNumInt+i}`
      let boxSE = document.getElementById(nextSE)

      if ($(boxSE).hasClass(this.color)) {
        counterNeg++
      } else {
          break;
      }

      console.log('diag', counterNeg)
      if (counterNeg >= 4) {
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
    document.getElementById('clear').addEventListener('click', this.boardReset.bind(this))
  }

  onClick(){
    const clickedElement = event.target
    this.isPlayable(clickedElement)
    }

  isPlayable(clickedElement) {
    if (this.board.playable) {
      var box = this.board.dropToBottom(clickedElement)

      if (this.board.winner(box)) {
        setTimeout(() => {alert(`${this.board.color.toUpperCase()} WINNNNS!!!!`)}, 300)
        this.board.playable = false
      }
    }
  }

  boardReset(){
    this.board = new GameBoard()
  }


  render() {}
}



const connectFour = new App()
connectFour.render()

}
