create table if not exists users (
    id bigserial primary key,
    telegram_id text unique not null,
    username text,
    first_name text,
    avatar text,
    photo_url text,
    level text default 'Bronze',
    coins bigint default 0,
    total_coins bigint default 0,
    energy integer default 1000,
    max_energy integer default 1000,
    coins_per_tap integer default 1,
    coins_per_hour integer default 0,
    wallet_address text,
    clan_slug text,
    referrals integer default 0,
    referred_by text,
    extra_tap integer default 0,
    is_vip boolean default false,
    shield_until timestamptz,
    total_taps bigint default 0,
    best_day_taps bigint default 0,
    streak integer default 0,
    daily_streak integer default 0,
    last_daily_reset date,
    last_daily_claim date,
    cards jsonb default '[]'::jsonb,
    boosts jsonb default '[]'::jsonb,
    settings jsonb default '{}'::jsonb,
    last_seen timestamptz default now(),
    created_at timestamptz default now()
);

create table if not exists notifications (
    id bigserial primary key,
    telegram_id text not null,
    type text not null,
    sent_date date not null,
    created_at timestamptz default now()
);

create unique index if not exists notifications_once_per_day
on notifications (telegram_id, type, sent_date);

create table if not exists missions (
    id bigserial primary key,
    telegram_id text not null,
    mission_id text not null,
    completed_at date not null,
    reward integer default 0,
    created_at timestamptz default now()
);

create table if not exists wheel_spins (
    id bigserial primary key,
    telegram_id text not null,
    reward text,
    reward_value integer default 0,
    reward_id text,
    reward_payload jsonb default '{}'::jsonb,
    spun_date date not null,
    created_at timestamptz default now()
);

create table if not exists daily_rewards (
    id bigserial primary key,
    telegram_id text not null,
    day_streak integer default 1,
    reward integer default 0,
    claimed_date date not null,
    created_at timestamptz default now()
);

create table if not exists boosts_usage (
    id bigserial primary key,
    telegram_id text not null,
    boost_id text not null,
    started_at timestamptz default now(),
    expires_at timestamptz,
    cooldown_until timestamptz
);

create table if not exists task_progress (
    id bigserial primary key,
    telegram_id text not null,
    task_id text not null,
    progress integer default 0,
    completed boolean default false,
    updated_at timestamptz default now()
);

create table if not exists clans (
    id bigserial primary key,
    slug text unique not null,
    name text not null,
    owner_telegram_id text not null,
    description text,
    members_count integer default 1,
    total_points bigint default 0,
    created_at timestamptz default now()
);

create table if not exists clan_members (
    id bigserial primary key,
    clan_id bigint references clans(id) on delete cascade,
    telegram_id text not null,
    role text default 'member',
    joined_at timestamptz default now()
);

create table if not exists chat_messages (
    id bigserial primary key,
    telegram_id text not null,
    username text,
    message text not null,
    created_at timestamptz default now()
);

create table if not exists promo_codes (
    id bigserial primary key,
    code text unique not null,
    reward_type text not null,
    reward_amount integer default 0,
    reward_coins integer default 0,
    max_uses integer default 100,
    used_count integer default 0,
    current_uses integer default 0,
    expires_at timestamptz
);

create table if not exists promo_redemptions (
    id bigserial primary key,
    promo_code_id bigint references promo_codes(id) on delete cascade,
    telegram_id text not null,
    redeemed_at timestamptz default now()
);

create table if not exists promo_uses (
    id bigserial primary key,
    telegram_id text not null,
    code text not null,
    created_at timestamptz default now()
);

create table if not exists shop_purchases (
    id bigserial primary key,
    telegram_id text not null,
    item_id text not null,
    price_coins bigint,
    price_ton numeric,
    created_at timestamptz default now()
);

create table if not exists withdrawals (
    id bigserial primary key,
    telegram_id text not null,
    wallet_address text not null,
    amount bigint not null,
    status text default 'pending',
    created_at timestamptz default now(),
    processed_at timestamptz
);

create table if not exists tap_events (
    id bigserial primary key,
    telegram_id text not null,
    tap_count integer default 1,
    created_at timestamptz default now()
);

create index if not exists idx_users_telegram_id on users(telegram_id);
create index if not exists idx_missions_telegram_id on missions(telegram_id);
create index if not exists idx_wheel_spins_telegram_id on wheel_spins(telegram_id);
create index if not exists idx_chat_messages_created_at on chat_messages(created_at desc);
