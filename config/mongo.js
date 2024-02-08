// mongo.js
const { MongoClient, ServerApiVersion } = require('mongodb');
const cluster = process.env.cluster;
const user = process.env.user;

const uri = `mongodb+srv://${user}@${cluster}/?retryWrites=true&w=majority`;

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
