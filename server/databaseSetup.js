const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

// Create a PostgreSQL pool
const db = new Pool({
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost', //<-
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Function to test the database connection
const testConnection = async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0].now);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

// Function to create the "videorec" schema if it doesn't exist
const createSchema = async () => {
  const createSchemaQuery = 'CREATE SCHEMA IF NOT EXISTS "videorec"';
  try {
    await db.query(createSchemaQuery);
    console.log("Schema 'videorec' created or already exists.");
  } catch (err) {
    console.error("Error creating schema 'videorec':", err);
    throw err;
  }
};

// Function to create the "videos" table if it doesn't exist
const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "videorec"."videos" (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      url TEXT NOT NULL,
      uploadDate TIMESTAMP NOT NULL,
      rating INT NOT NULL
    )`;

  try {
    await db.query(createTableQuery);
    console.log("Table 'videos' created or already exists.");
  } catch (err) {
    console.error("Error creating the 'videos' table:", err);
    throw err;
  }
};

// Function to populate the table from videos
const populateTable = async () => {
  const jsonFilePath = './exampleresponse.json';
  const jsonVideos = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

  for (const video of jsonVideos) {
    try {
      const existingVideo = await db.query(
        'SELECT id FROM "videorec"."videos" WHERE url = $1',
        [video.url]
      );

      if (existingVideo.rows.length === 0) {
        // Insert the video into the database only if it doesn't exist
        await db.query(
          'INSERT INTO "videorec"."videos" (title, url, uploadDate, rating) VALUES ($1, $2, $3, $4)',
          [video.title, video.url, new Date(), video.rating]
        );
        console.log(`Inserted video: ${video.title}`);
      } else {
        console.log(`Video already exists: ${video.title}`);
      }
    } catch (error) {
      console.error('Error inserting video into the database:', error);
      throw error;
    }
  }

  console.log("Populated 'videos' table from exampleresponse.json");
};

module.exports = {
  createSchema,
  createTable,
  populateTable,
  testConnection,
  db, // Export the db instance
};
