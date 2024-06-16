const express = require('express');
const cors = require('cors');
const {
  testConnection,
  createSchema,
  createTable,
  populateTable,
  db,
} = require('./databaseSetup');
const dbEndpoints = require('./dbEndpoints');

const app = express();
const port = process.env.PORT || 5001;
require('dotenv').config();

app.use(express.json());
app.use(cors());

// Use async IIFE to ensure database setup before starting the server
(async () => {
  try {
    await testConnection();
    await createSchema();
    await createTable();
    await populateTable();

    // Attach the endpoints only after the database is ready
    app.use('/videos', dbEndpoints(db));

    app.get('/', function (_, res) {
      res.status(200).json('hello world!');
    });

    const server = app.listen(port, () => {
      const { address, port } = server.address();
      const host = address === '::' ? 'localhost' : address;
      console.log(`Server is running at http://${host}:${port}`);
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1); // Exit the process with failure
  }
})();
