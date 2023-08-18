class Game {
    constructor(numberOfTowers, firstTowerSize) {
        this.towers = []

        for(let i = 0; i < numberOfTowers; i++) {
            this.towers.push(document.createElement('tower-component'))
            this.towers[i].order = i + 1
        }

        document.querySelector('.game').append(...this.towers)
        this.towers[0].fill(firstTowerSize)

        this.resizeTowers()
        document.addEventListener('resize', this.resizeTowers.bind(this))
    }

    resizeTowers() {
        const firstTowerHeight = this.towers[0].getBoundingClientRect().height
        
        for(let tower of this.towers) {
            tower.style.height = firstTowerHeight + 'px'
        }
    }   
}

let game = new Game(3, 7)