const { Pool } = require("pg");

async function createdb() {
    let database = new Pool({
        host: "localhost",
        port: 5432,
        database: "secure_software",
        user: "postgres",
        password: "password",
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });

    try {
        // Drop the schema and cascade if it exists
        await database.query(`DROP SCHEMA IF EXISTS user_data CASCADE`);

        // Create the schema
        await database.query(`CREATE SCHEMA user_data`);

        // Set the search path to the new schema
        await database.query(`SET search_path TO user_data`);

        // Create the "users" table
        await database.query(`
            CREATE TABLE users (
                user_id SERIAL NOT NULL,
                name VARCHAR,
                user_name VARCHAR,
                email_address VARCHAR,
                password VARCHAR,
                salt VARCHAR,
                twoFA VARCHAR,
                CONSTRAINT pk_users PRIMARY KEY (user_id)
            )
        `);

        // Create the "posts" table
        await database.query(`
            CREATE TABLE posts (
                post_id SERIAL NOT NULL,
                user_id INT NOT NULL,
                title VARCHAR(100),
                body VARCHAR,
                created_at DATE,
                updated_at DATE,
                CONSTRAINT pk_posts PRIMARY KEY (post_id),
                CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        `);

        console.log("Schema and tables created successfully.");
    } catch (error) {
        console.error("Error creating schema and tables:", error);
        process.exit(1); // Exit the script with an error code
    } finally {
        await database.end(); // Close the database connection
        console.log("Exiting");
        process.exit(0); // Exit the script with a success code
    }
}

createdb();
