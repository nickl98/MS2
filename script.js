//This is the class where the music is deployed from
class AudioController {
    constructor() {
        this.bgMusic = new Audio('assets/sounds/gamemusic.mp3');
        this.flipSound = new Audio('assets/sounds/Card-flip-sound-effect.mp3');
        this.matchSound = new Audio('assets/sounds/Match-sound.mp3');
        this.victorySound = new Audio('assets/sounds/victory.mp3');
        this.gameOverSound = new Audio('assets/sounds/Gameover-sound.mp3');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }

    //these classes below are choosen when the music
    startMusic(){
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match(){
        this.matchSound.play();
    }
    victory(){
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver(){
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards){
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.time_left = totalTime;
        this.timer = document.getElementById('time_left');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }

    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.time_left = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        //this function waits 500mil sec before it starts up
        setTimeout(() =>{
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        //here we are restarting the timer and clicks/flips
        this.hideCards();
        this.timer.innerText = this.time_left;
        this.ticker.innerText = this.totalClicks;
    }

    //this function hides the cards once they are matched
    hideCards(){
        this.cardsArray.forEach(card =>{
            card.classList.remove('visible');
            card.classList.remove('matched');
        });

    }
    startCountDown () {
        return setInterval(() => {
            this.time_left--;
            this.timer.innerText = this.time_left;
            if(this.time_left === 0){
                this.gameOver();
            }
        }, 1000);
    }

    //once this function is classed it first clears out the time out funbctuon and then the gameover class is called and the overlay gameover pops up
    gameOver(){
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    //this works in a similar fashion like the game over function; just shows a diffrent text overlay
    victory (){
        clearInterval(this.countDown);
        document.getElementById('victory-text').classList.add('visible');
    }

    //This function here adds the amount of flips made and keeps track of that number
    flipCard(card){
        if (this.canFlipCard(card)){
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            //matching card function
            if(this.cardToCheck)
                //checking for match
                this.checkForCardMatch(card);
            else
                this.cardToCheck = card;
            
        }
    }
    //this will check and see if this card matches the correct source of the other card and then choose what todo next
   checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    //these are the functions that controll what happens once there is a match buy passing through each card (card 1 and card 2)
    //then also plkaying the aduio controller whenever there is a matched card
    cardMatch(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray)
        this.victory();
    }
        cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    //this function is searching to see if a card matches the other cards value
    getCardType(card) {
        return card.getElementsByClassName('front-img')[0].src;
    }
    //this function here shuffles the cards in a random order each game

     shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    //this statment here checks and sees if the statment is true that it will be able to be flipeed  
    canFlipCard(card){
        return true;
        //return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

//this is pulling the overlays the gameover, victory and Click to startoverlay
function ready(){
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);

    //this for each loop allows when the user clicks on the screen the game will begin and the overlay disappears
 overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
           
        });
    });
    cards.forEach(card =>{
        card.addEventListener('click', () => {
            game.flipCard(card);
        })
    });
}

//This statment will only load the html page once all the files gone through
if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready());
}else{
    ready();
}

