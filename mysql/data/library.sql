use library;
create table books(
    book_id int primary key auto_increment,
    book_name varchar(255) not null,
    author varchar(100) not null,
    descriptions varchar(255) not null
);
create table contents(
    content_id int primary key auto_increment,
    content_title varchar(255) not null,
    author varchar(100) not null,
    content varchar(255) not null
);
CREATE TABLE storages (
    storage_id  INT          PRIMARY KEY AUTO_INCREMENT,
    member_id   INT          NOT NULL,
    stored_book VARCHAR(255) NOT NULL,
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book (member_id, stored_book)
);
create table members (
    id       INT          PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50)  UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50)  NOT NULL,
    created_at DATETIME   DEFAULT CURRENT_TIMESTAMP
);
