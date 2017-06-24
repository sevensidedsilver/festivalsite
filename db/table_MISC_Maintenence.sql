-- //create threads

create table threads
(thread_id serial primary key,
 author_id text,
 author_display text,
 thread_title text,
 thread_content text,
 created_at text,
 reported int
)




-- create comments

create table comments
(comment_id serial primary key,
 thread_id integer,
 parent_comment integer,
 author_display text,
 comment_content text,
 created_at text,
 reported int)
