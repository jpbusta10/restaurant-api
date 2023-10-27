create extension if not exists "uuid-ossp";

create table roles (
    rol_id uuid default uuid_generate_v4() primary key unique not null,
    rol_name varchar(256) not null
);
create table users (
    user_id uuid default uuid_generate_v4() primary key unique not null,
    first_name varchar(256) NOT NULL,
    last_name varchar(256) NOT NULL,
    email varchar(256) NOT NULL,
    hashed_pass char(97) not null,
    user_name varchar(256) not null unique,
    dni varchar(256) not null,
    rol_id uuid not null,
    constraint fk_rol_id foreign key (rol_id) references roles (rol_id) on delete cascade
);
create table restaurants (
    restaurant_id uuid default uuid_generate_v4() primary key unique not null,
    res_name varchar(256),
    adress varchar(256),
    manager_id uuid not null,

    constraint fk_manager_id foreign key (manager_id) references users (user_id) on delete cascade
);

create table tables (
    table_id uuid default uuid_generate_v4() primary key unique not null,
    table_name varchar(256),
    isReserved boolean,
    restaurant_id uuid not null,
    capacity integer not null,
    constraint fk_restaurant_id foreign key (restaurant_id) references restaurants (restaurant_id) on delete cascade
);
create table states(
    state_id uuid default uuid_generate_v4() primary key unique not null,
    state_name varchar(256) not null
);
create table reservations (
    reservation_id uuid default uuid_generate_v4() primary key unique not null,
    user_id uuid not null,
    restaurant_id uuid not null,
    state_id uuid not null,
    res_size integer not null,
    due_date timestamp not null,
    res_date timestamp default NOW(),
    comment varchar(256),
    constraint fk_user_id foreign key (user_id) references users (user_id) on delete cascade,
    constraint fk_restaurant_id foreign key (restaurant_id) references restaurants (restaurant_id) on delete cascade,
    constraint fk_res_state foreign key (state_id) references states (state_id) on delete cascade
);
create table reservation_table (
    reservation_table_id uuid default uuid_generate_v4() primary key unique not null,
    table_id uuid not null,
    reservation_id uuid not null,
    constraint fk_table_id foreign key (table_id) references tables (table_id) on delete cascade,
    constraint fk_reservation_id foreign key (reservation_id) references reservations (reservation_id) on delete cascade
);


create table categories (
    id_categories uuid default uuid_generate_v4() primary key unique not null,
    categorie_name varchar(256)
);
create table restaurant_categorie (
    restaurant_categorie_id uuid default uuid_generate_v4() primary key unique not null,
    restaurant_id uuid not null,
    categorie_id uuid not null,
    constraint fk_restaurant_id foreign key (restaurant_id) references restaurants (restaurant_id) on delete cascade,
    constraint fk_categorie_id foreign key (categorie_id) references categories (id_categories) on delete cascade
);

create table favorites (
    favorites_id uuid default uuid_generate_v4() primary key unique not null,
    user_id uuid not null,
    restaurant_id uuid not null,
    constraint fk_user_id foreign key (user_id) references users (user_id) on delete cascade,
    constraint fk_restaurant_id foreign key (restaurant_id) references restaurants (restaurant_id) on delete cascade
);

insert into roles (rol_name) values ('client');
insert into roles (rol_name) values ('res_admin');
