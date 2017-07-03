update users
set starred_threads = array_remove(starred_threads, $2)
where id = $1
