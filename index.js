const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4qhn1l.mongodb.net/?retryWrites=true&w=majority`;

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

    const collegeCollection = client.db("eduCare").collection("college");
    const researchCollection = client.db("eduCare").collection("research");
    const AdmittedCollection = client.db("eduCare").collection("admitted");

    app.get('/colleges', async(req, res) => {
        const result = await collegeCollection.find().toArray();
        res.send(result);
    })

    app.get('/research', async(req, res) => {
        const result = await researchCollection.find().toArray();
        res.send(result);
    })

    app.get('/admitted', async(req, res) => {
        const result = await AdmittedCollection.find().toArray();
        res.send(result);
    })


    

    app.get('/colleges/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: new ObjectId(id) };
        const result = await collegeCollection.findOne(query);
        console.log(result)
        res.send(result);
      });

      app.post("/admitted", async (req, res) => {
        const newItem = req.body;
        console.log(newItem)
        const result = await AdmittedCollection.insertOne(newItem);
        res.send(result);
      });

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Edu Care Server is Running')
})

app.listen(port, () => {
    console.log(`Edu Care is sitting on port ${port}`)
})