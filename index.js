const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// hunterit
// lYxmTPY7SrapRMuT


// middlewere
app.use(express.json())
app.use(cors())



const uri = "mongodb+srv://hunterit:lYxmTPY7SrapRMuT@cluster0.dsq3s3c.mongodb.net/?retryWrites=true&w=majority";

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

    const productdb = client.db('product');
    const productCollection = productdb.collection('product')

    const cartdb = client.db('cart');
    const cartCollection = cartdb.collection('cart')

    app.post('/product', async (req,res)=>{
        const product = req.body;
        const result = await productCollection.insertOne(product)
        res.send(result)
    })

    app.get('/product', async (req,res)=>{
      const result = await productCollection.find().toArray();
      res.send(result)
    })

    app.get('/product/:id', async (req,res)=>{
      const id = req.params.id;
      console.log(id);
      const filter = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(filter);
      res.send(result)
    })

    app.put('/product/:id', async (req,res)=>{
      const id = req.params.id;
      console.log(id);
      const formValue = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const update = {
        $set: {
          imglink:formValue.imglink,
          name:formValue.name,
          Bname:formValue.Bname,
          type:formValue.type,
          price:formValue.price,
          rating:formValue.rating,
          description:formValue.description,
        },
      };
      const result = await productCollection.updateOne(filter,update,options)
      console.log(result);
      res.send(result)
    })

    app.post('/cart', async (req,res)=>{
      const product = req.body;
      const result = await cartCollection.insertOne(product)
      res.send(result)
  })

  app.get('/cart', async (req,res)=>{
    const result = await cartCollection.find().toArray();
    res.send(result)
  })

  app.delete('/cart/:id', async (req,res)=>{
    const id = req.params.id;
    console.log(id);
    const find = {_id:id}
    const result = await cartCollection.deleteOne(find)
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



app.get('/',(req,res)=>{
    res.send('Running Changed')
})

app.listen(port,()=>{
    console.log(`server in running on port ${port}`);
})