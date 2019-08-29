const express = require('express');
const morgan = require('morgan')
const app = express()
const bodyparser = require('body-parser')
// const router = express.Router();

// const {Pool, Client} = require('pg')

// const connectionString = 'postgressql://postgres:admin123@localhost:5432/BANK'

// const client = new Client({
//     connectionString:connectionString
// })

// client.connect()

// client.query('SELECT * from banks', (err, res) => {
//     console.log(err, res)
//     client.end()
// });

// var pg = require('pg');

// var conString = process.env.DATABASE_URL || "postgres://mofuiknrtdlrju:129dd1ed50a736ae395a2b4d13f6c98317628b9def66e9beaf15e8c2008bc32e@ec2-23-21-91-183.compute-1.amazonaws.com:5432/d4iq9173sc9hqf";
// var client = new pg.Client(conString);

// client.connect();

const bankingRoutes = require('./api/routes/banking');
const branchRoutes = require('./api/routes/branches');
const userRoutes = require('./api/routes/users')

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method == 'OPTIONS')
    {
        req.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/banking', bankingRoutes);
app.use('/branches', branchRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const err = new Error("NOT FOUND");
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    res.json({
        ERRmessage: err.message,
        ERRstatus: err.status
    });
});

module.exports = app;