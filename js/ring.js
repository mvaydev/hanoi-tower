class Ring extends HTMLElement {
    connectedCallback() {
        this.classList.add('ring', 'ring_size_' + this.size)

        this.addEventListener('mousedown', this.handleMouseDown)
    }

    get rect() {
        return this.getBoundingClientRect()
    }

    handleMouseDown(event) {
        event.preventDefault()

        if(this.order != 1) return

        let shiftX = event.clientX - this.rect.left
        let shiftY = event.clientY - this.rect.top

        this.setDragView()
        this.move(event.pageX - shiftX, event.pageY - shiftY)

        this.boundedHandleDrag = this.handleDrag.bind(this, shiftX, shiftY)
        this.boundedHandleDrop = this.handleDrop.bind(this)

        document.addEventListener('mousemove', this.boundedHandleDrag)
        this.addEventListener('mouseup', this.boundedHandleDrop)
    }

    handleDrag(shiftX, shiftY, event) {
        const limitBottom = document.body.clientHeight - this.clientHeight
        const limitRight = document.body.clientWidth - this.clientWidth
        
        let newX = event.pageX - shiftX
        let newY = event.pageY - shiftY

        if (newY < 0) newY = 0
        else if(newY >= limitBottom) newY = limitBottom

        if (newX <= 0) newX = 0
        else if(newX >= limitRight) newX = limitRight

        this.move(newX, newY)
    }
    
    handleDrop(event) {
        document.removeEventListener('mousemove', this.boundedHandleDrag)
        this.removeEventListener('mouseup', this.boundedHandleDrop)

        if( event.clientX < 0 ||
            event.clientY < 0 ||
            event.clientX > document.body.clientWidth ||
            event.clientY > document.body.clientHeight) {
            this.moveBack()

            return
        }

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