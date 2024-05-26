// mongo.js
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const MONGODB_HOST = process.env.MONGODB_HOST;
const MONGODB_USER = process.env.MONGODB_USER;

const uri = `mongodb+srv://${MONGODB_USER}@${MONGODB_HOST}/?retryWrites=true&w=majority&appName=discordcluster`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToAtlas() {
    try {
        await client.connect();
        return client;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

async function DBCollectionCreation(collection_name) {
    try {
        const db = client.db("test-db")
        const collection = db.collection(collection_name);
        return collection;

    } catch (error) {
        throw error
    }
    
}

module.exports = {connectToAtlas,  DBCollectionCreation};
