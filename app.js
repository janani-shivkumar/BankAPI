const express = require('express');
const morgan = require('morgan')
const app = express()
const bodyparser = require('body-parser')
const router = express.Router();

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

global.limit = 0
global.offset = 0

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

app.use('/setLimitOffset', router.post('/', (req, res, err) => {
    global.limit = req.params.limit
    global.offset = req.params.offset
}))

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