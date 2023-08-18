class Tower extends HTMLElement {
    connectedCallback() {
        this.classList.add('tower')
    }

    fill(size) {
        for(let i = 1; i <= size; i++) {
            let ring = document.createElement('ring-component')

            ring.size = i
            ring.order = i
            ring.sourceTower = this

            this.append(ring)
        }
    }

    isRingCanDrop(ring) {
        return  !this.firstChild ?
                true :
                this.firstChild.size > ring.size
    }

    pushRing(ring) {
        this.prepend(ring)

        let tower = this.querySelectorAll('.ring')

        for(let i = 1; i <= tower.length; i++) {
            let ring = tower[i - 1]

            ring.setNormalView()
            ring.order = i
        }

        ring.sourceTower.ringShifted()
        ring.sourceTower = this
    }

    ringShifted() {
        let tower = this.querySelectorAll('.ring')

        for(let i = 1; i <= tower.length; i++) {
            tower[i - 1].order = i
        }
    }
}

customElements.define('tower-component', Tower)