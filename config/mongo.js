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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Return the connected client
        return client;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

module.exports = connectToAtlas;
