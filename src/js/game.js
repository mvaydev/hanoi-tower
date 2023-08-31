import Ring from './ring.js'
import Tower from './tower.js'

customElements.define('ring-component', Ring)
customElements.define('tower-component', Tower)

export default class Game {
    constructor(numberOfRings = 7, numberOfTowers = 3) {
        const rings = this.createRings(numberOfRings)
        const towers = this.createTowers(numberOfTowers)
              towers[0].append(...rings)

        document.querySelector('.game').append(...towers)
        this.stopResizing()

        document.addEventListener('pointerdown', this.onDragStart.bind(this))
        document.ondragstart = () => false
    }

    createRings(numberOfRings) {
        let rings = []

        for(let i = 0; i < numberOfRings; i++){
            let ring = document.createElement('ring-component')
                ring.order = i
                ring.size = i + 1

            rings.push(ring)
        }

        return rings
    }

    createTowers(numberOfTowers) {
        let towers = []

        for(let i = 0; i < numberOfTowers; i++){
            let tower = document.createElement('tower-component')

            towers.push(tower)
        }

        return towers
    }

    stopResizing() {
        let game = document.querySelector('.game')

        game.style.height = game.getBoundingClientRect().height + 'px'
    }

    addEventListeners() {
        this.boundedDragEnd = this.onDragEnd.bind(this)
        this.boundedDrag = this.onDrag.bind(this)
        this.boundedDragCancel = this.onDragCancel.bind(this)

        document.addEventListener('pointerup', this.boundedDragEnd)
        document.addEventListener('pointermove', this.boundedDrag)
        document.body.addEventListener('pointerleave', this.boundedDragCancel)
    }

    removeEventListeners() {
        document.removeEventListener('pointerup', this.boundedDragEnd)
        document.removeEventListener('pointermove', this.boundedDrag)
        document.body.removeEventListener('pointerleave', this.boundedDragCancel)
    }

    onDragStart({target, pageX: x, pageY: y}) {
        if(!this.isDraggebleRing(target)) return

        this.draggedRing = target
        this.sourceTower = this.draggedRing.closest('.tower')

        this.shiftX = x - this.draggedRing.rect.left
        this.shiftY = y - this.draggedRing.rect.top

        this.draggedRing.setDragView()
        this.draggedRing.move(x - this.shiftX, y - this.shiftY)

        this.addEventListeners()
    }

    onDragEnd({clientX: x, clientY: y}) {
        this.draggedRing.hidden = true
        let towerToDrop = document.elementFromPoint(x, y)?.closest('.tower')
        this.draggedRing.hidden = false

        if(!towerToDrop || towerToDrop === this.sourceTower) {
            this.sourceTower.pushRing(this.draggedRing)
        } 
        
        else if(towerToDrop.isRingCanDrop(this.draggedRing.size)) {
           towerToDrop.pushRing(this.draggedRing)
           this.sourceTower.reOrderRings()
        }

        else {
            this.sourceTower.pushRing(this.draggedRing)
        }

        this.removeEventListeners()
    }

    onDrag({clientX: x, clientY: y}) {
        let {newX, newY} = this.draggedRing.getNewCoordinates(x - this.shiftX, y - this.shiftY)

        this.draggedRing.move(newX, newY)
    }

    onDragCancel() {
        this.sourceTower.pushRing(this.draggedRing)
    }

    isDraggebleRing(ring) {
        return  ring && 
                !ring.order && 
                ring.classList.contains('ring')
    }
}