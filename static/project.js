window.onscroll = function() {
    const headBar = document.getElementById('headBar');
    if (window.scrollY > 100) {
        headBar.style.backgroundColor = '#222';
    } else {
        headBar.style.backgroundColor = '#333';
    }
};

function mouseEnterExplore(){
    exploreinheadbar = document.getElementById("exploreinheadbar");
    exploreinheadbar.style.backgroundColor = rgb(78, 74, 74);
    bigexplore = document.getElementById("bigButton");
    bigexplore.style.backgroundColor = "#CD853F";
};

function mouseOutExplore(){
    exploreinheadbar = document.getElementById("exploreinheadbar");
    exploreinheadbar.style.backgroundColor = 555;
    bigexplore = document.getElementById("bigButton");
    bigexplore.style.backgroundColor = "#D2B48C";
};