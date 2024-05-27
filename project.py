# this is the code that gets run in order to start the website up. It renders each page's html.
from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("home.html")
    
@app.route('/map')
def explore():
    return render_template("map.html")

@app.route('/aboutus')
def aboutus():
    return render_template("aboutus.html")

@app.route('/charts')
def details():
    return render_template("charts.html")

@app.route('/pirategame')
def pirategame():
    return render_template("game.html")

    
if __name__ == '__main__':
    my_port = 5216
    app.run(host='0.0.0.0', port = my_port) 
