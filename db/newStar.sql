update users
set starred_threads = array_append(starred_threads, $2)
where id = $1
