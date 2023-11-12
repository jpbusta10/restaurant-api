create extension if not exists "uuid-ossp";

create table roles (
    rol_id uuid default uuid_generate_v4() primary key unique not null,
    rol_name varchar(256) not null
);
create table users (
    user_id uuid default uuid_generate_v4() primary key unique not null,
    first_name varchar(256) NOT NULL,
    last_name varchar(256) NOT NULL,
    email varchar(256) NOT NULL unique,
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

CREATE TABLE tables (
    table_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    table_number INTEGER NOT NULL,
    isReserved BOOLEAN,
    restaurant_id UUID NOT NULL,
    capacity INTEGER NOT NULL,
    CONSTRAINT uc_table_number_per_restaurant UNIQUE (table_number, restaurant_id),
    CONSTRAINT fk_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurants (restaurant_id) ON DELETE CASCADE
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
    constraint fk_categorie_id foreign key (categorie_id) references categories (id_categories) on delete cascade,
    constraint unq_cat_per_res unique (restaurant_id, categorie_id)
);

create table favorites (
    favorites_id uuid default uuid_generate_v4() primary key unique not null,
    user_id uuid not null,
    restaurant_id uuid not null,
    constraint fk_user_id foreign key (user_id) references users (user_id) on delete cascade,
    constraint fk_restaurant_id foreign key (restaurant_id) references restaurants (restaurant_id) on delete cascade,
    constraint unq_fav_per_user unique (user_id, restaurant_id)

);

insert into roles (rol_name) values ('client');
insert into roles (rol_name) values ('res_admin');
insert into states (state_name) values ('confirmed');
insert into states (state_name) values ('toConfirm');
insert into states (state_name) values ('cancelled');
insert into categories (categorie_name) values ('parrilla');
insert into categories (categorie_name) values ('sushi');
insert into categories (categorie_name) values ('vegano');
insert into categories (categorie_name) values ('pasta');
insert into categories (categorie_name) values ('italiana');
insert into categories (categorie_name) values ('china');
insert into categories (categorie_name) values ('rapida');
insert into categories (categorie_name) values ('pescado');
insert into categories (categorie_name) values ('cafeteria');
insert into categories (categorie_name) values ('pizza');
insert into categories (categorie_name) values ('hamburguesa');
insert into categories (categorie_name) values ('bar');
insert into categories (categorie_name) values ('vinoteca');

CREATE OR REPLACE PROCEDURE create_reservation(
    p_user_id uuid,
    p_restaurant_id uuid,
    p_state_name varchar(256),
    p_res_size integer,
    p_due_date timestamp,
    p_comment varchar(256)
)
LANGUAGE plpgsql
AS $$
DECLARE
    reservation_id uuid;
    state_id uuid;
BEGIN
    BEGIN
        SELECT state_id INTO state_id FROM states WHERE state_name = p_state_name;
        IF state_id IS NULL THEN
            RAISE EXCEPTION 'State with name % not found', p_state_name;
        END IF;

        -- Your INSERT statement here
        INSERT INTO reservations (user_id, restaurant_id, state_id, res_size, due_date, comment)
        VALUES (p_user_id, p_restaurant_id, states.state_id, p_res_size, p_due_date, p_comment)
        RETURNING reservation_id INTO reservation_id;

        -- Handle success here

    EXCEPTION
        WHEN others THEN
            -- In case of an error, handle the exception
            RAISE EXCEPTION 'Error creating reservation: %', SQLERRM;
    END;
END;
$$;
