const { MongoClient } = require("mongodb");

let db; // Cached database connection

const connectToDatabase = async () => {
  if (db) { 
   
    return db; // Return cached connection if already connected
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true, // Ensure modern parsing
      useUnifiedTopology: true, // Remove if using MongoDB Node.js Driver 4.0+
    });

    // Establish the connection
    await client.connect();

    console.log("Connected to Database");
    db = client.db("analytics"); // Replace 'analytics' with your database name
    return db;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error; // Rethrow the error for higher-level handling
  }
};

module.exports = connectToDatabase;
