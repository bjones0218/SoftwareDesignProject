from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("home.html")
    
@app.route('/explore')
def explore():
    return render_template("explore.html")

@app.route('/aboutus')
def aboutus():
    return render_template("aboutus.html")

@app.route('/details')
def details():
    return render_template("details.html")

@app.route('/explorebyregion')
def explorebyregion():
    return render_template("explorebyregion.html")
    
if __name__ == '__main__':
    my_port = 5216
    app.run(host='0.0.0.0', port = my_port) 
