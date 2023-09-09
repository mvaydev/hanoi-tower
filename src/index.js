import './scss/main.scss'
import GameManager from './js/gameManager.js'

const gameManager = new GameManager()
gameManager.setHandlers()

const sliderInput = document.getElementById('sliderInput')
const sliderOutput = document.getElementById('sliderOutput')

sliderInput.addEventListener('input', () => {
    sliderOutput.value = sliderInput.value
})