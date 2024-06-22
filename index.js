const express = require('express');
const app = express();
const cors = require("cors");
const passport = require('passport');

const connection   = require('./config/database');

require('dotenv').config();

// Load Route
const authRoute = require('./route/auth');
const categoryRoute = require('./route/category');
const subcategoryRoute = require('./route/subcategory');
const productRoute = require('./route/product');
const orderRoute = require('./route/order');
const itemSubCategory = require('./route/itemsubcategory');
const manufacter = require('./route/manufacter');
// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

require('./config/passport');
app.use(passport.initialize());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


app.use('/uploads', express.static('uploads'));


app.use('/api/auth', authRoute);
app.use('/api/category', categoryRoute);
app.use('/api/subcategory', subcategoryRoute);
app.use('/api/product', productRoute);
app.use('/api/order', orderRoute);
app.use('/api/itemsubcategory', itemSubCategory);
app.use('/api/manufacter', manufacter);

const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
    connection.connect(function (err) {
        if (err) throw err;
        console.log("Database connected")
    })
})

