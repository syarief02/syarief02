-- =====================================================================
-- Guestbook hardening for public.comments (syariefazman.com #guestbook)
-- Run in: Supabase Dashboard -> SQL Editor. Safe to re-run.
--
-- Why: the anon key in script.js is public, so anyone can POST straight to
-- /rest/v1/comments and skip the browser-side honeypot, cooldown and link
-- checks. These rules move the important ones into the database.
--
-- !! This Supabase project is SHARED with eabudakubat.com. If that site also
-- !! reads or writes public.comments, check the limits below (lengths, the
-- !! allowed `type` values, the rate limit) still suit it before running.
-- =====================================================================

-- STEP 0 (read-only): look at the policies that exist today.
-- Any older permissive SELECT policy (e.g. USING (true)) would let hidden
-- posts show again, so drop it after reviewing this output.
-- select policyname, cmd, roles, qual, with_check
--   from pg_policies where schemaname = 'public' and tablename = 'comments';

begin;

-- 1. Moderation without deleting: set hidden = true in the Table Editor
--    and the post disappears from the site on the next refresh.
alter table public.comments add column if not exists hidden boolean not null default false;

-- 2. Content rules (mirror the browser-side checks in script.js).
--    NOT VALID = only new rows are checked; existing posts are left alone.
alter table public.comments drop constraint if exists comments_name_len;
alter table public.comments add constraint comments_name_len
  check (char_length(btrim(name)) between 2 and 60) not valid;

alter table public.comments drop constraint if exists comments_message_len;
alter table public.comments add constraint comments_message_len
  check (char_length(btrim(message)) between 3 and 1000) not valid;

alter table public.comments drop constraint if exists comments_ea_name_len;
alter table public.comments add constraint comments_ea_name_len
  check (ea_name is null or char_length(ea_name) <= 80) not valid;

alter table public.comments drop constraint if exists comments_type_allowed;
alter table public.comments add constraint comments_type_allowed
  check (type in ('feedback', 'idea', 'ea_request')) not valid;

alter table public.comments drop constraint if exists comments_link_limit;
alter table public.comments add constraint comments_link_limit
  check (array_length(regexp_split_to_array(message, 'https?://', 'i'), 1) - 1 <= 2) not valid;

alter table public.comments drop constraint if exists comments_no_script_uri;
alter table public.comments add constraint comments_no_script_uri
  check (message !~* '(javascript|data|vbscript):' and name !~* '(javascript|data|vbscript):') not valid;

-- 3. Anonymous visitors may only read, and only insert the four form fields.
--    (Stops spoofed created_at values pinning a post to the top, and any
--    anonymous UPDATE/DELETE regardless of what older policies allow.)
revoke insert, update, delete on public.comments from anon;
grant select on public.comments to anon;
grant insert (name, type, ea_name, message) on public.comments to anon;

-- 4. Row Level Security: public can read visible posts and add new ones.
alter table public.comments enable row level security;

drop policy if exists guestbook_public_read on public.comments;
create policy guestbook_public_read on public.comments
  for select to anon, authenticated using (not hidden);

drop policy if exists guestbook_public_insert on public.comments;
create policy guestbook_public_insert on public.comments
  for insert to anon, authenticated with check (not hidden);

-- 5. Server-side rate limit (site-wide, so it also stops scripted floods
--    that ignore the 30s browser cooldown) + trusted timestamps.
create index if not exists comments_created_at_idx on public.comments (created_at desc);

create or replace function public.comments_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.created_at := now();

  if (select count(*) from public.comments where created_at > now() - interval '1 minute') >= 5 then
    raise exception 'The guestbook is busy right now. Please try again in a minute.';
  end if;

  if (select count(*) from public.comments where created_at > now() - interval '1 day') >= 100 then
    raise exception 'The guestbook has reached its daily limit. Please try again tomorrow.';
  end if;

  return new;
end;
$$;

drop trigger if exists comments_guard on public.comments;
create trigger comments_guard
  before insert on public.comments
  for each row execute function public.comments_guard();

commit;

-- AFTER RUNNING: post a test message on the site (it should appear), then try
-- a message with 3 links (it should be rejected with a friendly error).
