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


