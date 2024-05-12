from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("home.html")
    
@app.route('/explore')
def explore():
    return render_template("explore.html")
if __name__ == '__main__':
    my_port = 5216
    app.run(host='0.0.0.0', port = my_port) 
