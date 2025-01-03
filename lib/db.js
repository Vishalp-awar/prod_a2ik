const { MongoClient } = require("mongodb");

let db; // Cached database connection

const connectToDatabase = async () => {
  if (db) {
    // Return the cached connection if already connected
    return db;
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);

    // Establish the connection
    await client.connect();

    console.log("Connected to Database");
    db = client.db("analytics"); // Replace 'analytics' with your database name
    return db;
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    console.error("Stack trace:", error.stack);
    throw error; // Rethrow the error for higher-level handling
  }
};

module.exports = connectToDatabase;
