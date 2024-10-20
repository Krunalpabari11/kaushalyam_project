// File: lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Accessing MongoDB URI from environment variables
const options = {};

let client;
let clientPromise;

// Log the JWT_SECRET for debugging (optional)

// Check if the MongoDB URI is set
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// Create a new MongoClient instance
client = new MongoClient(uri, options);
clientPromise = client.connect();

// Export the client promise
export default clientPromise;
