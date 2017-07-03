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

-- create user table
create table users
  (id text,
   username text,
   admin int,
   starred_threads int[],
   feed_top int[]
  )

  update users
  set starred_threads = array_append(starred_threads, '3')
  where id = 'twitter|723378144'


-- notification abstraction
select * from comments
join threads on threads.thread_id = comments.thread_id
where threads.author_display = 'Sean Ruffolo'
