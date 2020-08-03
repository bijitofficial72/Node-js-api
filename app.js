const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();



// database  connecting 
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },)
    .then(() => console.log('DB is  Connected'));

     mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});

// bring in the routes

const postRoutes = require ("./routes/post")
const authRoutes = require ("./routes/auth")
const userRoutes = require ("./routes/user")

// apiDocs
app.get('/', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});
//middleware provides path directory in our development phase
app.use(morgan('dev'));

// for json as express doest validate json format by own 
app.use(bodyParser.json());

app.use(cookieParser());

// for viewing error mesage
app.use(expressValidator());



app.use("/",postRoutes );
app.use("/",authRoutes );
app.use("/",userRoutes );

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized!' });
    }
});



const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
});