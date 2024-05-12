from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def home():
    message = "Welcome to the Home Webpage."
    return render_template("home.html")
    
@app.route('/explore')
def explore():
    message = "This is the next page."
    return render_template("explore.html")
if __name__ == '__main__':
    my_port = 5432
    app.run(host='0.0.0.0', port = my_port) 
