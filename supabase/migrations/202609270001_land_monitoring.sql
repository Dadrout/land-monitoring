create extension if not exists pgcrypto;

create table if not exists public.land_plots (
  id uuid primary key default gen_random_uuid(),
  cadastral_number text not null unique,
  purpose text not null,
  area_ha numeric(10,2) not null check (area_ha > 0),
  latitude double precision not null,
  longitude double precision not null,
  status text not null default 'normal' check (status in ('normal','pending','violation','in_progress','resolved','returned')),
  deadline date,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.citizen_reports (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id text,
  category text not null,
  latitude double precision not null,
  longitude double precision not null,
  description text not null,
  photo_url text,
  status text not null default 'pending' check (status in ('pending','violation','in_progress','resolved','rejected')),
  plot_id uuid references public.land_plots(id) on delete set null,
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.land_applications (
  id uuid primary key default gen_random_uuid(),
  tracking_number text not null unique,
  status text not null,
  stage text not null,
  description text not null,
  eta text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.telegram_sessions (
  telegram_user_id text primary key,
  payload jsonb not null default '{"step":"idle"}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.land_plots enable row level security;
alter table public.citizen_reports enable row level security;
alter table public.land_applications enable row level security;
alter table public.telegram_sessions enable row level security;

insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view report photos" on storage.objects;

create policy "Public can view report photos"
on storage.objects for select
using (bucket_id = 'report-photos');

insert into public.land_plots (cadastral_number, purpose, area_ha, latitude, longitude, status, deadline) values
('03-047-001-001','ИЖС',0.12,42.9006,71.3647,'normal',null),
('03-047-001-002','Коммерческое использование',0.42,42.9055,71.3704,'pending','2026-10-02'),
('03-047-001-003','Сельхозназначение',1.85,42.8957,71.3762,'violation','2026-09-30'),
('03-047-001-004','ИЖС',0.10,42.9088,71.3600,'normal',null),
('03-047-001-005','Складское назначение',0.67,42.8930,71.3586,'in_progress','2026-10-04'),
('03-047-001-006','ИЖС',0.15,42.9122,71.3744,'normal',null),
('03-047-001-007','Сельхозназначение',2.10,42.8886,71.3690,'resolved',null),
('03-047-001-008','Общественная зона',0.35,42.9018,71.3832,'normal',null),
('03-047-001-009','ИЖС',0.14,42.9143,71.3661,'pending','2026-10-03'),
('03-047-001-010','Коммерческое использование',0.55,42.8872,71.3805,'violation','2026-09-26'),
('03-047-001-011','Сельхозназначение',1.40,42.9181,71.3810,'normal',null),
('03-047-001-012','ИЖС',0.11,42.8830,71.3641,'normal',null),
('03-047-001-013','Производственная зона',0.95,42.8976,71.3504,'violation','2026-10-01'),
('03-047-001-014','ИЖС',0.13,42.9101,71.3882,'normal',null),
('03-047-001-015','Сельхозназначение',2.55,42.8798,71.3740,'normal',null)
on conflict (cadastral_number) do nothing;

insert into public.land_applications (tracking_number, status, stage, description, eta) values
('KZ-2026-042','На рассмотрении','Проверка документов','Документы приняты и проходят первичную проверку.','3 рабочих дня'),
('KZ-2026-043','Назначен выезд инспектора','Полевой контроль','Назначен выезд для подтверждения фактического состояния участка.','1-2 рабочих дня'),
('KZ-2026-044','Одобрено','Решение принято','Заявление одобрено. Итоговый документ доступен в личном кабинете.','Завершено'),
('KZ-2026-045','Отказ','Решение принято','Недостаточно документов. Требуется повторная подача после устранения замечаний.','Завершено')
on conflict (tracking_number) do nothing;

insert into public.citizen_reports (telegram_user_id, category, latitude, longitude, description, status, plot_id, deadline)
select
  'demo-502',
  'Стихийная свалка',
  42.9051,
  71.3699,
  'Мусор на пустующем участке рядом с жилыми домами.',
  'pending',
  id,
  null
from public.land_plots
where cadastral_number = '03-047-001-002'
  and not exists (select 1 from public.citizen_reports where telegram_user_id = 'demo-502');

insert into public.citizen_reports (telegram_user_id, category, latitude, longitude, description, status, plot_id, deadline)
select
  'demo-416',
  'Земля не используется',
  42.8954,
  71.3760,
  'Участок долго не используется, территория заросла.',
  'violation',
  id,
  '2026-09-30'
from public.land_plots
where cadastral_number = '03-047-001-003'
  and not exists (select 1 from public.citizen_reports where telegram_user_id = 'demo-416');

create index if not exists idx_land_plots_status on public.land_plots(status);
create index if not exists idx_citizen_reports_status on public.citizen_reports(status);
create index if not exists idx_citizen_reports_created_at on public.citizen_reports(created_at desc);
create index if not exists idx_land_applications_tracking_number on public.land_applications(tracking_number);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'citizen_reports'
  ) then
    alter publication supabase_realtime add table public.citizen_reports;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'land_plots'
  ) then
    alter publication supabase_realtime add table public.land_plots;
  end if;
end
$$;

-- All database writes are performed by the server-only Supabase secret key.
-- Public clients receive no table policies, so inspector data remains closed until real auth/roles are added.
