-- Reset Project sequence
SELECT setval('"Project_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Project"), false); 