export default class Tower extends HTMLElement {
    connectedCallback() {
        this.classList.add('tower')
    }

    pushRing(ring) {
        this.prepend(ring)
        ring.setNormalView()
        this.reOrderRings()
    }

    reOrderRings() {
        let rings = this.querySelectorAll('.ring')

        for(let i = 0; i < rings.length; i++) {
            rings[i].order = i
        }
    }

    isRingCanDrop(ringSize) {
        return  !this.firstChild ?
                true :
                ringSize < this.firstChild.size
    }
}