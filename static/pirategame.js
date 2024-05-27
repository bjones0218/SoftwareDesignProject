
// set some values in order to make the board and blocks
var blockSize = 25;
var height = 20;
var width = 20;
var frames = 100;

var context;

// start position and directional speed instantiated
var gameOver = false;
var speedY = 0;
var speedX = 0;
var acceleration = 10;
var positionY = (height*blockSize)/2;
var positionX = (width*blockSize)/2;

//vars for ship counter, the ships/mines themselves, and the update interval
var counter = 0;
var ships = [];
var myInterval;

// Stopwatch values
let second = 0; 
let count = 0;

//use image for pirate ship
const img = new Image();
img.src = 'static/pirate.png';

//use image for mines
const mineImg = new Image();
mineImg.src = 'static/mine.png';

window.onload = function () {
    // Set board height and width
    board = document.getElementById("board");
    board.height = height * blockSize;
    board.width = width * blockSize;
    context = board.getContext("2d");
    document.addEventListener("keyup", changeDirection);

    //start update interval and timer
    myInterval = setInterval(update, 1000 / frames);
    timer = true; 
    stopWatch();
}

// when the start/restart button is clicked, this function runs
function onStartClicked () {

    // restart the update interval
    clearInterval(myInterval);
    startButton = document.getElementById("restart-button");

    // if the button is restart, the game is running so stop game, change 
    // the button text, and reset all values to start
    if (startButton.innerText == "Restart") {

        gameOver = true;

        startButton.innerText = "Start";

        counter = 0;
        ships = [];

        timer = false; 
        second = 0; 
        count = 0; 

        document.getElementById('sec').innerHTML = "00"; 

        positionX = (width*blockSize)/2;
        positionY = (height*blockSize)/2;

        speedX = 0;
        speedY = 0;
    }
    else { // game is stopped so start the game an change button text to restart
        gameOver = false;

        startButton.innerText = "Restart";
    
        //start timer
        timer = true; 
        stopWatch();
        
        //set update interval
        myInterval = setInterval(update, 1000 / frames);
    }

}

// function that checks for collisions between the ship and the mines
function checkCollision (ship){

    // if the borders of the ship and one of the mines hit, return true, else false
	if (((positionX >= ((ship[1] + blockSize) - 2)) && (positionX <= ((ship[1] + blockSize) + 2 )) && (positionY + (3 * blockSize) >= ship[0]) && (positionY <= ship[0] + blockSize)) ||
        ((positionX + (3 * blockSize) >= (ship[1] - 2)) && (positionX + (3 * blockSize) <= (ship[1] + 2 )) && (positionY + (3 * blockSize) >= ship[0]) && (positionY <= ship[0] + blockSize)) ||
		((positionY >= ((ship[0] + blockSize) - 2)) && (positionY <= ((ship[0] + blockSize) + 2 )) && (positionX + (3 * blockSize) >= ship[1]) && ((positionX) <= ship[1] + blockSize)) ||
        ((positionY + (3 * blockSize) >= (ship[0] - 2)) && (positionY + (3 * blockSize) <= (ship[0]+ 2)) && (positionX + (3 * blockSize) >= ship[1]) && ((positionX) <= ship[1] + blockSize)) ){ 
		
		return true;
	}
	return false;
}

// if a ship/mine is out of the frame, remove it from the list.
// This makes sure we can continue to check collisions for all mines quickly.
function checkAndRemoveShip (ships, i) {
	if (ships[i][0] > (height*blockSize)){
		ships.splice(i, i);
	}
	return ships;
}

// Function that is called at our set interval to update all attributes in 
// the game such as movement, speed, mine creation, etc.
function update (){
    // stop if the game is not running
    if (gameOver) {
        return;
    }

    // update the interval to call itself every 5 seconds to speed up the interval and make it more difficult
    if (second == 5) {
        clearInterval(myInterval)
        myInterval = setInterval(update, 850 / frames)
    }
    else if (second == 10){
        clearInterval(myInterval)
        myInterval = setInterval(update, 700 / frames)
    }
    else if (second == 15){
        clearInterval(myInterval)
        myInterval = setInterval(update, 550 / frames)
    }
    else if (second == 20){
        clearInterval(myInterval)
        myInterval = setInterval(update, 450 / frames)
    }
    else if (second == 25){
        clearInterval(myInterval)
        myInterval = setInterval(update, 300 / frames)
    }

    // board fill
    context.fillStyle = "blue";
    context.fillRect(0, 0, board.width, board.height);

    //draw pirate ship
    context.drawImage(img, positionX, positionY, 3 * blockSize, 3 * blockSize);
    
    //draw border around ship to help see collision range
    context.fillStyle = "black";
    context.strokeRect(positionX, positionY, 3 * blockSize, 3 * blockSize);

    // add ships/mines
    if (counter % 150 == 0){
        addShip();
    }
    counter++;

    // fill the mines red
    context.fillStyle = "red";

    // for all mines/ships
    for (let i=0; i < ships.length; i++){
        // call function to remove ships off frame
		checkAndRemoveShip(ships, i);

        // check for collisions and end game if there is one
		collision = checkCollision(ships[i]);
		if (collision){
			gameOver = true;
            alert("Game Over. You stayed afloat for " + second + " seconds!");
            timer = false;
		}

        // move ships/mines down the board
        ships[i][0] = ships[i][0] + 1;
        
        // update mines to show in the correct spot and move
        context.fillRect(ships[i][1], ships[i][0], blockSize, blockSize);
        context.drawImage(mineImg, ships[i][1], ships[i][0],  blockSize,  blockSize);

    }

    //update pirate position based on the current speed
    positionY += speedY;
    positionX += speedX;

    // slow speed down slightly to immitate friction
    speedX = speedX/1.005;
    speedY = speedY/1.005;
    
    // If you hit one of the sides of the board, end game
    if ((positionY + (3 * blockSize) >= height * blockSize) || (positionX + (3 * blockSize) >= width * blockSize) || (positionY <= 0) || (positionX <= 0) ){
        alert("Game Over. You stayed afloat for " + second + " seconds!");
        gameOver = true;
        timer = false;
    }

}

//function to hadle change in direction when you click the arrow keys
function changeDirection(e) {
    if (e.code == "ArrowUp") {
        speedY = speedY - 0.2;
    }
    else if (e.code == "ArrowDown") {
        speedY = speedY + 0.2;
    }
    else if (e.code == "ArrowLeft") {
        speedX = speedX - 0.2;
    }
    else if (e.code == "ArrowRight") {
        speedX = speedX + 0.2;
    }
}

// function that adds a ship/mine at a random position
function addShip (){
    newShip = Math.floor(Math.random() * (width));
    ships.push([-20, newShip*blockSize])
}

// function to run the stopwatch
function stopWatch() { 
    if (timer) { 

        count++; 
        
        if (count == 100) { 
            second++; 
            count = 0; 
        } 

        let secString = second; 
  
        if (second < 10) { 
            secString = "0" + secString; 
        } 

        document.getElementById('sec').innerHTML = secString; 

        setTimeout(stopWatch, 10); 
    } 
}