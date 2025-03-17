import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure required environment variables exist
if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.error("Missing DB_USER or DB_PASSWORD environment variables");
  process.exit(1);
}

// MongoDB Connection (Persistent)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.djg6r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let client;
let coffeeCollection;
let userCollection;

// Connect to MongoDB once and reuse the connection
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    console.log("Connected to MongoDB");

    // Set collections
    const db = client.db('coffeeDB');
    coffeeCollection = db.collection('coffee');
    userCollection = db.collection('users');
  }
}

connectToDatabase().catch(console.dir);

// API Endpoints
app.get('/coffee', async (req, res) => {
  try {
    const result = await coffeeCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch coffee data" });
  }
});

app.post('/coffee', async (req, res) => {
  try {
    const newCoffee = req.body;
    const result = await coffeeCollection.insertOne(newCoffee);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to add coffee" });
  }
});

app.get('/coffee/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await coffeeCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch coffee" });
  }
});

app.put('/coffee/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedCoffee = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: updatedCoffee };
    const result = await coffeeCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to update coffee" });
  }
});

app.delete('/coffee/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await coffeeCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete coffee" });
  }
});

// Users API
app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    const result = await userCollection.insertOne(newUser);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to add user" });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await userCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch user" });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: updatedUser };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to update user" });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete user" });
  }
});

// Test Route
app.get('/', (req, res) => {
  res.send('Hello from Express Server!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
