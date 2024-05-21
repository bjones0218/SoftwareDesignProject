
var blockSize = 25;
var height = 20;
var width = 20;
var frames = 100;

var context;

var gameOver = false;
var speedY = 0;
var speedX = 0;
var acceleration = 10;
var positionY = (height*blockSize)/2;
var positionX = (width*blockSize)/2;

var counter = 0;
var ships = [];
var myInterval;

let second = 0; 
let count = 0;

const img = new Image();
img.src = 'static/ship.jpg';

const mineImg = new Image();
mineImg.src = 'static/mine.png';

window.onload = function () {
    // Set board height and width
    board = document.getElementById("board");
    board.height = height * blockSize;
    board.width = width * blockSize;
    context = board.getContext("2d");
    document.addEventListener("keyup", changeDirection);
    myInterval = setInterval(update, 1000 / frames);
    timer = true; 
    stopWatch();
}

function onStartClicked () {

    clearInterval(myInterval);
    startButton = document.getElementById("restart-button");

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
    else {
        gameOver = false;

        startButton.innerText = "Restart";
        
        timer = true;
        stopWatch();
        
        myInterval = setInterval(update, 1000 / frames);
    }

}

function checkCollision (ship){
	console.log("collision checked");

	if (((positionX >= ((ship[1] + blockSize) - 2)) && (positionX <= ((ship[1] + blockSize) + 2 )) && (positionY + (3 * blockSize) >= ship[0]) && (positionY <= ship[0] + blockSize)) ||
        ((positionX + (3 * blockSize) >= (ship[1] - 2)) && (positionX + (3 * blockSize) <= (ship[1] + 2 )) && (positionY + (3 * blockSize) >= ship[0]) && (positionY <= ship[0] + blockSize)) ||
		((positionY >= ((ship[0] + blockSize) - 2)) && (positionY <= ((ship[0] + blockSize) + 2 )) && (positionX + (3 * blockSize) >= ship[1]) && ((positionX) <= ship[1] + blockSize)) ||
        ((positionY + (3 * blockSize) >= (ship[0] - 2)) && (positionY + (3 * blockSize) <= (ship[0]+ 2)) && (positionX + (3 * blockSize) >= ship[1]) && ((positionX) <= ship[1] + blockSize)) ){ 
		
        console.log("collision occurred");
		return true;
	}
	return false;
}

function checkAndRemoveShip (ships, i) {
	if (ships[i][0] > (height*blockSize)){
		ships.splice(i, i);
	}
	console.log(ships.length);
	return ships;
}

function update (){
    if (gameOver) {
        return;
    }

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

    context.fillStyle = "blue";
    context.fillRect(0, 0, board.width, board.height);

    context.drawImage(img, positionX, positionY, 3 * blockSize, 3 * blockSize);

    if (counter % 150 == 0){
        addShip();
    }
    counter++;

    context.fillStyle = "red";

    for (let i=0; i < ships.length; i++){
		checkAndRemoveShip(ships, i);

		collision = checkCollision(ships[i]);
		if (collision){
			gameOver = true;
            alert("Game Over. You stayed afloat for " + second + " seconds!");
            timer = false;
		}

        ships[i][0] = ships[i][0] + 1;
        
        context.fillRect(ships[i][1], ships[i][0], blockSize, blockSize);
        context.drawImage(mineImg, ships[i][1], ships[i][0],  blockSize,  blockSize);

    }

    positionY += speedY;
    positionX += speedX;

    speedX = speedX/1.005;
    speedY = speedY/1.005;
    
    if ((positionY + (3 * blockSize) >= height * blockSize) || (positionX + (3 * blockSize) >= width * blockSize) || (positionY <= 0) || (positionX <= 0) ){
        alert("Game Over. You stayed afloat for " + second + " seconds!");
        gameOver = true;
        timer = false;
    }

}

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

function addShip (){
    newShip = Math.floor(Math.random() * (width));
    ships.push([-20, newShip*blockSize])
}

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