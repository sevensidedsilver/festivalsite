insert into threads (author_display, thread_title, thread_content, created_at)
  values ($1, $2, $3, $4)
  returning * 
