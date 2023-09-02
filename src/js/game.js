import Ring from './ring.js'
import Tower from './tower.js'

customElements.define('ring-component', Ring)
customElements.define('tower-component', Tower)

export default class Game extends HTMLElement {
    connectedCallback() {
        this.classList.add('game')
    }

    new(numberOfRings = 7) {
        const rings = this.createRings(numberOfRings)
        const towers = this.createTowers()
              towers[0].append(...rings)

        this.textContent = ''
        this.append(...towers)

        this.resize()
        this.stopResizing()
    }

    start() { 
        this.boundedDragStart = this.onDragStart.bind(this)

        document.ondragstart = () => false
        document.addEventListener('pointerdown', this.boundedDragStart)
    }

    pause() { 
        document.removeEventListener('pointerdown', this.boundedDragStart)
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

    createTowers() {
        const numberOfTowers = 3
        let towers = []

        for(let i = 0; i < numberOfTowers; i++){
            let tower = document.createElement('tower-component')

            towers.push(tower)
        }

        return towers
    }

    stopResizing() {
        this.style.height = this.getBoundingClientRect().height + 'px'
    }

    resize() {
        this.style.height = ''

        this.classList.remove('game')
        this.classList.add('game')
    }

    addEventListeners() {
        this.dragHandlers = {
            drag: this.onDrag.bind(this),
            end: this.onDragEnd.bind(this),
            cancel: this.onDragCancel.bind(this),
        }

        document.addEventListener('pointerup', this.dragHandlers.end)
        document.addEventListener('pointermove', this.dragHandlers.drag)
        document.body.addEventListener('pointerleave', this.dragHandlers.cancel)
    }

    removeEventListeners() {
        document.removeEventListener('pointerup', this.dragHandlers.end)
        document.removeEventListener('pointermove', this.dragHandlers.drag)
        document.body.removeEventListener('pointerleave', this.dragHandlers.cancel)
    }

    isDraggebleRing(ring) {
        return  ring && 
                !ring.order && 
                ring.classList.contains('ring')
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
}