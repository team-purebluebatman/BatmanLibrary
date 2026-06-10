import mysql.connector
from flask import Flask, render_template, redirect, url_for, request
from flask import send_from_directory

app = Flask(__name__, template_folder='src', static_folder='src/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/library.html')
def library():
    db = mysql.connector.connect(
        host="localhost",
        port=3308,
        user="root",
        password="1234",
        database="library"
    )
    cursor = db.cursor()
    cursor.execute("SELECT * FROM books")
    data = cursor.fetchall()
    return render_template('library.html', books=data)

@app.route('/community.html')
def community():
    db = mysql.connector.connect(
        host="localhost",
        port=3308,
        user="root",
        password="1234",
        database="library"
    )
    cursor = db.cursor()
    cursor.execute("SELECT * FROM contents")
    data = cursor.fetchall()
    return render_template('community.html', contents=data)

@app.route('/index.html')
def home():
    return redirect(url_for('index'))

@app.route('/publish')
def publish_do():
    return render_template('publish.html')

@app.route('/content')
def content_do():
    return render_template('content.html')

@app.route('/publishing', methods=['POST'])
def publishing():
    title = request.form.get('title')
    author = request.form.get('author')
    explain = request.form.get('explain')
    pdf = request.files['content']
    pdf.save(f'./web/src/uploads/{title}.pdf')
    db = mysql.connector.connect(
        host="localhost",
        port=3308,
        user="root",
        password="1234",
        database="library"
    )
    cursor = db.cursor()
    sql = "INSERT INTO books (book_name, author, descriptions) VALUES (%s, %s, %s)"
    cursor.execute(sql, (title, author, explain))
    db.commit()

    return redirect(url_for('library'))

@app.route('/contenting')
def contenting():
    ttitle = request.args.get('title')
    tauthor = request.args.get('author')
    tcontent = request.args.get('content')
    db = mysql.connector.connect(
        host="localhost",
        port=3308,
        user="root",
        password="1234",
        database="library"
    )
    cursor = db.cursor()
    sql = "INSERT INTO contents (content_title, author, content) VALUES (%s, %s, %s)"
    cursor.execute(sql, (ttitle, tauthor, tcontent))
    db.commit()

    return redirect(url_for('community'))



@app.route('/pdf/<filename>')
def pdf_view(filename):
    return send_from_directory(
        'src/uploads',
        filename
    )


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