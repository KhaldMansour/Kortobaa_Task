const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
const bodyParser = require('body-parser');
const db = require('./src/database/connection');
const dotenv = require('dotenv').config()



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const users = require('./routes/UserRoutes');
const products = require('./routes/ProductRoutes')

app.use("/api/users" , users)
app.use("/api/products" , products)



app.listen(PORT , console.log(process.env.hey));