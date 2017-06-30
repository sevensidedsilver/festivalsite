update users
  set starred_threads = $1
  where id = $2
