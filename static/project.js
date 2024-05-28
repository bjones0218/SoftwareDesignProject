// this file includes hover effects functionns

//this function adds hover effect
function mouseEnterExplore(){
    bigexplore = document.getElementById("bigButton");
    bigexplore.style.backgroundColor = "#CD853F";
    bigexplore.style.transform = "scale(1.2)";
    bigexplore.style.transition = "all .2s ease-in"
    mapbutton = document.getElementById("map");
    mapbutton.style.backgroundColor = "#rgb(78, 74, 74)";
    mapbutton.style.color = "white";
};

//this function removes the hover effect when teh mouse leave the button
function mouseOutExplore(){
    bigexplore = document.getElementById("bigButton");
    bigexplore.style.backgroundColor = "#D2B48C";
    bigexplore.style.transform = "scale(1)";
    bigexplore.style.transition = "all .2s ease-out"
    mapbutton = document.getElementById("map");
    mapbutton.style.backgroundColor = "#555";
    mapbutton.style.color = "white";
};
