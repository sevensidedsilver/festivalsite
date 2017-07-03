select * from users
 WHERE starred_threads @> '{$1}'::int[];
