update users
set feed_top = array_remove(feed_top, $2)
where id = $1
