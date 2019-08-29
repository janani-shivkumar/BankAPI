const express = require('express');
const morgan = require('morgan')
const app = express()
const bodyparser = require('body-parser')

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