-- ummado product schema + tables
-- Applied manually by user after running: select public.pmd_create_product_schema('ummado');

create table if not exists ummado.prompts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  prompt_text text not null,
  is_revealed boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists ummado.model_responses (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references ummado.prompts(id) on delete cascade,
  model_id text not null,
  interpretation text not null,
  reasoning text not null,
  created_at timestamptz not null default now(),
  unique (prompt_id, model_id)
);

-- Row Level Security
alter table ummado.prompts enable row level security;
alter table ummado.model_responses enable row level security;

-- Public can read only published prompts
create policy "public read published prompts" on ummado.prompts
  for select to anon, authenticated using (is_published);

-- Public can read responses of published prompts
create policy "public read responses of published prompts" on ummado.model_responses
  for select to anon, authenticated using (
    exists (select 1 from ummado.prompts p where p.id = prompt_id and p.is_published)
  );

-- Permissions
grant select on ummado.prompts, ummado.model_responses to anon, authenticated;
grant all on ummado.prompts, ummado.model_responses to service_role;
