const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());
console.log();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.some2ew.mongodb.net/?retryWrites=true&w=majority`;

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
    
    const chocolateCollection = client.db('chocolateDB').collection('chocolate');

    app.post('/chocolates', async (req, res) => {
        const newChocolate = req.body;
        const result = await chocolateCollection.insertOne(newChocolate);
        res.send(result);
    })

    app.get('/chocolates', async (req, res) => {
        const cursor = chocolateCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.delete('/chocolates/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await chocolateCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Chocolate Management Server');
})

app.listen(port, () => {
    console.log(`Chocholate Server Running on PORT ${port}`);
})