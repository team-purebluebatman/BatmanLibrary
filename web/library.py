import mysql.connector
from flask import Flask, render_template, redirect, url_for, request, jsonify, session
from flask import send_from_directory
import bcrypt

app = Flask(__name__, template_folder='src', static_folder='src/static')
app.secret_key = 'batmangodamcity123'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/library.html')
def library():
    db = mysql.connector.connect(
        host="mysql-lib", port=3306,
        user="root", password="1234", database="library"
    )
    cursor = db.cursor()
    cursor.execute("SELECT * FROM books")
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return render_template('library.html', books=data)

@app.route('/community.html')
def community():
    db = mysql.connector.connect(
        host="mysql-lib", port=3306,
        user="root", password="1234", database="library"
    )
    cursor = db.cursor()
    cursor.execute("SELECT * FROM contents")
    data = cursor.fetchall()
    cursor.close()
    db.close()
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

# ✅ 수정: 로그인 유저 보관함만 조회
@app.route("/storage.html")
def event_open():
    if not session.get('logged_in'):           # 비로그인 차단
        return redirect(url_for('index'))

    member_id = session.get('user_id')         # ← 핵심

    db = mysql.connector.connect(
        host="mysql-lib", port=3306,
        user="root", password="1234", database="library"
    )
    cursor = db.cursor()
    sql = """
        SELECT s.*, b.descriptions 
        FROM storages s
        JOIN books b ON s.stored_book = b.book_name
        WHERE s.member_id = %s
    """
    cursor.execute(sql, (member_id,))          # ← member_id 필터
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return render_template("storage.html", sto=data, err_c=None)

@app.route('/publishing', methods=['POST'])
def publishing():
    title = request.form.get('title')
    author = request.form.get('author')
    explain = request.form.get('explain')
    pdf = request.files['content']
    pdf.save(f'./web/src/uploads/{title}.pdf')
    db = mysql.connector.connect(
        host="mysql-lib", port=3306,
        user="root", password="1234", database="library"
    )
    cursor = db.cursor()
    sql = "INSERT INTO books (book_name, author, descriptions) VALUES (%s, %s, %s)"
    cursor.execute(sql, (title, author, explain))
    db.commit()
    cursor.close()
    db.close()
    return redirect(url_for('library'))

@app.route('/contenting')
def contenting():
    ttitle = request.args.get('title')
    tauthor = request.args.get('author')
    tcontent = request.args.get('content')
    db = mysql.connector.connect(
        host="mysql-lib", port=3306,
        user="root", password="1234", database="library"
    )
    cursor = db.cursor()
    sql = "INSERT INTO contents (content_title, author, content) VALUES (%s, %s, %s)"
    cursor.execute(sql, (ttitle, tauthor, tcontent))
    db.commit()
    cursor.close()
    db.close()
    return redirect(url_for('community'))

@app.route('/pdf/<filename>')
def pdf_view(filename):
    return send_from_directory('src/uploads', filename)

# ✅ 수정: member_id 포함해서 INSERT
@app.route("/store")
def store():
    if not session.get('logged_in'):           # 비로그인 차단
        return redirect(url_for('index'))

    member_id = session.get('user_id')         # ← 핵심
    bookname = request.args.get("action")

    try:
        db = mysql.connector.connect(
            host="mysql-lib", port=3306,
            user="root", password="1234", database="library"
        )
        cursor = db.cursor()
        sql = "INSERT INTO storages (member_id, stored_book) VALUES (%s, %s)"  # ← member_id 추가
        cursor.execute(sql, (member_id, bookname))
        db.commit()
        cursor.close()
        db.close()

    except mysql.connector.Error as err:
        if err.errno == 1062:
            db = mysql.connector.connect(
                host="mysql-lib", port=3306,
                user="root", password="1234", database="library"
            )
            cursor = db.cursor()
            sql = """
                SELECT s.*, b.descriptions 
                FROM storages s
                JOIN books b ON s.stored_book = b.book_name
                WHERE s.member_id = %s
            """
            cursor.execute(sql, (member_id,))  # ← 에러시에도 본인 것만
            data = cursor.fetchall()
            cursor.close()
            db.close()
            return render_template("storage.html", sto=data, err_c=err.errno)

    return redirect(url_for("event_open"))

# ✅ 수정: session에 user_id(members.id) 추가
@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    db = mysql.connector.connect(
        host="mysql-lib", port=3306,
        user="root", password="1234", database="library"
    )
    cursor = db.cursor()
    cursor.execute("SELECT * FROM members WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    # user = (id, username, password(hashed), nickname, created_at)
    if user and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
        session['logged_in'] = True
        session['user_id']   = user[0]   # ← 추가! (members.id)
        session['username']  = username
        session['nickname']  = user[3]
        return jsonify({'success': True, 'nickname': user[3]})
    else:
        return jsonify({'success': False, 'message': '아이디 또는 비밀번호가 틀렸습니다.'})

@app.route('/signup', methods=['POST'])
def signup():
    username = request.form.get('username')
    password = request.form.get('password')
    nickname = request.form.get('nickname')
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    try:
        db = mysql.connector.connect(
            host="mysql-lib", port=3306,
            user="root", password="1234", database="library"
        )
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO members (username, password, nickname) VALUES (%s, %s, %s)",
            (username, hashed, nickname)
        )
        db.commit()
        cursor.close()
        db.close()
        return jsonify({'success': True})
    except mysql.connector.Error as err:
        if err.errno == 1062:
            return jsonify({'success': False, 'message': '이미 사용 중인 아이디입니다.'})
        return jsonify({'success': False, 'message': '오류가 발생했습니다.'})

@app.route('/logout')
def logout():
    session.clear()
    return jsonify({'success': True})

@app.route('/check_auth')
def check_auth():
    return jsonify({
        'logged_in': session.get('logged_in', False),
        'username':  session.get('username', ''),
        'nickname':  session.get('nickname', '')
    })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)