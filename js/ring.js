class Ring extends HTMLElement {
    connectedCallback() {
        this.classList.add('ring', 'ring_size_' + this.size)

        this.addEventListener('pointerdown', this.handleCatch)
    }

    get rect() {
        return this.getBoundingClientRect()
    }

    handleCatch(event) {
        event.preventDefault()

        if(this.order != 1) return

        let shiftX = event.clientX - this.rect.left
        let shiftY = event.clientY - this.rect.top

        this.setDragView()
        this.move(event.pageX - shiftX, event.pageY - shiftY)

        document.addEventListener('pointermove', e => this.handleDrag(shiftX, shiftY, e))
        document.body.addEventListener('pointerleave', this.moveBack.bind(this))
        this.addEventListener('pointerup', this.handleDrop)
    }

    handleDrag(shiftX, shiftY, {pageX, pageY}) {
        let {newX, newY} = this.getNewCoordinates(pageX - shiftX, pageY - shiftY)

        this.move(newX, newY)
    }
    
    handleDrop(event) {
        this.hidden = true
        let towerToDrop = document.elementFromPoint(event.clientX, event.clientY)
                                  .closest('.tower')
        this.hidden = false

        if(towerToDrop === this.sourceTower || !towerToDrop) {
            this.moveBack()
        } 

        else if(towerToDrop.isRingCanDrop(this)) {
            towerToDrop.pushRing(this)
        }

        this.moveBack()
    }

    getNewCoordinates(x, y) {
        let limits = {
            right: document.body.offsetWidth - this.rect.width,
            bottom: document.body.offsetHeight - this.rect.height,
            left: document.body.offsetLeft,
            top: document.body.offsetTop
        }

        let newX = x
        let newY = y

        if (y < limits.top) newY = limits.top
        else if(y >= limits.bottom) newY = limits.bottom

        if (x <= limits.left) newX = limits.left
        else if(x >= limits.right) newX = limits.right

        return {newX, newY}
    }

    moveBack() {
        this.sourceTower.pushRing(this)
    }

    move(x, y) {
        this.style.top = y + 'px'
        this.style.left = x + 'px'
    }

    setDragView() {
        this.classList.add('ring_state_dragged')
        this.style.width = this.rect.width + 'px'

        document.body.append(this)
    }

    setNormalView() {
        this.classList.remove('ring_state_dragged')
        this.style.width = 20 + this.size * 10 + '%' // check _ring.scss
    }
}

customElements.define('ring-component', Ring)