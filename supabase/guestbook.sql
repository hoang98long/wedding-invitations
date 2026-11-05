-- Run once in your Supabase project's SQL Editor before deploying to Vercel.
-- Only the server's service role can access the table and write function.
create table if not exists public.wedding_wishes (
  id uuid primary key,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  message text not null check (char_length(btrim(message)) between 1 and 600),
  created_at timestamptz not null default now(),
  visitor_hash text not null
);
create index if not exists wedding_wishes_created_at_idx on public.wedding_wishes (created_at desc);
create index if not exists wedding_wishes_visitor_idx on public.wedding_wishes (visitor_hash, created_at desc);
alter table public.wedding_wishes enable row level security;
revoke all on public.wedding_wishes from anon, authenticated;
grant select, insert on public.wedding_wishes to service_role;
grant usage on schema public to service_role;

create or replace function public.add_wedding_wish(p_id uuid, p_name text, p_message text, p_visitor_hash text)
returns table (id uuid, name text, message text, created_at timestamptz)
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  -- Serialize submissions by visitor even when multiple serverless instances run.
  perform pg_advisory_xact_lock(hashtextextended(p_visitor_hash, 0));
  if exists(select 1 from public.wedding_wishes w where w.id = p_id) then
    return query select w.id, w.name, w.message, w.created_at from public.wedding_wishes w where w.id = p_id;
    return;
  end if;
  if exists(select 1 from public.wedding_wishes w where w.visitor_hash = p_visitor_hash and w.created_at > now() - interval '20 seconds') then
    raise exception 'WISH_RATE_LIMIT';
  end if;
  return query insert into public.wedding_wishes as w (id, name, message, visitor_hash)
    values (p_id, btrim(p_name), btrim(p_message), p_visitor_hash)
    returning w.id, w.name, w.message, w.created_at;
end;
$$;
revoke all on function public.add_wedding_wish(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.add_wedding_wish(uuid, text, text, text) to service_role;
notify pgrst, 'reload schema';
