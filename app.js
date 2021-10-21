const display = document.getElementById('calc-display')
const clearBtn = document.getElementById('calc-clear')
const numButtons = document.querySelectorAll('.calc-num')
const backspace = document.getElementById('calc-backspace')
const bufferDisplay = document.querySelector('.calc-display-equation')

const formatDisplay = () => (display.innerText = Number(display.innerText))
const clearDisplay = () => {
  display.textContent = '0'
  showingResult = false
}
const clearNumberVariables = () => {
  if (numbers.n1 || numbers.n2) result = numbers.n1 = numbers.n2 = 0
}
const clearBuffer = () => {
  bufferDisplay.textContent = ''
  clearNumberVariables()
  result = 0
}

// Clear calculator display
clearBtn.addEventListener('click', e => {
  clearDisplay()
  clearBuffer()
})

// Number input button event
numButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    if (showingResult) clearDisplay()
    display.textContent += e.target.innerText
    formatDisplay()
  })
})

// Backspace button event
const deleteLastNumber = () =>
  (display.innerText = display.innerText.slice(0, -1) || 0)

backspace.addEventListener('click', deleteLastNumber)

// Math operations
const operationButtons = document.querySelectorAll('.calc-operation')

const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  divide: (a, b) => a / b,
  multiply: (a, b) => a * b
}

operationButtons.forEach(btn => {
  btn.addEventListener('click', e =>
    handleOperation(e.target.id, e.target.innerText)
  )
})

// Handle math operations on number input
const numbers = { n1: 0, n2: 0 }
let previousOperation
let result = 0
let showingResult = false

// # TODO: IF THE BUFFER ENDS WITH EQUALS THEN RESET THE DISPLAY & BUFFER ON ANY CLICK

function showResult () {
  display.textContent = result
  showingResult = true
}

function calculate (n, symbol) {
  numbers[n] = Number(display.textContent)
  bufferDisplay.textContent += ` ${numbers[n]} ${symbol} `
  if (n === 'n2') {
    result = operations[previousOperation](numbers.n1, numbers.n2)
  }
}

function handleOperation (operation, symbol) {
  operation = operation.substr(5)
  const displayHasNumber = Boolean(Number(display.textContent))

  if (displayHasNumber) {
    // Evaluate expression if equals was clicked
    if (operation === 'equals') {
      if (numbers.n1) {
        calculate('n2', symbol)
        showResult()
        clearNumberVariables()
      }
      return
    }

    if (operation === 'negative') {
      display.textContent = -1 * Number(display.textContent)
      return
    }

    // # TODO: ADD PERCENT OPERATOR
    // if (operation === 'percent' && previousOperation) {
    //   if (previousOperation === 'multiply' || previousOperation === 'divide') {
    //     numbers.n2 = numbers.n2/100
    //   } else {

    //   }
    // }

    // Otherwise append number and operation symbol to buffer and if n1 exists overwrite it
    // with previous operation's result after that store current number in n2
    if (!numbers.n1) calculate('n1', symbol)
    else if (numbers.n1 && !numbers.n2) {
      calculate('n2', symbol)
      numbers.n1 = result
      numbers.n2 = null
    }

    // Remember previous operation and show current result while display is waiting for next input
    previousOperation = operation
    showResult()
  }
}
