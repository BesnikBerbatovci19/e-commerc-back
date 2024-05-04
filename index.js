const express = require('express');
const app = express();
const cors = require("cors");
const passport = require('passport');

const connection = require('./config/database');

require('dotenv').config();

// Load Route
const authRoute = require('./route/auth');
const categoryRoute = require('./route/category');
const subcategoryRoute = require('./route/subcategory');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(function (req, res, next)  {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

require('./config/passport');
app.use(passport.initialize()); 


app.use('/uploads',express.static('uploads'));


app.use('/api/auth', authRoute);
app.use('/api/category', categoryRoute);
app.use('/api/subcategory', subcategoryRoute);

const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Database connected")
    })
})

