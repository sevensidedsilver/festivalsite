select * from comments
join threads on comments.thread_id = threads.thread_id
where comments.reported = 1
