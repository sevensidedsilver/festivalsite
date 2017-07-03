update users
set feed_top = array_append(feed_top, $1)
where id = $2
