var gamePattern = [];
var buttonColors = ["red", "blue", "green", "yellow"];
var userClickedPattern = [];
var level = 0;
var started = false;

$(document).keypress(function(){
    if (!started){
        $('h1').text('Level ' + level);
        nextSequence();
        started = true;
    }
});

$('.btn').on('click',function(){
    var userChosenColour = this.id;
    userClickedPattern.push(userChosenColour);
    animatePress(userChosenColour);
    playSound(this.id);
    checkAnswer(userClickedPattern.length-1);
});

function nextSequence() {
    userClickedPattern=[];
    level++;
    $('h1').text('Level ' + level);
    var randomNumber = Math.floor(Math.random()*4);
    var randomChosenColour = buttonColors[randomNumber];
    gamePattern.push(randomChosenColour);
    box_flash(randomChosenColour);
    playSound(randomChosenColour);
};

function box_flash(color) {
    $('#'+color).fadeOut(100).fadeIn(100)
}

function playSound(color){
    var sound = new Audio('/sounds/'+color+'.mp3');
    sound.play();
}

function animatePress(color){
    $('#'+color).addClass('pressed');
    setTimeout(function(){$('#'+color).removeClass('pressed')},100);
}

function checkAnswer(currentlevel){
    if (gamePattern[currentlevel]===userClickedPattern[currentlevel]){
        if (userClickedPattern.length===gamePattern.length){
            setTimeout(function(){nextSequence()},1000);
        }
    }
    else{
        playSound('wrong');
        $('body').addClass('game-over');
        setTimeout(function(){$('body').removeClass('game-over')},200);
        $('h1').text('Game Over, Press Any Key to Restart');
        startOver();
    }
}

function startOver(){
    level = 0;
    gamePattern=[];
    started = false;
}