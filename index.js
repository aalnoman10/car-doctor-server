const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.ENV_PORT || 5000;
const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.ENV_NAME}:${process.env.ENV_PASS}@cluster0.hrkpt8c.mongodb.net/?retryWrites=true&w=majority`;
// const uriN = `mongodb+srv://${process.env.ENV_NAME}:${process.env.ENV_PASS}@cluster0.hrkpt8c.mongodb.net/?retryWrites=true&w=majority`;
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
        // await client.connect();

        const serviceCollection = client.db('carDoctor').collection('services')
        const bookingCollection = client.db('carDoctor').collection('bookings')

        // servicesCollection
        app.get('/services', async (req, res) => {
            const finding = serviceCollection.find()
            const result = await finding.toArray()
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, service_id: 1, img: 1, status: 1 },
            };

            const result = await serviceCollection.findOne(query, options)
            res.send(result)
        })

        // bookingCollection

        app.post('/bookings', async (req, res) => {
            const customer = req.body;
            const result = await bookingCollection.insertOne(customer)
            res.send(result)
        })

        app.get('/bookings', async (req, res) => {
            const email = req?.query?.email
            let query = {}
            if (email) {
                query = { email };
            }
            const finding = bookingCollection.find(query)
            const result = await finding.toArray()
            res.send(result)
        })


        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
        })

        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id
            const update = req.body.status

            const filter = { _id: new ObjectId(id) }

            const updateDoc = {
                $set: {
                    status: update
                },
            };

            const result = await bookingCollection.updateOne(filter, updateDoc)
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


app.get('/', (req, res) => {
    res.send('run')
})

app.listen(port, () => {
    console.log(port);
})