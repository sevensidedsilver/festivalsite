select * from users
where id = $1
returning *
