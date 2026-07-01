# Batman Library 🦇

> **"사용자가 만드는 도서관"**

저희 Batman Library의 유래는 유재연의 *오버워치 닉네임*으로부터 시작되었습니다. 그의 오버워치 닉네임은 블리자드의 랜덤 닉네임인 ***"순수한푸른박쥐",*** 본래 pureBlueBat Library로 작명하려고 하였으나, 너무 길고 가독성이 떨어지는 이유로 비슷한 Batman을 택하여 Batman Library가 되었습니다.

<br>

<br>

## ⚙️ 그래서 기능이 뭔데요?

- 커뮤니티 기능
- <span style="color:yellow">⭐️ 도서 출판 기능 ⭐️</span>
- 도서 보관 기능<br>

...등의 기능이 있습니다.

<br>

<br>

## 📊 차별화 된 점은?

기존 전자책 웹은 전국 도서관을 기반으로 도서를 제공합니다. 하지만 저희는 여러분이 만들어가는 도서관 즉, <mark style="background-color:rgb(255, 100, 100); color:white">**직접 책을 쓰고 출판할 수 있는 기능**</mark>이 있습니다.

<br>

<br>

## 📟 사용한 기술 스택
### 🐳 **Docker(containers)**
- 💾 **Mysql(docker server)**
- 🐍 **Python(Flask, backend)**
### 🖥️ **HTML 5**
### 🎨 **CSS 3**

<br>
<br>

## 📈 현재 진행 상태
<progress max=100 value=100 id="pro"></progress> <label for="pro">100%</label> <br>
- [x] Mysql 구동(Docker container)
- [x] HTML/CSS로 화면 구현
- [x] Python Flask로 로직 구현
- [x] Docker compose로 웹 구동

## 🔗 로직 설명
모든 로직은 Python Flask를 백엔드로 사용하여 구동됩니다.
### 📖 책 출판
1. 책 출판 버튼을 눌러 책 제목, 저자 그리고 책 페이지가 될 PDF 파일을 업로드 합니다.
2. 출판 버튼을 누르면 입력된 정보들이 다음 형식의 코드로 받아와 집니다 :
``` python
# form에서 input 받아오기
title = request.form.get('title')
```
PDF 저장은 받아온 title을 토대로 uploads라는 파일에 저장됩니다.
``` python
# form에 업로드된 파일 저장
pdf = request.files['content']
pdf.save(f'./web/src/uploads/{title}.pdf')
```
3. Python 내에서 sql 쿼리문을 작성해 책 데이터를 저장합니다.
``` python
# Python에서 SQL 구동하기
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
```
4. 같은 방법으로 테이블 전체를 SELECT한 결과를 render_template으로 HTML에 보낸 후, return 합니다.
---
### 📮 책 읽기/보관함 기능
**책 읽기** 기능은 Python의 send_from_directory 모듈을 사용하여 버튼을 눌렀을 때, pdf 파일을 _blank 속성에 의해 새탭에 띄워지게 된다
<br>
<br>
**보관함 기능**은 '보관함에 담기' 버튼을 누를 시, 해당 책의 이름을 백엔드로 전송하여 **sql table**에서 해당 책을 검색하여 다시 프런트엔드로 전송한다.

### 보관함 기능 단계 한 눈에 보기
1. '보관함에 담기' 버튼을 누르면 해당 책의 이름이 백엔드로 전송됩니다.
2. 책 pdf 파일은 백엔드에 책의 이름으로 저장되어 있습니다. 이를 통해 'storages'테이블에 이름을 저장합니다.
3. 보관함에 있는 '책 읽기'버튼에 방금 받은 책 이름을 프런트엔드로 전송합니다.
4. 보관함의 책 읽기 버튼을 누르면 백엔드에 책 이름으로 저장되어 있는 pdf를 불러옵니다!

