use library;
create table books(
    book_id int primary key auto_increment,
    book_name varchar(255) not null,
    author varchar(100) not null,
    descriptions varchar(255) not null
);
create table members(
    member_id int primary key auto_increment,
    member_name varchar(255) not null,
    email varchar(100) not null unique,
    phone varchar(20) not null
);
create table loans(
    loan_id int primary key auto_increment,
    book_id int,
    member_id int,
    loan_date date,
    return_date date,
    foreign key (book_id) references books(book_id),
    foreign key (member_id) references members(member_id)
);
ALTER TABLE books
RENAME COLUMN content TO descriptions;
