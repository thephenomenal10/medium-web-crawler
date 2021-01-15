CREATE DATABASE medium;

CREATE TABLE mediumBlogs(
    id SERIAL PRIMARY KEY,
    title VARCHAR UNIQUE,
    creator VARCHAR,
    details VARCHAR,
    blogUrl VARCHAR,
    tag VARCHAR
    
);