export default class Stopwatch { 
    constructor() {
        this.outputs = document.querySelectorAll('.timeOutput')
        this.displayTime(0)

        this.delay = 1000
        this.time = 0
    }

    start(startTime = 0) {
        this.stopwatchId = setInterval(() => {
            this.time += this.delay
            this.time -= startTime

            this.displayTime(this.time)
        }, this.delay)
    }

    stop() {
        clearInterval(this.stopwatchId)
        this.stopwatchId = null
    }
    
    displayTime(ms) {
        let time = new Date(ms)
        let minutes = time.getMinutes()
        let seconds = time.getSeconds()

       if(minutes < 10) minutes = '0' + minutes.toString()
       if(seconds < 10) seconds = '0' + seconds.toString()

        for(let output of this.outputs) {
            output.value = `${minutes}:${seconds}`
        }
    }
}