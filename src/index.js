import './scss/main.scss'

import Game from './js/game.js'
import modalManager from './js/modals.js'

customElements.define('game-component', Game)

const numberOfRings = 3
const game = document.createElement('game-component')

document.querySelector('.wrapper').append(game)
setGameStateHandlers()

game.new(numberOfRings)

function newGame() {
    game.new(numberOfRings)

    startGame()
}

function startGame() {
    for(let modal in modalManager.modals) {
        modalManager.hide(modalManager.modals[modal])
    }

    game.start()

    observeFinish()
}

function pauseGame() {
    game.pause()

    modalManager.show(modalManager.modals.pause)
}

function observeFinish() {
    new MutationObserver(([mutationRecord]) => {
        const tower = mutationRecord.target

        if(tower.children.length === numberOfRings) {
            finishGame()
        }
        
    }).observe(game.lastChild, {childList: true})
}

function finishGame() {
    modalManager.show(modalManager.modals.finish)
}

function setGameStateHandlers() {
    let buttons = document.querySelectorAll('.button')

    for(let button of buttons) {
        switch(button.value) {
            case "start":
                button.addEventListener('click', startGame)
                break

            case "pause":
                button.addEventListener('click', pauseGame)
                break 

            case "new":
                button.addEventListener('click', newGame)
                break 
        }
    }
}