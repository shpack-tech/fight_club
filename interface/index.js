document.fonts.onloadingdone = () => {
    document.querySelector('.main_title').style.opacity = '1'

}

setTimeout(() => {
    document.querySelector('.start_button').style.opacity = '1'
}, 2400)


startButton = document.querySelector('.start_button')
gameFrame = document.querySelector('.game_frame')


// startButton.addEventListener('click', () => {
//     gameFrame.classlist.add('.show'),
//         gameFrame.classlist.remove('.hide'),
//         console.log('showen');
// })

startButton.addEventListener('click', () => {
    console.log('showen');
    gameFrame.classList.add('show')
    gameFrame.classList.remove('hide')


})