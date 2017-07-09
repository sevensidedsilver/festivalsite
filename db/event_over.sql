UPDATE events
SET upcoming = 0
WHERE id = $1;
