create extension if not exists pgcrypto;

create type public.org_role as enum ('org_admin', 'manager', 'department_head', 'staff');
create type public.task_status as enum ('todo', 'in_progress', 'blocked', 'done');
create type public.task_priority as enum ('low', 'medium', 'high', 'urgent');
create type public.goal_level as enum ('organisation', 'department', 'individual');
create type public.goal_status as enum ('not_started', 'in_progress', 'at_risk', 'completed', 'cancelled');

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 160),
  slug text not null unique,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
create table public.platform_administrators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '', job_title text, phone text, avatar_path text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.organisation_memberships (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.org_role not null default 'staff',
  status text not null default 'active' check (status in ('invited','active','suspended')),
  created_at timestamptz not null default now(), unique (organisation_id, user_id)
);
create table public.departments (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null, description text not null default '', head_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'active' check (status in ('active','inactive','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (organisation_id, name), unique (organisation_id, id)
);
create table public.staff_profiles (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null, department_id uuid references public.departments(id) on delete set null,
  display_name text not null default '', work_email text, employee_number text, job_title text not null default '', skills text[] not null default '{}', employment_start date,
  status text not null default 'active' check (status in ('active','inactive','on_leave')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (organisation_id, id), unique (organisation_id, user_id)
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  title text not null check (length(trim(title)) between 1 and 240), description text not null default '',
  status public.task_status not null default 'todo', priority public.task_priority not null default 'medium',
  assignee_user_id uuid references auth.users(id) on delete set null,
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  due_date date, completed_at timestamptz, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), archived_at timestamptz
);
create table public.task_subtasks (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade, title text not null,
  is_complete boolean not null default false, position integer not null default 0, created_at timestamptz not null default now()
);
create table public.goals (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null, owner_user_id uuid references auth.users(id) on delete set null,
  level public.goal_level not null, title text not null, description text not null default '', metric_name text,
  baseline numeric, target numeric, current_value numeric, unit text, status public.goal_status not null default 'not_started',
  start_date date, target_date date, created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), archived_at timestamptz,
  check ((level <> 'department') or department_id is not null), check ((level <> 'individual') or owner_user_id is not null)
);
create table public.goal_updates (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade, value numeric, note text not null default '',
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict, created_at timestamptz not null default now()
);
create table public.performance_cycles (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null, starts_on date not null, ends_on date not null,
  status text not null default 'draft' check (status in ('draft','open','closed')),
  created_at timestamptz not null default now(), check (ends_on >= starts_on)
);
create table public.performance_reviews (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  cycle_id uuid references public.performance_cycles(id) on delete set null,
  subject_user_id uuid not null references auth.users(id) on delete cascade, reviewer_user_id uuid references auth.users(id) on delete set null,
  summary text not null default '', strengths text not null default '', development_areas text not null default '',
  rating numeric check (rating between 0 and 5), status text not null default 'draft' check (status in ('draft','submitted','acknowledged')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.performance_evidence (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  review_id uuid not null references public.performance_reviews(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null, task_id uuid references public.tasks(id) on delete set null,
  note text not null default '', created_at timestamptz not null default now()
);
create table public.assets (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null, category text not null, description text not null default '', serial_number text,
  acquired_on date, condition text not null default 'good' check (condition in ('excellent','good','fair','poor','retired')),
  status text not null default 'available' check (status in ('available','assigned','maintenance','retired')),
  department_id uuid references public.departments(id) on delete set null, assigned_user_id uuid references auth.users(id) on delete set null,
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), archived_at timestamptz,
  unique (organisation_id, id)
);
create table public.asset_assignments (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  assigned_user_id uuid references auth.users(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now(), returned_at timestamptz
);
create unique index one_current_asset_assignment on public.asset_assignments(asset_id) where returned_at is null;
create table public.asset_maintenance (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade, description text not null,
  serviced_on date not null default current_date, next_service_on date, cost numeric(12,2),
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict, created_at timestamptz not null default now()
);
create table public.announcements (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null, title text not null, body text not null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz, expires_at timestamptz, created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.messages (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  sender_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  recipient_user_id uuid references auth.users(id) on delete cascade, department_id uuid references public.departments(id) on delete set null,
  subject text, body text not null, read_at timestamptz, created_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, title text not null, body text not null default '',
  href text, read_at timestamptz, created_at timestamptz not null default now()
);
create table public.saved_reports (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null, report_type text not null, filters jsonb not null default '{}'::jsonb,
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict, created_at timestamptz not null default now()
);
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null, entity_type text not null, entity_id uuid,
  action text not null, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

alter table public.departments add constraint departments_head_same_org foreign key (organisation_id, head_user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.staff_profiles add constraint staff_department_same_org foreign key (organisation_id, department_id) references public.departments(organisation_id, id);
alter table public.staff_profiles add constraint staff_user_same_org foreign key (organisation_id, user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.tasks add constraint tasks_org_id_unique unique (organisation_id, id);
alter table public.tasks add constraint tasks_department_same_org foreign key (organisation_id, department_id) references public.departments(organisation_id, id);
alter table public.tasks add constraint tasks_assignee_same_org foreign key (organisation_id, assignee_user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.tasks add constraint tasks_creator_same_org foreign key (organisation_id, created_by) references public.organisation_memberships(organisation_id, user_id);
alter table public.task_subtasks add constraint subtasks_task_same_org foreign key (organisation_id, task_id) references public.tasks(organisation_id, id);
alter table public.goals add constraint goals_org_id_unique unique (organisation_id, id);
alter table public.goals add constraint goals_department_same_org foreign key (organisation_id, department_id) references public.departments(organisation_id, id);
alter table public.goals add constraint goals_owner_same_org foreign key (organisation_id, owner_user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.goals add constraint goals_creator_same_org foreign key (organisation_id, created_by) references public.organisation_memberships(organisation_id, user_id);
alter table public.goal_updates add constraint goal_updates_goal_same_org foreign key (organisation_id, goal_id) references public.goals(organisation_id, id);
alter table public.goal_updates add constraint goal_updates_creator_same_org foreign key (organisation_id, created_by) references public.organisation_memberships(organisation_id, user_id);
alter table public.performance_cycles add constraint performance_cycles_org_id_unique unique (organisation_id, id);
alter table public.performance_reviews add constraint performance_reviews_org_id_unique unique (organisation_id, id);
alter table public.performance_reviews add constraint performance_reviews_cycle_same_org foreign key (organisation_id, cycle_id) references public.performance_cycles(organisation_id, id);
alter table public.performance_reviews add constraint performance_reviews_subject_same_org foreign key (organisation_id, subject_user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.performance_reviews add constraint performance_reviews_reviewer_same_org foreign key (organisation_id, reviewer_user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.performance_evidence add constraint performance_evidence_review_same_org foreign key (organisation_id, review_id) references public.performance_reviews(organisation_id, id);
alter table public.performance_evidence add constraint performance_evidence_goal_same_org foreign key (organisation_id, goal_id) references public.goals(organisation_id, id);
alter table public.performance_evidence add constraint performance_evidence_task_same_org foreign key (organisation_id, task_id) references public.tasks(organisation_id, id);
alter table public.assets add constraint assets_department_same_org foreign key (organisation_id, department_id) references public.departments(organisation_id, id);
alter table public.assets add constraint assets_assignee_same_org foreign key (organisation_id, assigned_user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.assets add constraint assets_creator_same_org foreign key (organisation_id, created_by) references public.organisation_memberships(organisation_id, user_id);
alter table public.asset_assignments add constraint asset_assignments_asset_same_org foreign key (organisation_id, asset_id) references public.assets(organisation_id, id);
alter table public.asset_assignments add constraint asset_assignments_department_same_org foreign key (organisation_id, department_id) references public.departments(organisation_id, id);
alter table public.asset_assignments add constraint asset_assignments_user_same_org foreign key (organisation_id, assigned_user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.asset_assignments add constraint asset_assignments_assigner_same_org foreign key (organisation_id, assigned_by) references public.organisation_memberships(organisation_id, user_id);
alter table public.asset_maintenance add constraint maintenance_asset_same_org foreign key (organisation_id, asset_id) references public.assets(organisation_id, id);
alter table public.asset_maintenance add constraint maintenance_creator_same_org foreign key (organisation_id, created_by) references public.organisation_memberships(organisation_id, user_id);
alter table public.announcements add constraint announcements_department_same_org foreign key (organisation_id, department_id) references public.departments(organisation_id, id);
alter table public.announcements add constraint announcements_creator_same_org foreign key (organisation_id, created_by) references public.organisation_memberships(organisation_id, user_id);
alter table public.messages add constraint messages_department_same_org foreign key (organisation_id, department_id) references public.departments(organisation_id, id);
alter table public.messages add constraint messages_sender_same_org foreign key (organisation_id, sender_user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.messages add constraint messages_recipient_same_org foreign key (organisation_id, recipient_user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.notifications add constraint notifications_user_same_org foreign key (organisation_id, user_id) references public.organisation_memberships(organisation_id, user_id);
alter table public.saved_reports add constraint saved_reports_creator_same_org foreign key (organisation_id, created_by) references public.organisation_memberships(organisation_id, user_id);

create index on public.organisation_memberships(user_id, status);
create index on public.departments(organisation_id, status);
create index on public.staff_profiles(organisation_id, department_id, status);
create index on public.tasks(organisation_id, status, due_date) where archived_at is null;
create index on public.tasks(organisation_id, assignee_user_id) where archived_at is null;
create index on public.goals(organisation_id, level, status) where archived_at is null;
create index on public.assets(organisation_id, status) where archived_at is null;
create index on public.announcements(organisation_id, status, published_at);
create index on public.notifications(user_id, read_at, created_at desc);
create index on public.activity_logs(organisation_id, created_at desc);

create or replace function public.is_org_member(target_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.organisation_memberships m where m.organisation_id = target_org
    and m.user_id = (select auth.uid()) and m.status = 'active');
$$;
create or replace function public.has_org_role(target_org uuid, allowed_roles public.org_role[])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.organisation_memberships m where m.organisation_id = target_org
    and m.user_id = (select auth.uid()) and m.status = 'active' and m.role = any(allowed_roles));
$$;

create or replace function public.provision_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare org_name text; org_id uuid; safe_slug text;
begin
  insert into public.user_profiles(id, display_name) values
    (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), ''));
  org_name := nullif(trim(new.raw_user_meta_data ->> 'organisation_name'), '');
  if org_name is not null then
    safe_slug := trim(both '-' from regexp_replace(lower(org_name), '[^a-z0-9]+', '-', 'g')) || '-' || substr(new.id::text, 1, 8);
    insert into public.organisations(name, slug) values (org_name, safe_slug) returning id into org_id;
    insert into public.organisation_memberships(organisation_id, user_id, role) values (org_id, new.id, 'org_admin');
    insert into public.staff_profiles(organisation_id, user_id, display_name, work_email)
    values (org_id, new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), ''), new.email);
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.provision_new_user();
revoke all on function public.provision_new_user() from public, anon, authenticated;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.has_org_role(uuid, public.org_role[]) to authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at := now(); return new; end; $$;
create or replace function public.write_activity_log()
returns trigger language plpgsql security definer set search_path = '' as $$
declare org_id uuid; entity_id uuid;
begin
  org_id := coalesce((to_jsonb(new)->>'organisation_id')::uuid, (to_jsonb(old)->>'organisation_id')::uuid);
  entity_id := coalesce((to_jsonb(new)->>'id')::uuid, (to_jsonb(old)->>'id')::uuid);
  insert into public.activity_logs(organisation_id, actor_user_id, entity_type, entity_id, action, details)
  values (org_id, (select auth.uid()), TG_TABLE_NAME, entity_id, lower(TG_OP), jsonb_build_object('operation', lower(TG_OP)));
  return coalesce(new, old);
end;
$$;
revoke all on function public.write_activity_log() from public, anon, authenticated;
create or replace function public.track_asset_assignment()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if TG_OP = 'UPDATE' and new.assigned_user_id is not distinct from old.assigned_user_id and new.department_id is not distinct from old.department_id then return new; end if;
  if TG_OP = 'UPDATE' then
    update public.asset_assignments set returned_at = now()
    where organisation_id = new.organisation_id and asset_id = new.id and returned_at is null;
  end if;
  if new.assigned_user_id is not null or new.department_id is not null then
    insert into public.asset_assignments(organisation_id, asset_id, assigned_user_id, department_id, assigned_by)
    values(new.organisation_id, new.id, new.assigned_user_id, new.department_id, (select auth.uid()));
  end if;
  return new;
end;
$$;
revoke all on function public.track_asset_assignment() from public, anon, authenticated;
revoke all on function public.is_org_member(uuid) from public, anon;
revoke all on function public.has_org_role(uuid, public.org_role[]) from public, anon;
revoke all on function public.set_updated_at() from public, anon, authenticated;
do $$ declare t text; begin
  foreach t in array array['organisations','user_profiles','departments','staff_profiles','tasks','goals','performance_reviews','assets','announcements'] loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute procedure public.set_updated_at()', t);
  end loop;
end $$;

do $$ declare t text; begin
  foreach t in array array['organisations','platform_administrators','organisation_memberships','departments','staff_profiles','tasks','task_subtasks','goals','goal_updates','performance_cycles','performance_reviews','performance_evidence','assets','asset_assignments','asset_maintenance','announcements','messages','notifications','saved_reports','activity_logs','user_profiles'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
create policy "members read organisations" on public.organisations for select to authenticated using (public.is_org_member(id));
create policy "admins update organisations" on public.organisations for update to authenticated using (public.has_org_role(id, array['org_admin']::public.org_role[])) with check (public.has_org_role(id, array['org_admin']::public.org_role[]));
create policy "members read memberships" on public.organisation_memberships for select to authenticated using (user_id = (select auth.uid()) or public.has_org_role(organisation_id, array['org_admin','manager']::public.org_role[]));
create policy "admins update member roles" on public.organisation_memberships for update to authenticated using (public.has_org_role(organisation_id, array['org_admin']::public.org_role[]) and user_id <> (select auth.uid())) with check (public.has_org_role(organisation_id, array['org_admin']::public.org_role[]));
create policy "read own profile" on public.user_profiles for select to authenticated using (id = (select auth.uid()));
create policy "update own profile" on public.user_profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "users update their own staff profile" on public.staff_profiles for update to authenticated using (user_id = (select auth.uid()) and public.is_org_member(organisation_id)) with check (user_id = (select auth.uid()) and public.is_org_member(organisation_id));

do $$ declare t text; begin
  foreach t in array array['departments','staff_profiles','tasks','task_subtasks','goals','goal_updates','performance_cycles','assets','asset_assignments','asset_maintenance','saved_reports','activity_logs'] loop
    execute format('create policy "members read %1$s" on public.%1$I for select to authenticated using (public.is_org_member(organisation_id))', t);
  end loop;
  foreach t in array array['departments','staff_profiles','tasks','task_subtasks','goals','goal_updates','performance_cycles','performance_reviews','performance_evidence','assets','asset_maintenance','announcements','saved_reports'] loop
    execute format('create policy "managers write %1$s" on public.%1$I for all to authenticated using (public.has_org_role(organisation_id, array[''org_admin'',''manager'',''department_head'']::public.org_role[])) with check (public.has_org_role(organisation_id, array[''org_admin'',''manager'',''department_head'']::public.org_role[]))', t);
  end loop;
end $$;
create policy "members read published announcements" on public.announcements for select to authenticated using (status = 'published' or created_by = (select auth.uid()) or public.has_org_role(organisation_id, array['org_admin','manager','department_head']::public.org_role[]));
create policy "platform administrators read their row" on public.platform_administrators for select to authenticated using (user_id = (select auth.uid()));
create policy "review participants read reviews" on public.performance_reviews for select to authenticated using (subject_user_id = (select auth.uid()) or reviewer_user_id = (select auth.uid()) or public.has_org_role(organisation_id, array['org_admin','manager','department_head']::public.org_role[]));
create policy "review participants read evidence" on public.performance_evidence for select to authenticated using (public.has_org_role(organisation_id, array['org_admin','manager','department_head']::public.org_role[]) or exists (select 1 from public.performance_reviews r where r.id = review_id and (r.subject_user_id = (select auth.uid()) or r.reviewer_user_id = (select auth.uid()))));
create policy "users read own notifications" on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create policy "users update own notifications" on public.notifications for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "message participants read messages" on public.messages for select to authenticated using (sender_user_id = (select auth.uid()) or recipient_user_id = (select auth.uid()));
create policy "members send messages" on public.messages for insert to authenticated with check (sender_user_id = (select auth.uid()) and public.is_org_member(organisation_id));
create policy "recipients mark messages read" on public.messages for update to authenticated using (recipient_user_id = (select auth.uid())) with check (recipient_user_id = (select auth.uid()));
create policy "members create tasks" on public.tasks for insert to authenticated with check (public.is_org_member(organisation_id) and created_by = (select auth.uid()) and (assignee_user_id is null or assignee_user_id = (select auth.uid())));
create policy "members update their tasks" on public.tasks for update to authenticated using (public.is_org_member(organisation_id) and (created_by = (select auth.uid()) or assignee_user_id = (select auth.uid()))) with check (public.is_org_member(organisation_id) and (created_by = (select auth.uid()) or assignee_user_id = (select auth.uid())));
create policy "users create own notifications" on public.notifications for insert to authenticated with check (user_id = (select auth.uid()) and public.is_org_member(organisation_id));
create policy "members add subtasks to their tasks" on public.task_subtasks for insert to authenticated with check (public.is_org_member(organisation_id) and exists (select 1 from public.tasks t where t.id = task_id and t.organisation_id = public.task_subtasks.organisation_id and (t.created_by = (select auth.uid()) or t.assignee_user_id = (select auth.uid()))));
create policy "members update subtasks on their tasks" on public.task_subtasks for update to authenticated using (public.is_org_member(organisation_id) and exists (select 1 from public.tasks t where t.id = task_id and t.organisation_id = public.task_subtasks.organisation_id and (t.created_by = (select auth.uid()) or t.assignee_user_id = (select auth.uid())))) with check (public.is_org_member(organisation_id) and exists (select 1 from public.tasks t where t.id = task_id and t.organisation_id = public.task_subtasks.organisation_id and (t.created_by = (select auth.uid()) or t.assignee_user_id = (select auth.uid()))));
create policy "members create own individual goals" on public.goals for insert to authenticated with check (public.is_org_member(organisation_id) and level = 'individual' and owner_user_id = (select auth.uid()) and created_by = (select auth.uid()));
create policy "owners update own individual goals" on public.goals for update to authenticated using (level = 'individual' and owner_user_id = (select auth.uid()) and public.is_org_member(organisation_id)) with check (level = 'individual' and owner_user_id = (select auth.uid()) and public.is_org_member(organisation_id));
create policy "owners add own goal updates" on public.goal_updates for insert to authenticated with check (created_by = (select auth.uid()) and public.is_org_member(organisation_id) and exists (select 1 from public.goals g where g.id = public.goal_updates.goal_id and g.organisation_id = public.goal_updates.organisation_id and g.owner_user_id = (select auth.uid())));

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

do $$ declare t text; begin
  foreach t in array array['departments','staff_profiles','tasks','goals','assets','announcements'] loop
    execute format('create trigger audit_%I after insert or update or delete on public.%I for each row execute procedure public.write_activity_log()', t, t);
  end loop;
end $$;
create trigger track_asset_assignment after insert or update of assigned_user_id, department_id on public.assets for each row execute procedure public.track_asset_assignment();

insert into storage.buckets (id, name, public) values ('org-files', 'org-files', false) on conflict (id) do nothing;
create policy "members read workspace files" on storage.objects for select to authenticated using (bucket_id = 'org-files' and public.is_org_member((storage.foldername(name))[1]::uuid));
create policy "managers upload workspace files" on storage.objects for insert to authenticated with check (bucket_id = 'org-files' and public.has_org_role((storage.foldername(name))[1]::uuid, array['org_admin','manager','department_head']::public.org_role[]));
create policy "managers update workspace files" on storage.objects for update to authenticated using (bucket_id = 'org-files' and public.has_org_role((storage.foldername(name))[1]::uuid, array['org_admin','manager','department_head']::public.org_role[])) with check (bucket_id = 'org-files' and public.has_org_role((storage.foldername(name))[1]::uuid, array['org_admin','manager','department_head']::public.org_role[]));
create policy "managers delete workspace files" on storage.objects for delete to authenticated using (bucket_id = 'org-files' and public.has_org_role((storage.foldername(name))[1]::uuid, array['org_admin','manager','department_head']::public.org_role[]));
