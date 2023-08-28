export default class Ring extends HTMLElement {
    connectedCallback() {
        this.classList.add('ring', `ring_size_` + this.size)
    }

    get rect() {
        return this.getBoundingClientRect()
    }

    move(x, y) {
        this.style.left = x + 'px'
        this.style.top = y + 'px'
    }

    setDragView() {
        this.classList.add('ring_state_dragged')
        this.style.width = this.rect.width + 'px'

        document.body.append(this)
    }

    setNormalView() {
        this.classList.remove('ring_state_dragged')
        this.style.width = ''
        this.classList.add('ring_state_normal')
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
}