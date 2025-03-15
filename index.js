import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//MongoDB Connection String
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.djg6r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(process.env.DB_USER);
console.log();

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Database and Collection
    const coffeeCollection = client.db('coffeeDB').collection('coffee')

    //GET All Coffees
    app.get('/coffee',async(req,res)=>{
      const cursor = coffeeCollection.find();
      const result= await cursor.toArray();
      res.send(result)
    })


    //POST all coffees
   app.post('/coffee',async (req,res)=>{
    const newCoffee = req.body;
    console.log(newCoffee);
    const result = await coffeeCollection.insertOne(newCoffee);
    res.send(result)
   })

   //GET A Single Coffee
   app.get('/coffee/:id',async (req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await coffeeCollection.findOne(query);
    res.send(result)
   })

   //UPDATE Coffee
   app.put('/coffee/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const options = {upsert: true};
    const updatedCoffee = req.body;
    const coffee = {
      $set:{
        name:updatedCoffee.name,
        quantiy:updatedCoffee.quantity,
        supplier:updatedCoffee.supplier,
        taste:updatedCoffee.taste,
        category:updatedCoffee.category,
        details:updatedCoffee.details,
        photo:updatedCoffee.photo
      }
    }
    const result = await coffeeCollection.updateOne(filter,coffee,options);
    res.send(result)
   })


   //DELETE Coffee
   app.delete('/coffee/:id',async (req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await coffeeCollection.deleteOne(query);
    res.send(result)
   })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Test Route
app.get('/', (req, res) => {
    res.send('Hello from Express Server!');
});

// Server Start
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
