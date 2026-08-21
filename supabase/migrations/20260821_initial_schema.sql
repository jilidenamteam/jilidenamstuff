create extension if not exists "pgcrypto";

create table public.outlets (id uuid primary key default gen_random_uuid(), name text not null, address text, latitude numeric, longitude numeric, attendance_radius_m integer default 150, created_at timestamptz not null default now());
insert into public.outlets (name, address) values ('Jilid Enam', 'Seksyen 6, Shah Alam, Selangor');

create table public.items (id uuid primary key default gen_random_uuid(), name text not null, sku text unique, unit text not null default 'unit', reorder_level numeric default 0, active boolean not null default true, created_at timestamptz not null default now());
create table public.suppliers (id uuid primary key default gen_random_uuid(), name text not null, phone text, email text, created_at timestamptz not null default now());
create table public.stock_movements (id uuid primary key default gen_random_uuid(), item_id uuid not null references public.items(id), outlet_id uuid references public.outlets(id), movement_type text not null check (movement_type in ('purchase','sale','wastage','count_adjustment','transfer')), quantity numeric not null, unit_cost numeric, notes text, occurred_at timestamptz not null default now());
create table public.purchase_orders (id uuid primary key default gen_random_uuid(), supplier_id uuid references public.suppliers(id), status text not null default 'draft' check (status in ('draft','submitted','approved','received','cancelled')), total_amount numeric default 0, invoice_path text, created_at timestamptz not null default now());
create table public.purchase_order_lines (id uuid primary key default gen_random_uuid(), purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade, item_id uuid references public.items(id), quantity numeric not null, unit_cost numeric not null);
create table public.stock_counts (id uuid primary key default gen_random_uuid(), outlet_id uuid references public.outlets(id), counted_at timestamptz not null default now(), counted_by uuid, notes text);
create table public.stock_count_lines (id uuid primary key default gen_random_uuid(), stock_count_id uuid not null references public.stock_counts(id) on delete cascade, item_id uuid not null references public.items(id), quantity numeric not null);

create table public.sales_receipts (id uuid primary key default gen_random_uuid(), outlet_id uuid references public.outlets(id), receipt_number text not null unique, total_amount numeric not null check (total_amount >= 0), payment_method text not null, notes text, receipt_path text, sold_at timestamptz not null default now(), created_at timestamptz not null default now());
create table public.employees (id uuid primary key default gen_random_uuid(), full_name text not null, telegram_chat_id bigint unique, employment_status text not null default 'active', hourly_rate numeric, monthly_salary numeric, created_at timestamptz not null default now());
create table public.attendance_events (id uuid primary key default gen_random_uuid(), employee_id uuid references public.employees(id), telegram_chat_id bigint, event_type text not null, latitude numeric, longitude numeric, occurred_at timestamptz not null default now());
create table public.leave_requests (id uuid primary key default gen_random_uuid(), employee_id uuid not null references public.employees(id), leave_type text not null, start_date date not null, end_date date not null, reason text, status text not null default 'pending' check (status in ('pending','approved','rejected')), created_at timestamptz not null default now());
create table public.expense_claims (id uuid primary key default gen_random_uuid(), employee_id uuid not null references public.employees(id), category text not null, amount numeric not null check (amount >= 0), receipt_path text, status text not null default 'pending' check (status in ('pending','approved','rejected','paid')), created_at timestamptz not null default now());
create table public.payroll_periods (id uuid primary key default gen_random_uuid(), start_date date not null, end_date date not null, status text not null default 'open' check (status in ('open','approved','paid')), unique(start_date,end_date));
create table public.payroll_lines (id uuid primary key default gen_random_uuid(), payroll_period_id uuid not null references public.payroll_periods(id), employee_id uuid not null references public.employees(id), gross_pay numeric not null default 0, claims_amount numeric not null default 0, deductions numeric not null default 0, net_pay numeric not null default 0);

alter table public.sales_receipts enable row level security;
alter table public.items enable row level security;
alter table public.attendance_events enable row level security;
-- Add authenticated dashboard role policies before enabling browser reads/writes.
