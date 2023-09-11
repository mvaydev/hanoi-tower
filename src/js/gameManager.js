import Game from './game/game.js'
import modalManager from './modals.js'
import Stopwatch from './stopwatch.js'

customElements.define('game-component', Game)

const movesMenuOutput = document.getElementById('movesMenuOutput')
const movesFinishOutput = document.getElementById('movesFinishOutput')

export default class GameManager {
    constructor() {
        const game = document.createElement('game-component')
                     document.querySelector('.wrapper').append(game)

        this.game = game
        this.moves = 0

        this.movesObserver = new MutationObserver(([mutationRecord]) => {
            if( mutationRecord.addedNodes.length != 0  &&
                this.game.sourceTower != mutationRecord.target) {

                this.moves++
                movesMenuOutput.value = this.moves
                movesFinishOutput.value = this.moves 
            }
        })

        this.finishObserver = new MutationObserver(([{target: tower}]) => {
            if(tower.children.length === this.numberOfRings)
                this.finish()        
        })
    }

    again() {
        modalManager.hideAll()
        modalManager.show(modalManager.modals.start)
    }

    new() {
        this.numberOfRings = Number(document.querySelector('#sliderInput').value)
        this.game.new(this.numberOfRings)

        this.stopwatch = new Stopwatch()

        this.observeGame()
        this.start()
        this.resetInfo()  
    }

    start() {
        modalManager.hideAll()

        this.game.start()
        this.stopwatch.start(0)
    }

    finish() {
        modalManager.show(modalManager.modals.finish)

        this.game.stop()
        this.stopwatch.stop()
    }

    pause() {
        this.game.stop()
        this.stopwatch.stop()

        modalManager.show(modalManager.modals.pause)
    }

    observeGame() {
        const config = { childList: true }

        for(let tower of this.game.children) {
            this.movesObserver.observe(tower, config)
        }

        this.finishObserver.observe(this.game.lastChild, config)
    }

    resetInfo() {
        this.moves = 0
        movesMenuOutput.value = this.moves
        movesFinishOutput.value = this.moves   
    }

    setHandlers() {
        let buttons = document.querySelectorAll('.button')
    
        for(let button of buttons) {
            switch(button.value) {
                case "start":
                    button.addEventListener('click', () => this.start())
                    break
    
                case "pause":
                    button.addEventListener('click', () => this.pause())
                    break 
    
                case "new":
                    button.addEventListener('click', () => this.new())
                    break 
    
                case "again":
                    button.addEventListener('click', () => this.again())
                    break 
            }
        }
    }
}