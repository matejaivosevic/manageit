-- AlterSequence
ALTER SEQUENCE "Project_id_seq" RESTART WITH 1;
DELETE FROM "Project" WHERE id > 0; 