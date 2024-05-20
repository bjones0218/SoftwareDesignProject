
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

let minute = 0; 
let second = 0; 
let count = 0;

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
    console.log("Button clicked");
    clearInterval(myInterval);
    startButton = document.getElementById("restart-button");
    if (startButton.innerText == "Restart") {
        gameOver = true;
        startButton.innerText = "Start";
        counter = 0;
        ships = [];
        timer = false; 
        minute = 0; 
        second = 0; 
        count = 0; 
        document.getElementById('min').innerHTML = "00"; 
        document.getElementById('sec').innerHTML = "00"; 
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

	if ((positionX >= ((ship[1] + blockSize) - 2)) && (positionX <= ((ship[1] + blockSize) + 2 )) && (positionY + blockSize >= ship[0]) && ((positionY + blockSize) <= ship[0] + (2 * blockSize)) ||
        (positionX + blockSize >= (ship[1] - 2)) && (positionX + blockSize <= (ship[1] + 2 )) && (positionY + blockSize >= ship[0]) && ((positionY + blockSize) <= ship[0] + (2 * blockSize)) ||
		((positionY >= ((ship[0] + blockSize) - 2)) && (positionY <= ((ship[0] + blockSize) + 2 )) && (positionX + blockSize >= ship[1]) && ((positionX + blockSize) <= ship[1] + (2 * blockSize))) ||
        (positionY + blockSize >= (ship[0] - 2)) && (positionY + blockSize <= (ship[0]+ 2 )) && (positionX + blockSize >= ship[1]) && ((positionX + blockSize) <= ship[1] + (2 * blockSize)) ){ 
		
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

    context.fillStyle = "blue";
    context.fillRect(0, 0, board.width, board.height);
    context.fillStyle = "white";
    context.fillRect(positionX, positionY, blockSize, blockSize);

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
            alert("Game Over");
            timer = false;
		}

        ships[i][0] = ships[i][0] + 1;
        
        context.fillRect(ships[i][1], ships[i][0], blockSize, blockSize);
    }

    positionY += speedY;
    positionX += speedX;

    speedX = speedX/1.005;
    speedY = speedY/1.005;
    

    if ((positionY >= height * blockSize) || (positionX >= width * blockSize) || (positionY < 0) || (positionX < 0) ){
        alert("Game Over");
        gameOver = true;
        timer = false;
    }

}

function changeDirection(e) {
    if (e.code == "ArrowUp") {
        // If up arrow key pressed with this condition...
        // snake will not move in the opposite direction
        speedY = speedY - 0.2;
    }
    else if (e.code == "ArrowDown") {
        //If down arrow key pressed
        speedY = speedY + 0.2;
    }
    else if (e.code == "ArrowLeft") {
        //If left arrow key pressed
        speedX = speedX - 0.2;
    }
    else if (e.code == "ArrowRight") {
        //If Right arrow key pressed
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
  
        if (second == 60) { 
            minute++; 
            second = 0; 
        } 

        let minString = minute; 
        let secString = second; 
  
        if (minute < 10) { 
            minString = "0" + minString; 
        } 
  
        if (second < 10) { 
            secString = "0" + secString; 
        } 
  

        document.getElementById('min').innerHTML = minString; 
        document.getElementById('sec').innerHTML = secString; 

        setTimeout(stopWatch, 10); 
    } 
}