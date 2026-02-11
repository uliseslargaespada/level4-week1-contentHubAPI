-- Create custom user (role) for Prisma.
-- Prisma needs createdb for shadow database workflows when using migrate dev.
create user "prisma" with password 'REPLACE_WITH_A_STRONG_PASSWORD' bypassrls createdb;

-- Give Postgres ownership of the new user so migrations are visible in Supabase tooling.
grant "prisma" to "postgres";

-- Grant Prisma access to public schema objects
grant usage on schema public to prisma;
grant create on schema public to prisma;

grant all on all tables in schema public to prisma;
grant all on all routines in schema public to prisma;
grant all on all sequences in schema public to prisma;

alter default privileges for role postgres in schema public grant all on tables to prisma;
alter default privileges for role postgres in schema public grant all on routines to prisma;
alter default privileges for role postgres in schema public grant all on sequences to prisma;
