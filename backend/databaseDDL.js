const { Pool } = require('pg');

async function createdb() {
    let database = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'secure_software',
        user: 'postgres',
        password: 'password',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });

    await database.query(`create schema user_data`);
    await database.query(`set search_path to user_data;`);
    await database.query(`create table users(
        user_id serial NOT NULL,
        name varchar,
        user_name varchar,
        user_name_hash varchar,
        email_address varchar,
        email_hash varchar,
        password varchar,
        salt varchar,
        twoFA varchar,
        encryption_key varchar,
        constraint pk_users PRIMARY KEY (
            user_id
            )
        )`);

    await database.query(`create table posts(
        post_id serial NOT NULL,
        user_id int NOT NULL,
        title varchar(100),
        body varchar,
        created_at date,
        updated_at date,
        constraint pk_posts PRIMARY KEY (
            post_id
        )
    )`);

    await database.query(`ALTER TABLE posts ADD CONSTRAINT fk_user_id FOREIGN KEY(user_id)
    REFERENCES users (user_id);`);
    console.log('done');
}

createdb();
