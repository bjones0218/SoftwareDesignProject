window.onscroll = function() {
    const headBar = document.getElementById('headBar');
    if (window.scrollY > 100) {
        headBar.style.backgroundColor = '#222';
    } else {
        headBar.style.backgroundColor = '#333';
    }
};