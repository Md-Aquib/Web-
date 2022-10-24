function spin_dice(){
    var randomNumber1 = Math.floor(Math.random()*6)+1
    var randomNumber2 = Math.floor(Math.random()*6)+1

    // Changing the image of the dice

    document.querySelector('.img1').setAttribute('src','/images/dice'+randomNumber1+'.png')
    document.querySelector('.img2').setAttribute('src','/images/dice'+randomNumber2+'.png')

    if (randomNumber1>randomNumber2){
        document.querySelector('h1').innerHTML = 'Player1 wins &#128681;'
    }
    else if (randomNumber1<randomNumber2){
        document.querySelector('h1').innerHTML = 'Player2 wins &#128681;'
    }
    else{
        document.querySelector('h1').innerHTML = 'Draw'
    }

}