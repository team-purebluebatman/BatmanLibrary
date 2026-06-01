import mysql.connector
from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__, template_folder='src', static_folder='src/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/library.html')
def library():
    return render_template('library.html')

@app.route('/community.html')
def community():
    return render_template('community.html')

@app.route('/index.html')
def home():
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=9000, host='0.0.0.0')

conn = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="1234",
    database="library",
    port=3308
)

cursor = conn.cursor()

cursor.execute("SELECT * FROM members")

result = cursor.fetchall()

for row in result:
    print(row)

conn.close()