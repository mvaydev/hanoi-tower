export default {
    modals: {
        start: document.getElementById('startGameModal'),
        finish: document.getElementById('finishGameModal'),
        pause: document.getElementById('pauseGameModal'),
    },

    darkBg: document.querySelector('.dark-background'),

    hide(modal) {
        modal.classList.add('modal_hidden')
        this.darkBg.classList.add('dark-background_hidden')
    },

    show(modal) {
        modal.classList.remove('modal_hidden')
        this.darkBg.classList.remove('dark-background_hidden')
    },
}